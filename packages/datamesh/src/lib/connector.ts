import { Datasource } from "./datasource";
import { IQuery, Stage } from "./query";
import { Dataset, DatameshStore, TempStore } from "./datamodel";
import { measureTime } from "./observe";
import { tableFromIPC, Table } from "apache-arrow";

/**
 * Datamesh connector class.
 *
 * All datamesh operations are methods of this class.
 *
 */
const DATAMESH_SERVICE =
  process.env.DATAMESH_SERVICE || "https://datamesh.oceanum.io";

export class Connector {
  static LAZY_LOAD_SIZE = 1e8;
  private _token: string;
  private _host: string;
  private _authHeaders: Record<string, string>;
  private _gateway: string;

  /**
   * Datamesh connector constructor
   *
   * @param token - Your datamesh access token. Defaults to environment variable DATAMESH_TOKEN is defined else as literal string "DATAMESH_TOKEN". DO NOT put your Datamesh token directly into public facing browser code.
   * @param options - Constructor options.
   * @param options.service - URL of datamesh service. Defaults to environment variable DATAMESH_SERVICE or "https://datamesh.oceanum.io".
   * @param options.gateway - URL of gateway service. Defaults to "https://gateway.datamesh.oceanum.io".
   * @param options.jwtAuth - JWT for Oceanum service.
   *
   * @throws {Error} - If a valid token is not provided.
   */
  constructor(
    token = process.env.DATAMESH_TOKEN || "$DATAMESH_TOKEN",
    options?: {
      service?: string;
      gateway?: string;
      jwtAuth?: string;
    }
  ) {
    if (!token && !options?.jwtAuth) {
      throw new Error(
        "A valid datamesh token must be supplied as a connector constructor argument or defined in environment variables as DATAMESH_TOKEN"
      );
    }

    this._token = token;
    const url = new URL(options?.service || DATAMESH_SERVICE);
    this._host = `${url.protocol}//${url.hostname}`;
    this._authHeaders = options?.jwtAuth
      ? {
          Authorization: `Bearer ${options.jwtAuth}`,
        }
      : {
          Authorization: `Token ${this._token}`,
          "X-DATAMESH-TOKEN": this._token,
        };

    /* This is for testing  the gateway service is not always the same as the service domain */
    this._gateway =
      options?.gateway || `${url.protocol}//gateway.${url.hostname}`;

    if (
      this._host.split(".").slice(-1)[0] !==
      this._gateway.split(".").slice(-1)[0]
    ) {
      console.warn("Datamesh gateway and service domains do not match");
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
   * @returns True if the server is up, false otherwise.
   */
  async status(): Promise<boolean> {
    const response = await fetch(this._host, {
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
    params = {} as Record<string, string>
  ): Promise<Response> {
    const url = new URL(`${this._host}/datasource/${datasourceId}`);
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
   * @returns The path to the cached file.
   */
  private async dataRequest(
    qhash: string,
    dataFormat = "application/vnd.apache.arrow.file"
  ): Promise<Table> {
    const response = await fetch(`${this._gateway}/oceanql/${qhash}?f=arrow`, {
      headers: { Accept: dataFormat, ...this._authHeaders },
    });
    await this.validateResponse(response);
    return tableFromIPC(await response.arrayBuffer());
  }

  /**
   * Stage a query to the datamesh.
   *
   * @param query - The query to stage.
   * @returns The staged response.
   */
  @measureTime
  async stageRequest(query: IQuery): Promise<Stage | null> {
    const data = JSON.stringify(query);
    const response = await fetch(`${this._gateway}/oceanql/stage/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...this._authHeaders },
      body: data,
    });
    if (response.status >= 400) {
      const errorJson = await response.json();
      throw new Error(errorJson.detail);
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
   * @returns The response from the server.
   */
  @measureTime
  async query(
    query: IQuery
  ): Promise<Dataset</** @ignore */ DatameshStore | TempStore> | null> {
    //Stage the query
    const stage = await this.stageRequest(query);
    if (!stage) {
      console.warn("No data found for query");
      return null;
    }
    //For smaller dataframes use arrow for transport
    if (stage.size < Connector.LAZY_LOAD_SIZE && stage.container != "dataset") {
      const table = await this.dataRequest(stage.qhash);
      const dataset = await Dataset.fromArrow(table, stage.coordkeys);
      return dataset;
    }
    let url = null;
    let params = undefined;
    if (
      query.timefilter ||
      query.geofilter ||
      query.levelfilter ||
      query.coordfilter
    ) {
      url = `${this._gateway}/zarr/${stage.qhash}`;
    } else {
      url = `${this._gateway}/zarr/${query.datasource}`;
      params = query.parameters;
    }
    const dataset = await Dataset.zarr(url, this._authHeaders, {
      parameters: params,
    });
    if (query.variables) {
      for (const v of Object.keys(dataset.variables)) {
        if (
          !query.variables.includes(v) &&
          !Object.values(dataset.coordkeys).includes(v)
        ) {
          delete dataset.variables[v];
        }
      }
    }
    return dataset;
  }

  /**
   * Get a datasource instance from the datamesh.
   *
   * @param datasourceId - Unique datasource ID.
   * @returns The datasource instance.
   * @throws {Error} - If the datasource cannot be found or is not authorized.
   */
  //@measureTime
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
   * @returns The dataset.
   */
  //@measureTime
  async loadDatasource(
    datasourceId: string,
    parameters: Record<string, string | number> = {}
  ): Promise<Dataset<DatameshStore | TempStore> | null> {
    const query = { datasource: datasourceId, parameters };
    const dataset = await this.query(query);
    return dataset;
  }
}
