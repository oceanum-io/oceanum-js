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

export class CachedHTTPStore implements AsyncReadable {
  cache: UseStore | undefined;
  url: string;
  cache_prefix: string;
  fetchOptions: RequestInit;
  timeout = 60000;
  _pending: Record<string, boolean> = {};

  constructor(
    root: string,
    authHeaders: Record<string, string>,
    parameters?: Record<string, string | number>,
    chunks?: string,
    downsample?: Record<string, number>,
    nocache?: boolean,
    timeout?: number
  ) {
    const headers = { ...authHeaders };
    if (parameters) headers["x-parameters"] = JSON.stringify(parameters);
    if (chunks) headers["x-chunks"] = chunks;
    if (downsample) headers["x-downsample"] = JSON.stringify(downsample);
    headers["x-filtered"] = "True";
    this.fetchOptions = { headers };
    this.url = root;
    const datasource = root.split("/").pop();
    if (nocache) {
      this.cache = undefined;
    } else {
      this.cache = createStore("zarr", "cache");
    }
    this.cache_prefix = hash({
      datasource,
      ...parameters,
      chunks,
      downsample,
    });
    this.timeout = timeout || 60000;
  }

  async get(
    item: string,
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
      //console.log(`${this.url}/${item}`);
      //console.log(this.fetchOptions.headers);
      try {
        const response = await fetch(`${this.url}${item}`, {
          ...this.fetchOptions,
          ...options,
          signal: AbortSignal.timeout(this.timeout),
        });

        if (response.status === 404) {
          // Item is not found
          if (this.cache) await del_cache(key, this.cache);
          return undefined;
        } else if (response.status >= 500) {
          if (retry > this.timeout / 200) {
            throw new Error(String(response.status));
          } else {
            return await this.get(item, options, retry + 60);
          }
        }
        data = new Uint8Array(await response.arrayBuffer());
        if (this.cache) await set_cache(key, data, this.cache);
      } catch (e) {
        if (this.cache) await del_cache(key, this.cache);
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
