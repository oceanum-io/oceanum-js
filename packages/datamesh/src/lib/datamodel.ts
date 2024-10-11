import { CachedHTTPStore } from "./zarr";
import * as zarr from "zarrita";

interface DatasetApi {
  datasourceId: string;
}

export class Dataset implements DatasetApi {
  constructor(datasourceId: string, store: zarr.Store) {
    this.datasourceId = datasourceId;
    this.store = store;
    this.dataVarIds = store
      .contents()
      .filter((c) => c.kind == "array")
      .map((c) => c.path.replace(/^\//, ""));
  }
  static async zarr(
    datasourceId: string,
    authHeaders: Record<string, string>,
    parameters?: Record<string, string | number>,
    chunks?: string,
    downsample?: Record<string, number>
  ) {
    const url = `${gateway.replace(/\/$/, "")}/${datasourceId}`;
    const store = await zarr.withConsolidated(
      new CachedHTTPStore(
        url,
        authHeaders,
        parameters,
        chunks,
        downsample,
        typeof window === "undefined"
      )
    );
    return new Dataset(datasourceId, store);
  }
}
