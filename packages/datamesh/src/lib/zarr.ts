import {
  set as set_cache,
  get as get_cache,
  del as del_cache,
  createStore,
  UseStore,
} from "idb-keyval";
import hash from "object-hash";
import { AsyncReadable, AsyncMutable, AbsolutePath } from "@zarrita/storage";


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
      if (this._pending[key]) {
        await delay(200);
        if (retry > this.timeout / 200) {
          await del_cache(key, this.cache);
          throw new Error("Zarr timeout");
        } else {
          return await this.get(item, options, retry + 1);
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
        } else if (response.status >= 400) {
          if (retry > this.timeout / 200) {
            return undefined;
          } else {
            return await this.get(item, options, retry + 60);
          }
        }
        data = new Uint8Array(await response.arrayBuffer());
        if (this.cache) await set_cache(key, data, this.cache);
      } catch (e) {
        if (this.cache) await del_cache(key, this.cache);
        this._pending[key] = false;
        throw e; // Re-throw the error to propagate it
      } finally {
        this._pending[key] = false;
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
