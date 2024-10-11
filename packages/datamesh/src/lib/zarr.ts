import { set, get, del, createStore } from "idb-keyval";
import { AsyncReadable } from "@zarrita/storage";

export class CachedHTTPStore implements AsyncReadable {
  constructor(
    root: string,
    authHeaders: Record<string, string>,
    parameters?: Record<string, string | number>,
    chunks?: string,
    downsample?: Record<string, number>,
    nocache?: boolean
  ) {
    const headers = { ...authHeaders };
    if (parameters) headers["x-parameters"] = JSON.stringify(parameters);
    if (chunks) headers["x-chunks"] = chunks;
    if (downsample) headers["x-downsample"] = JSON.stringify(downsample);
    headers["x-filtered"] = "True";
    this.fetchOptions = { headers };
    this.url = root;
    if (nocache) {
      this.cache = null;
    } else {
      this.cache = createStore("zarr", "cache");
    }
    this.cache_prefix = hash({ ...parameters, chunks, downsample });
  }

  async get(
    item: string,
    options: RequestInit,
    retry = 0
  ): Promise<Uint8Array> {
    const key = `${this.cache_prefix}/${item}`;
    let data = null;
    if (this.cache) {
      data = await get(key, this.cache);
      if (data === "pending") {
        await delay(200);
        if (retry > 5 * 60) {
          del(key, this.cache);
          throw new HTTPError("Zarr timeout");
        } else {
          return this.get(item, options, retry + 1);
        }
      }
    }
    if (!data || !this.cache) {
      if (this.cache) set(key, "pending", this.cache);
      //console.log(`${this.url}/${item}`);
      //console.log(this.fetchOptions.headers);
      const response = await fetch(`${this.url}/${item}`, {
        ...this.fetchOptions,
        ...options,
      });

      if (response.status === 404) {
        // Item is not found
        del(key, this.cache);
        return undefined;
      } else if (response.status !== 200) {
        // Item is found but there was an error
        del(key, this.cache);
        throw new Error(String(response.status));
      }
      data = new Uint8Array(await response.arrayBuffer());
      if (this.cache) set(key, data, this.cache);
    }
    return data;
  }
}
