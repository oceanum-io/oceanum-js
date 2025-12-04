import { Datasource } from "./datasource";
import { IQuery, Stage } from "./query";
import { Dataset, HttpZarr, TempZarr } from "./datamodel";
import { measureTime } from "./observe";
import { tableFromIPC, Table } from "apache-arrow";
import { Session } from "./session";

/**
 * Datamesh connector class.
 *
 * All datamesh operations are methods of this class.
 *
 */
const DATAMESH_SERVICE =
  typeof process !== "undefined" && process.env?.DATAMESH_SERVICE
    ? process.env.DATAMESH_SERVICE
    : "https://datamesh.oceanum.io";

export class Connector {
  static LAZY_LOAD_SIZE = 1e8;
  private _token: string;
  private _host: string;
  private _authHeaders: Record<string, string>;
  private _gateway: string;
  private _nocache = false;
  private _isV1 = false;
  private _sessionParams: Record<string, number> = {};
  private _currentSession: Session | null = null;
  service?: string;
  gateway?: string;

  /**
   * Datamesh connector constructor
   *
   * @param token - Your datamesh access token. Defaults to environment variable DATAMESH_TOKEN is defined else as literal string "DATAMESH_TOKEN". DO NOT put your Datamesh token directly into public facing browser code.
   * @param options - Constructor options.
   * @param options.service - URL of datamesh service. Defaults to environment variable DATAMESH_SERVICE or "https://datamesh.oceanum.io".
   * @param options.gateway - URL of gateway service. Defaults to "https://gateway.<datamesh_service_domain>".
   * @param options.jwtAuth - JWT for Oceanum service.
   * @param options.nocache - Disable caching of datamesh results.
   * @param options.sessionDuration - The desired length of time for acquired datamesh sessions in hours. Will be 1 hour by default.
   *
   * @throws {Error} - If a valid token is not provided.
   */
  constructor(
    token = typeof process !== "undefined" && process.env?.DATAMESH_TOKEN
      ? process.env.DATAMESH_TOKEN
      : "$DATAMESH_TOKEN",
    options?: {
      service?: string;
      gateway?: string;
      jwtAuth?: string;
      nocache?: boolean;
      sessionDuration?: number;
    }
  ) {
    if (!token && !options?.jwtAuth) {
      throw new Error(
        "A valid datamesh token must be supplied as a connector constructor argument or defined in environment variables as DATAMESH_TOKEN"
      );
    }

    this._token = token;
    this._nocache = options?.nocache ?? false;
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
    this._gateway = options?.gateway || this._host;

    if (
      this._host.split(".").slice(-1)[0] !==
      this._gateway.split(".").slice(-1)[0]
    ) {
      console.warn("Datamesh gateway and service domains do not match");
    }

    // Set session parameters if provided
    if (
      options?.sessionDuration &&
      typeof options.sessionDuration === "number"
    ) {
      this._sessionParams = { duration: options.sessionDuration };
    }

    // Check if the API is v1 (supports sessions)
    this._checkApiVersion();
  }

  /**
   * Check if the API version supports sessions.
   *
   * @private
   */
  private async _checkApiVersion(): Promise<void> {
    try {
      // Simply check to see if we can get a session
      const response = await fetch(`${this._gateway}/session`, {
        headers: this._authHeaders,
      });

      if (response.status === 200) {
        this._isV1 = true;
        console.info("Using datamesh API version 1");
      } else {
        this._isV1 = false;
        console.info("Using datamesh API version 0");
      }
    } catch {
      // If we can't connect to the gateway, assume it's not a v1 API
      this._isV1 = false;
      console.info("Using datamesh API version 0");
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
   * Create a new session.
   *
   * @param options - Session options.
   * @param options.duration - The desired length of time for the session in hours. Defaults to the value set in the constructor or 1 hour.
   * @returns A new session instance.
   */
  async createSession(options: { duration?: number } = {}): Promise<Session> {
    const sessionOptions = {
      duration: options.duration || this._sessionParams.duration || 3600,
    };
    this._currentSession = await Session.acquire(this, sessionOptions);
    return this._currentSession;
  }

  /**
   * Get the current session or create a new one if none exists.
   *
   * @returns The current session.
   */
  async getSession(): Promise<Session> {
    if (!this._currentSession) {
      return this.createSession();
    }
    return this._currentSession;
  }

  /**
   * Get headers with session information if available.
   *
   * @param additionalHeaders - Additional headers to include.
   * @returns Headers with session information.
   */
  private async getSessionHeaders(
    additionalHeaders: Record<string, string> = {}
  ): Promise<Record<string, string>> {
    if (this._isV1 && !this._currentSession) {
      await this.createSession();
    }

    if (this._currentSession) {
      return this._currentSession.addHeader({
        ...this._authHeaders,
        ...additionalHeaders,
      });
    }

    return { ...this._authHeaders, ...additionalHeaders };
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

    const headers = await this.getSessionHeaders();
    const response = await fetch(url.toString(), {
      headers,
    });

    if (response.status === 403) {
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
    const headers = await this.getSessionHeaders({ Accept: dataFormat });
    const response = await fetch(`${this._gateway}/oceanql/${qhash}?f=arrow`, {
      headers,
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
    const headers = await this.getSessionHeaders({
      "Content-Type": "application/json",
    });

    const response = await fetch(`${this._gateway}/oceanql/stage/`, {
      method: "POST",
      headers,
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
   * @param options.timeout - Additional options for the query.
   * @returns The response from the server.
   */
  @measureTime
  async query(
    query: IQuery,
    options: { timeout?: number } = {}
  ): Promise<Dataset<HttpZarr | TempZarr> | null> {
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

    const url = `${this._gateway}/zarr/${this._isV1 ? "query/" : ""}${stage.qhash}`;
    const params = query.parameters;

    // Get headers with session information if available
    const headers = await this.getSessionHeaders();

    // Pass the headers to the Dataset.zarr method
    const dataset = await Dataset.zarr(url, headers, {
      parameters: params,
      timeout: options.timeout || 60000, // Default timeout value
      nocache: this._nocache,
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
  ): Promise<Dataset<HttpZarr | TempZarr> | null> {
    const query = { datasource: datasourceId, parameters };
    const dataset = await this.query(query);
    return dataset;
  }

  /**
   * Close the current session if one exists.
   *
   * @param finaliseWrite - Whether to finalise any write operations. Defaults to false.
   * @returns A promise that resolves when the session is closed.
   */
  async closeSession(finaliseWrite = false): Promise<void> {
    if (this._currentSession) {
      await this._currentSession.close(finaliseWrite);
      this._currentSession = null;
    }
  }
}
