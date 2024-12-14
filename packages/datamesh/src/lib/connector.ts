import { Datasource } from "./datasource";
import { IQuery, Stage } from "./query";
import { Dataset, DatameshStore } from "./datamodel";

/**
 * Datamesh connector class.
 *
 * All datamesh operations are methods of this class.
 */
export class Connector {
  private _token: string;
  private _proto: string;
  private _host: string;
  private _authHeaders: Record<string, string>;
  private _gateway: string;

  /**
   * Datamesh connector constructor
   *
   * @param token - Your datamesh access token. Defaults to environment variable DATAMESH_TOKEN is defined else as literal string "DATAMESH_TOKEN". DO NOT put your Datamesh token directly into public facing browser code.
   * @param service - URL of datamesh service. Defaults to environment variable DATAMESH_SERVICE or "https://datamesh.oceanum.io".
   * @param _gateway - URL of gateway service. Defaults to "https://gateway.datamesh.oceanum.io".
   *
   * @throws {Error} - If a valid token is not provided.
   */
  constructor(
    token = process.env.DATAMESH_TOKEN || "$DATAMESH_TOKEN",
    service = process.env.DATAMESH_SERVICE || "https://datamesh.oceanum.io",
    // @ignore //
    _gateway = process.env.DATAMESH_GATEWAY ||
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

    /* This is for testing  the gateway service is not always the same as the service domain */
    this._gateway = _gateway || `${this._proto}//gateway.${this._host}`;

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
    params = {} as Record<string, string>
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
   * @returns The path to the cached file.
   */
  /** @ts-expect-error Not used at present*/
  private async dataRequest(
    datasourceId: string,
    dataFormat = "application/json"
  ): Promise<Blob> {
    const response = await fetch(`${this._gateway}/data/${datasourceId}`, {
      headers: { Accept: dataFormat, ...this._authHeaders },
    });
    await this.validateResponse(response);
    return response.blob();
  }

  /**
   * Stage a query to the datamesh.
   *
   * @param query - The query to stage.
   * @returns The staged response.
   */
  private async stageRequest(query: IQuery): Promise<Stage | null> {
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
  async query(
    query: IQuery
  ): Promise<Dataset</** @ignore */ DatameshStore> | null> {
    const stage = await this.stageRequest(query);
    if (!stage) {
      console.warn("No data found for query");
      return null;
    }
    const url = `${this._gateway}/zarr/${stage.qhash}`;
    const dataset = await Dataset.zarr(url, this._authHeaders);
    return dataset;
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
   * @returns The dataset.
   */
  async loadDatasource(
    datasourceId: string,
    parameters: Record<string, string | number> = {}
  ): Promise<Dataset</** @ignore */ DatameshStore> | null> {
    const query = { datasource: datasourceId, parameters };
    const stage = await this.stageRequest(query);
    if (!stage) {
      console.warn("No data found for query");
      return null;
    }
    const dataset = await Dataset.zarr(
      `${this._gateway}/zarr/${stage.qhash}`,
      this._authHeaders
    );
    return dataset;
  }
}
