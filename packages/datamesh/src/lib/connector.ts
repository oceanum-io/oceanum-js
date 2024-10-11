import { Datasource } from "./datasource";
import { GeoFilter, Query, Stage, TimeFilter } from "./query";

/**
 * Datamesh connector class.
 *
 * All datamesh operations are methods of this class.
 */
class Connector {
  private _token: string;
  private _proto: string;
  private _host: string;
  private _authHeaders: Record<string, string>;
  private _gateway: string;
  private _cachedir: string;

  /**
   * Datamesh connector constructor
   *
   * @param token - Your datamesh access token. Defaults to environment variable DATAMESH_TOKEN.
   * @param service - URL of datamesh service. Defaults to environment variable DATAMESH_SERVICE or "https://datamesh.oceanum.io".
   * @param gateway - URL of gateway service. Defaults to "https://gateway.<datamesh_service_domain>".
   * @param user - Organisation user name for the datamesh connection. Defaults to None.
   *
   * @throws {Error} - If a valid token is not provided.
   */
  constructor(
    token: string | null = process.env.DATAMESH_TOKEN || null,
    service: string = process.env.DATAMESH_SERVICE ||
      "https://datamesh.oceanum.io",
    gateway: string | null = process.env.DATAMESH_GATEWAY ||
      "https://gateway.datamesh.oceanum.io"
  ) {
    if (!token) {
      throw new Error(
        "A valid datamesh token must be supplied as a connector constructor argument or defined in environment variables as DATAMESH_TOKEN"
      );
    }

    this._token = token;
    const url = new URL(service);
    this._proto = url.protocol;
    this._host = url.hostname;
    this._authHeaders = {
      Authorization: `Token ${this._token}`,
      "X-DATAMESH-TOKEN": this._token,
    };

    this._gateway = gateway || `${this._proto}//gateway.${this._host}`;

    if (
      this._host.split(".").slice(-1)[0] !==
      this._gateway.split(".").slice(-1)[0]
    ) {
      console.warn("Gateway and service domain do not match");
    }
  }

  /**
   * Get datamesh host.
   *
   * @returns The datamesh server host.
   */
  get host(): string {
    return this._host;
  }

  /**
   * Check the status of the metadata server.
   *
   * @returns True if the metadata server is up, false otherwise.
   */
  async status(): Promise<boolean> {
    const response = await fetch(`${this._proto}//${this._host}`, {
      headers: this._authHeaders,
    });
    return response.status === 200;
  }

  /**
   * Validate response from server.
   *
   * @param response - The response object to validate.
   * @throws {Error} - If the response contains an error status code.
   */
  private async validateResponse(response: Response): Promise<void> {
    if (response.status >= 400) {
      let message: string;
      try {
        const errorJson = await response.json();
        message = errorJson.detail;
      } catch {
        message = `Datamesh server error: ${await response.text()}`;
      }
      throw new Error(message);
    }
  }

  /**
   * Request metadata from datamesh.
   *
   * @param datasourceId - The ID of the datasource to request.
   * @param params - Additional parameters for the request.
   * @returns The response from the server.
   */
  private async metadataRequest(
    datasourceId = "",
    params: Record<string, any> = {}
  ): Promise<Response> {
    const url = new URL(
      `${this._proto}//${this._host}/datasource/${datasourceId}`
    );
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const response = await fetch(url.toString(), {
      headers: this._authHeaders,
    });

    if (response.status === 404) {
      throw new Error(`Datasource ${datasourceId} not found`);
    } else if (response.status === 401) {
      throw new Error(`Datasource ${datasourceId} not authorized`);
    }

    await this.validateResponse(response);
    return response;
  }

  /**
   * Request data from datamesh.
   *
   * @param datasourceId - The ID of the datasource to request.
   * @param dataFormat - The format of the requested data. Defaults to "application/json".
   * @param cache - Whether to cache the response. Defaults to false.
   * @returns The path to the cached file.
   */
  async dataRequest(
    datasourceId: string,
    dataFormat = "application/json"
  ): Promise<string> {
    const tmpfile = `${this._cachedir}/${datasourceId}`;
    const response = await fetch(`${this._gateway}/data/${datasourceId}`, {
      headers: { Accept: dataFormat, ...this._authHeaders },
    });
    await this.validateResponse(response);
    const fs = require("fs");
    fs.writeFileSync(tmpfile, await response.buffer());
    return tmpfile;
  }

  /**
   * Stage a query to the datamesh.
   *
   * @param query - The query to stage.
   * @returns The staged response.
   */
  private async stageRequest(query: Query): Promise<Stage> {
    const data = JSON.stringify(query);
    const response = await fetch(`${this._gateway}/oceanql/stage/`, {
      method: "POST",
      headers: this._authHeaders,
      body: data,
    });
    if (response.status >= 400) {
      try {
        const errorJson = await response.json();
        throw new Error(errorJson.detail);
      } catch {
        throw new Error(`Datamesh server error: ${await response.text()}`);
      }
    } else if (response.status === 204) {
      return null;
    } else {
      return response.json();
    }
  }

  /**
   * Execute a query to the datamesh.
   *
   * @param query - The query to execute.
   * @param useDask - Whether to use Dask for execution. Defaults to false.
   * @param cacheTimeout - The cache timeout for the query. Defaults to 0.
   * @returns The response from the server.
   */
  async query(query: Query): Promise<any> {
    const stage = await this.stageRequest(query);
    if (!stage) {
      console.warn("No data found for query");
      return null;
    }

    const transferFormat =
      stage.container === "Dataset"
        ? "application/x-netcdf4"
        : "application/parquet";
    const headers = { Accept: transferFormat, ...this._authHeaders };
    const response = await fetch(`${this._gateway}/oceanql/`, {
      method: "POST",
      headers,
      body: JSON.stringify(query),
    });
    if (response.status >= 400) {
      try {
        const errorJson = await response.json();
        throw new Error(errorJson.detail);
      } catch {
        throw new Error(`Datamesh server error: ${await response.text()}`);
      }
    }
    const fs = require("fs");
    const tmpfile = require("os").tmpdir() + `/query_${Date.now()}`;
    fs.writeFileSync(tmpfile, await response.buffer());
    return tmpfile;
  }

  /**
   * Get datamesh catalog.
   *
   * @param search - Search string for filtering datasources.
   * @param timefilter - Time filter for the catalog.
   * @param geofilter - Spatial filter for the catalog.
   * @returns The datamesh catalog.
   */
  async getCatalog(
    search: string | null = null,
    timefilter: TimeFilter = null,
    geofilter: GeoFilter = null
  ): Promise<Datasource[]> {
    const searchQuery: Record<string, string> = {};
    if (search) {
      searchQuery["search"] = search;
    }
    if (timefilter) {
      searchQuery["in_trange"] = `${timefilter.start || ""}Z,${
        timefilter.end || ""
      }Z`;
    }
    if (geofilter) {
      searchQuery["geom_intersects"] = geofilter;
    }
    const meta = await this.metadataRequest("", searchQuery);
    return meta.json();
  }

  /**
   * Get a datasource instance from the datamesh.
   *
   * @param datasourceId - Unique datasource ID.
   * @returns The datasource instance.
   * @throws {Error} - If the datasource cannot be found or is not authorized.
   */
  async getDatasource(datasourceId: string): Promise<Datasource> {
    const meta = await this.metadataRequest(datasourceId);
    const metaDict = await meta.json();
    return {
      id: datasourceId,
      geom: metaDict.geometry,
      ...metaDict.properties,
    };
  }

  /**
   * Load a datasource into the work environment.
   *
   * @param datasourceId - Unique datasource ID.
   * @param parameters - Additional datasource parameters.
   * @param useDask - Whether to use Dask for loading. Defaults to false.
   * @returns The datasource container.
   */
  async loadDatasource(
    datasourceId: string,
    parameters: Record<string, string | number> = {}
  ): Promise<Dataset> {
    const query = { datasource: datasourceId, parameters };
    const stage = await this.stageRequest(query);
    if (!stage) {
      console.warn("No data found for query");
      return null;
    }

    if (stage.container === "Dataset" || useDask) {
      // Assuming use of a library like xarray for dataset handling
      const ZarrClient = require("zarr-js"); // Example client for handling Zarr datasets
      const mapper = new ZarrClient(this, datasourceId, parameters);
      const xarray = require("xarray");
      return xarray.openZarr(mapper, {
        consolidated: true,
        decodeCoords: "all",
        maskAndScale: true,
      });
    } else if (stage.container === "GeoDataFrame") {
      const tmpfile = await this.dataRequest(
        datasourceId,
        "application/parquet"
      );
      const geopandas = require("geopandas");
      return geopandas.readParquet(tmpfile);
    } else if (stage.container === "DataFrame") {
      const tmpfile = await this.dataRequest(
        datasourceId,
        "application/parquet"
      );
      const pandas = require("pandas");
      return pandas.readParquet(tmpfile);
    }
  }
}

export default Connector;
