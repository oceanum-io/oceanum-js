import {
  set as set_cache,
  get as get_cache,
  del as del_cache,
  createStore,
  UseStore,
} from "idb-keyval";
import hash from "object-hash";
import { AsyncReadable, AsyncMutable, Readable } from "@zarrita/storage";
import { Array as ZArray, Location, Attributes } from "@zarrita/core";

function delay(t: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, t));
}

interface CachedHTTPStoreOptions {
  parameters?: Record<string, string | number>;
  chunks?: string;
  downsample?: Record<string, number>;
  nocache?: boolean;
  timeout?: number;
}

export class CachedHTTPStore implements AsyncReadable {
  cache: UseStore | undefined;
  url: string;
  params: Record<string, string>;
  cache_prefix: string;
  fetchOptions: RequestInit;
  timeout: number;
  _pending: Record<string, boolean> = {};

  constructor(
    root: string,
    authHeaders: Record<string, string>,
    options: CachedHTTPStoreOptions = {}
  ) {
    // Create a copy of the auth headers to avoid modifying the original
    // Important: We need to preserve all auth headers, including session headers
    const headers = { ...authHeaders };

    // Add parameters, chunks, and downsample as headers if provided
    if (options.parameters)
      headers["x-parameters"] = JSON.stringify(options.parameters);
    if (options.chunks) headers["x-chunks"] = options.chunks;
    if (options.downsample)
      headers["x-downsample"] = JSON.stringify(options.downsample);
    headers["x-filtered"] = "True";

    this.params = {};
    if (authHeaders["x-datamesh-auth"]) {
      this.params["auth"] = authHeaders["x-datamesh-auth"];
    }
    if (authHeaders["x-datamesh-sig"]) {
      this.params["sig"] = authHeaders["x-datamesh-sig"];
    }

    this.fetchOptions = { headers };

    this.url = root;
    const datasource = root.split("/").pop();

    // Determine if caching should be used
    if (options.nocache || typeof window === "undefined") {
      this.cache = undefined;
    } else {
      this.cache = createStore("zarr", "cache");
    }

    // Create a cache prefix based on datasource and options
    // Note: We don't include auth headers in the cache key to avoid leaking sensitive information
    this.cache_prefix = hash({
      datasource,
      ...options.parameters,
      chunks: options.chunks,
      downsample: options.downsample,
    });
    this.timeout = options.timeout || 60000;
  }

  async get(
    item: AbsolutePath,
    options?: RequestInit,
    retry = 0
  ): Promise<Uint8Array | undefined> {
    const key = `${this.cache_prefix}${item}`;
    let data = null;
    if (this.cache) {
      data = await get_cache(key, this.cache);
      if (data) delete this._pending[key];
      if (this._pending[key]) {
        await delay(200);
        //console.debug("Zarr pending:" + key);
        if (retry > this.timeout) {
          await del_cache(key, this.cache);
          delete this._pending[key];
          console.error("Zarr timeout");
          return undefined;
        } else {
          return await this.get(item, options, retry + 200);
        }
      }
    }
    if (!data) {
      this._pending[key] = true;
      try {
        // Ensure we're preserving the headers from fetchOptions when making the request
        const requestOptions = {
          ...this.fetchOptions,
          ...options,
          headers: {
            ...(this.fetchOptions.headers || {}),
            ...(options?.headers || {}),
          },
          signal: AbortSignal.timeout(this.timeout),
        };
        const query = new URLSearchParams(this.params).toString();
        const response = await fetch(
          `${this.url}${item}?${query}`,
          requestOptions
        );

        if (response.status === 404) {
          // Item is not found
          if (this.cache) await del_cache(key, this.cache);
          return undefined;
        }
        if (response.status >= 400) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        data = new Uint8Array(await response.arrayBuffer());
        if (this.cache) await set_cache(key, data, this.cache);
      } catch (e) {
        console.debug("Zarr retry:" + key);
        if (retry < this.timeout / 200) {
          delete this._pending[key];
          return await this.get(item, options, retry + 200);
        }
        if (this.cache) await del_cache(key, this.cache);
        console.error(e);
        return undefined;
      } finally {
        delete this._pending[key];
      }
    }
    return data;
  }
}

export class IDBStore implements AsyncMutable {
  cache: UseStore;
  constructor(public root: string) {
    this.cache = createStore(root, "store");
  }

  async get(key: AbsolutePath): Promise<Uint8Array | undefined> {
    try {
      return await get_cache(key, this.cache);
    } catch {
      return undefined;
    }
  }

  async has(key: AbsolutePath): Promise<boolean> {
    return (await get_cache(key, this.cache)) !== undefined;
  }

  async set(key: AbsolutePath, value: Uint8Array): Promise<void> {
    await set_cache(key, value, this.cache);
  }

  async delete(key: AbsolutePath): Promise<void> {
    await del_cache(key, this.cache);
  }
}

const load_meta = async (location: Location<Store>, item = ".zarray") => {
  const { path } = location.resolve(item);
  const meta = await location.store.get(path);
  if (!meta) {
    return {};
  }
  return JSON.parse(new TextDecoder().decode(meta));
};

//This is modified from the zarrita core library to patch for datetime support
export async function zarr_open_v2_datetime<Store extends Readable>(
  location: Location<Store>
) {
  const attrs = await load_meta(location, ".zattrs");
  const meta = await load_meta(location);
  if (meta.dtype.startsWith("<M8")) {
    attrs._dtype = meta.dtype;
  }
  const codecs: any[] = [];

  if (meta.order === "F") {
    codecs.push({ name: "transpose", configuration: { order: "F" } });
  }
  // Detect big-endian from v2 dtype string (e.g., ">i4"). If so, add a bytes codec.
  if (typeof meta.dtype === "string" && meta.dtype.startsWith(">")) {
    codecs.push({ name: "bytes", configuration: { endian: "big" } });
  }
  for (const { id, ...configuration } of meta.filters ?? []) {
    codecs.push({ name: id, configuration });
  }
  if (meta.compressor) {
    const { id, ...configuration } = meta.compressor;
    codecs.push({ name: id, configuration });
  }
  const v3_metadata = {
    zarr_format: 3,
    node_type: "array",
    shape: meta.shape,
    data_type: "int64",
    chunk_grid: {
      name: "regular",
      configuration: {
        chunk_shape: meta.chunks,
      },
    },
    chunk_key_encoding: {
      name: "v2",
      configuration: {
        separator: meta.dimension_separator ?? ".",
      },
    },
    codecs,
    fill_value: meta.fill_value,
    attributes: attrs,
  };
  return new ZArray(location.store, location.path, v3_metadata);
}
