import { Geometry } from "geojson";
import { Datasource } from "./datasource";
import { IQuery, Stage } from "./query";
import { Dataset, HttpZarr, TempZarr, ZarrOptions } from "./datamodel";
import { isDatameshDebugEnabled, measureTime } from "./observe";
import { tableFromIPC, Table } from "apache-arrow";
import { Session } from "./session";
import { Notice } from "./notices";

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

/** Admin service host for each Datamesh service host whose notices it serves. */
const ADMIN_SERVICES = new Map([
  ["datamesh.oceanum.io", "https://admin.oceanum.io"],
  ["datamesh.oceanum.tech", "https://admin.oceanum.tech"],
]);
/** Milliseconds a notices request may take before it is abandoned. */
const NOTICES_TIMEOUT = 3000;
/** Milliseconds a datasource's notices are cached for, per connector. */
const NOTICES_CACHE_TTL = 10 * 60 * 1000;
/** Milliseconds a failed notices request is cached for, per connector. */
const NOTICES_FAILURE_TTL = 30 * 1000;
/** Datasources whose notices each connector caches at most. */
const NOTICES_CACHE_SIZE = 100;
/** Notice IDs warned about that each cache entry remembers at most. */
const NOTICES_WARNED_SIZE = 100;
/** Characters of a notice title a warning shows at most. */
const NOTICE_TITLE_LENGTH = 200;
const NOTICE_SEVERITIES = new Set<unknown>([
  "info",
  "change",
  "action_required",
  "outage",
]);
/** Severities that are warned about when a datasource is loaded. */
const WARN_SEVERITIES = new Set<string>(["action_required", "outage"]);

/** One datasource's notices, as cached by a connector. */
interface NoticesEntry {
  /** The notices, or null if the request failed. */
  request: Promise<Notice[] | null>;
  /** When to request them again (ms since epoch); Infinity while in flight. */
  expires: number;
  /** IDs of the notices already warned about, oldest first. */
  warned: Set<string>;
}

/** The item if it is a well-formed notice, else null. */
function parseNotice(item: unknown): Notice | null {
  if (!item || typeof item !== "object") return null;
  const n = item as Record<string, unknown>;
  if (
    typeof n.id !== "string" ||
    n.type !== "datasource" ||
    !NOTICE_SEVERITIES.has(n.severity) ||
    typeof n.title !== "string" ||
    typeof n.body !== "string" ||
    typeof n.publish_at !== "string" ||
    Number.isNaN(Date.parse(n.publish_at)) ||
    (n.expires_at !== null && typeof n.expires_at !== "string")
  ) {
    return null;
  }
  return {
    id: n.id,
    type: n.type,
    severity: n.severity as Notice["severity"],
    title: n.title,
    body: n.body,
    publish_at: n.publish_at,
    expires_at: n.expires_at,
  };
}

/** Control, line separator and bidi override characters. */
const UNSAFE_TITLE_CHARS =
  // eslint-disable-next-line no-control-regex
  /[\u0000-\u001f\u007f-\u009f\u2028\u2029\u202a-\u202e\u2066-\u2069]/g;

/** A notice title made safe for one log line: no control or bidi characters. */
function sanitiseTitle(title: string): string {
  const clean = title
    .replace(UNSAFE_TITLE_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > NOTICE_TITLE_LENGTH
    ? `${clean.slice(0, NOTICE_TITLE_LENGTH - 1)}\u2026`
    : clean;
}

export class Connector {
  static LAZY_LOAD_SIZE = 1e8;
  private _token: string;
  private _host: string;
  private _authHeaders: Record<string, string>;
  private _gateway: string;
  private _nocache = false;
  private _sessionParams: Record<string, number> = {};
  private _currentSession: Session | null = null;
  private _sessionPromise: Promise<Session> | null = null;
  private _adminService: string | null;
  private _noticeHeaders: Record<string, string>;
  private _warnNotices: boolean;
  private _noticesCache = new Map<string, NoticesEntry>();
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
   * @param options.adminService - URL of the oceanum.io admin service that serves notices about datasources. Defaults to "https://admin.oceanum.io" for the Datamesh service "https://datamesh.oceanum.io" ("https://admin.oceanum.tech" for "https://datamesh.oceanum.tech"); for any other service, notices are not fetched unless this is set.
   * @param options.notices - Check for notices when a datasource is queried or loaded, and console.warn about action_required and outage notices (see {@link getNotices}). Defaults to true: the first query of each datasource then sends this connector's credential (Datamesh token or JWT) to the admin service, which forwards it to Datamesh to check access. Set to false to turn this off.
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
      adminService?: string;
      notices?: boolean;
    },
  ) {
    if (!token && !options?.jwtAuth) {
      throw new Error(
        "A valid datamesh token must be supplied as a connector constructor argument or defined in environment variables as DATAMESH_TOKEN",
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

    // Notices are fetched with the connector's own credential: admin forwards it
    // to Datamesh to decide whether the caller may see the datasource.
    this._noticeHeaders = options?.jwtAuth
      ? { Authorization: `Bearer ${options.jwtAuth}` }
      : { "X-DATAMESH-TOKEN": this._token };
    this._adminService =
      (options?.adminService || ADMIN_SERVICES.get(url.hostname) || "").replace(
        /\/+$/,
        "",
      ) || null;
    this._warnNotices = options?.notices ?? true;

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
        const errorJson = (await response.json()) as { detail?: string };
        message =
          errorJson.detail ?? `Datamesh server error: ${response.status}`;
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
   * Get the current session, or create a new one if none exists or the
   * current one has expired.
   *
   * @returns The current session.
   */
  async getSession(): Promise<Session> {
    // Reuse the live session, but not one at/past its server-side expiry
    // (60s margin for clock skew and in-flight requests).
    if (
      this._currentSession &&
      this._currentSession.endTime.getTime() - 60_000 > Date.now()
    ) {
      return this._currentSession;
    }
    // Single-flight: concurrent callers share one acquisition instead of
    // each opening (and orphaning) a server-side session.
    if (!this._sessionPromise) {
      this._sessionPromise = this.createSession().finally(() => {
        this._sessionPromise = null;
      });
    }
    return this._sessionPromise;
  }

  /**
   * Session headers plus a renewal callback for LONG-LIVED zarr stores
   * (query()/openZarr()): the store outlives the session, and the gateway can
   * expire the session server-side after inactivity, so the store needs a way
   * to swap in a fresh session and retry.
   */
  private async renewableSessionHeaders(): Promise<{
    headers: Record<string, string>;
    renewHeaders: () => Promise<Record<string, string>>;
  }> {
    let session = await this.getSession();
    const headers = session.addHeader({ ...this._authHeaders });
    const renewHeaders = async (): Promise<Record<string, string>> => {
      session = await this.renewSession(session);
      return session.addHeader({ ...this._authHeaders });
    };
    return { headers, renewHeaders };
  }

  /**
   * Replace a session the gateway has rejected (401): oceanql sessions can be
   * terminated server-side after inactivity, BEFORE their declared end time,
   * so the endTime check in getSession() is not sufficient. Drops the cached
   * session only if it is still the stale one (a concurrent caller may already
   * have replaced it) and acquires a fresh session — concurrent renewals share
   * one acquisition via getSession()'s single-flight.
   *
   * @param stale - The session that was rejected.
   * @returns A fresh session.
   */
  async renewSession(stale?: Session): Promise<Session> {
    if (!stale || this._currentSession?.id === stale.id) {
      this._currentSession = null;
    }
    return this.getSession();
  }

  /**
   * Get headers with session information, creating a session if none exists.
   *
   * @param additionalHeaders - Additional headers to include.
   * @returns Headers with session information.
   */
  private async getSessionHeaders(
    additionalHeaders: Record<string, string> = {},
  ): Promise<Record<string, string>> {
    const session = await this.getSession();
    return session.addHeader({
      ...this._authHeaders,
      ...additionalHeaders,
    });
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
    params = {} as Record<string, string>,
  ): Promise<Response> {
    const url = new URL(`${this._host}/datasource/${datasourceId}`);
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key]),
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
    dataFormat = "application/vnd.apache.arrow.file",
  ): Promise<Table> {
    const headers = await this.getSessionHeaders({ Accept: dataFormat });
    const response = await fetch(`${this._gateway}/oceanql/${qhash}?f=arrow`, {
      headers,
    });
    await this.validateResponse(response);
    return tableFromIPC(await response.arrayBuffer());
  }

  /**
   * Download a staged query's data in a given file format.
   *
   * Fetches the staged result from the gateway with the requested `f` format
   * (e.g. "nc" for NetCDF, "csv", "geojson", "arrow") and returns the raw
   * response bytes. Use {@link stageRequest} first to obtain the `qhash` (and
   * to inspect `formats`/`coordkeys`).
   *
   * @param qhash - The hash of a staged query (from {@link stageRequest}).
   * @param format - The `f` query parameter, e.g. "nc" for NetCDF.
   * @returns The raw response body as an ArrayBuffer.
   */
  @measureTime
  async getDataObject(qhash: string, format: string): Promise<ArrayBuffer> {
    // The gateway selects the response format from the `f` query parameter;
    // we send Accept: */* so it is free to return any matching content type.
    const headers = await this.getSessionHeaders({ Accept: "*/*" });
    const url = new URL(
      `${this._gateway}/oceanql/${encodeURIComponent(qhash)}`,
    );
    url.searchParams.set("f", format);
    const response = await fetch(url.toString(), { headers });
    await this.validateResponse(response);
    return response.arrayBuffer();
  }

  /**
   * Stage a query to the datamesh.
   *
   * @param query - The query to stage.
   * @returns The staged response.
   */
  @measureTime
  async stageRequest(query: IQuery): Promise<Stage | null> {
    if (isDatameshDebugEnabled()) {
      console.debug(`@oceanum/datamesh debug: stageRequest query`, query);
    }

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
      const errorJson = (await response.json()) as { detail?: string };
      throw new Error(errorJson.detail);
    } else if (response.status === 204) {
      return null;
    } else {
      return (await response.json()) as Stage;
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
    options: { timeout?: number } = {},
  ): Promise<Dataset<HttpZarr | TempZarr> | null> {
    if (isDatameshDebugEnabled()) {
      console.debug(`@oceanum/datamesh debug: query called`, query);
    }

    if (query.datasource) this.warnNotices(query.datasource);

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

    const url = `${this._gateway}/zarr/query/${stage.qhash}`;
    const params = query.parameters;

    // Acquire session headers (a session is always created), with a renewal
    // path: the returned Dataset is long-lived and its lazy chunk reads must
    // survive server-side session expiry after inactivity.
    const { headers, renewHeaders } = await this.renewableSessionHeaders();

    // Pass the headers to the Dataset.zarr method
    const dataset = await Dataset.zarr(url, headers, {
      parameters: params,
      timeout: options.timeout || 60000, // Default timeout value
      nocache: this._nocache,
      renewHeaders,
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
   * Open a staged query's zarr store with the connector's session attached.
   *
   * Use this for lazy or schema-only access to a staged result — e.g. reading
   * dimensions and variables from `.zmetadata` without downloading chunks. It
   * attaches the same session + auth headers as {@link query}, so callers never
   * hand-roll zarr auth headers: the gateway requires a v1 session on every
   * `/zarr/query` request and returns `401 "Session ID required"` without it.
   *
   * @param url - Full zarr store URL, e.g. `${gateway}${stage.zarr_endpoint}`.
   * @param options - Zarr open options (coordkeys, parameters, ttl, timeout, …).
   * @returns A lazily-opened Dataset backed by the staged zarr store.
   */
  @measureTime
  async openZarr(
    url: string,
    options: ZarrOptions = {},
  ): Promise<Dataset<HttpZarr>> {
    const { headers, renewHeaders } = await this.renewableSessionHeaders();
    return Dataset.zarr(url, headers, { renewHeaders, ...options });
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
    const metaDict = (await meta.json()) as {
      geometry?: Geometry;
      properties?: Record<string, unknown>;
    };
    return {
      id: datasourceId,
      geom: metaDict.geometry,
      ...metaDict.properties,
    } as Datasource;
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
    parameters: Record<string, string | number> = {},
  ): Promise<Dataset<HttpZarr | TempZarr> | null> {
    const query = { datasource: datasourceId, parameters };
    const dataset = await this.query(query);
    return dataset;
  }

  /**
   * Get the published, unexpired oceanum.io notices about a datasource, such
   * as deprecations, changes or outages, newest first.
   *
   * Notices are requested from the admin service (see the `adminService`
   * constructor option) with this connector's own credential, which the admin
   * service forwards to Datamesh to check access: notices are only returned
   * for datasources that credential can read. Results are cached per
   * datasource for 10 minutes (a failed request for 30 seconds).
   *
   * This never throws: if no admin service is known for the Datamesh service,
   * the request fails or takes longer than 3 seconds, or the datasource is
   * unknown or not readable, it resolves to an empty list. Malformed notices
   * are left out.
   *
   * @param datasourceId - Unique datasource ID.
   * @returns The datasource's notices, newest first; empty if there are none.
   */
  async getNotices(datasourceId: string): Promise<Notice[]> {
    const notices = await this.noticesEntry(datasourceId)?.request;
    return notices ? notices.map((notice) => ({ ...notice })) : [];
  }

  /**
   * The cache entry for a datasource's notices, requesting them if they are
   * not cached or have expired; undefined if no admin service is known.
   */
  private noticesEntry(datasourceId: string): NoticesEntry | undefined {
    const adminService = this._adminService;
    if (!adminService) return undefined;
    let entry = this._noticesCache.get(datasourceId);
    if (entry && Date.now() < entry.expires) return entry;
    if (entry) {
      // Move to the end of the eviction order, keeping its warned IDs.
      this._noticesCache.delete(datasourceId);
    } else {
      if (this._noticesCache.size >= NOTICES_CACHE_SIZE) {
        // Evict the oldest entry: Map iterates in insertion order.
        const oldest = this._noticesCache.keys().next().value;
        if (oldest !== undefined) this._noticesCache.delete(oldest);
      }
      entry = { request: Promise.resolve(null), expires: 0, warned: new Set() };
    }
    const current = entry;
    current.expires = Infinity;
    current.request = this.fetchNotices(adminService, datasourceId).then(
      (notices) => {
        current.expires =
          Date.now() + (notices ? NOTICES_CACHE_TTL : NOTICES_FAILURE_TTL);
        return notices;
      },
    );
    this._noticesCache.set(datasourceId, current);
    return current;
  }

  /**
   * Request a datasource's notices from the admin service, newest first.
   * Resolves to null on any failure and [] for a 404 ("No notices"); never
   * throws, follows a redirect or logs the credential.
   */
  private async fetchNotices(
    adminService: string,
    datasourceId: string,
  ): Promise<Notice[] | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), NOTICES_TIMEOUT);
    try {
      const url = new URL(`${adminService}/notices/active`);
      url.searchParams.set("datasource", datasourceId);
      const response = await fetch(url.toString(), {
        headers: { ...this._noticeHeaders, Accept: "application/json" },
        signal: controller.signal,
        // Never forward the credential elsewhere: a cross-origin redirect
        // would drop Authorization but keep X-DATAMESH-TOKEN.
        redirect: "error",
      });
      if (response.status === 404) return []; // No access, or unknown.
      if (response.status !== 200) {
        if (isDatameshDebugEnabled()) {
          console.debug(
            `@oceanum/datamesh debug: notices for ${datasourceId}: HTTP ${response.status}`,
          );
        }
        return null;
      }
      const body = (await response.json()) as { items?: unknown } | null;
      if (!Array.isArray(body?.items)) return null;
      return body.items
        .map(parseNotice)
        .filter((notice): notice is Notice => notice !== null)
        .sort((a, b) => Date.parse(b.publish_at) - Date.parse(a.publish_at));
    } catch (error) {
      if (isDatameshDebugEnabled()) {
        console.debug(
          `@oceanum/datamesh debug: notices for ${datasourceId} failed: ${error instanceof Error ? error.name : "error"}`,
        );
      }
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Warn (console.warn) about the datasource's action_required and outage
   * notices, each once per connector: notices published later are warned
   * about once the cached list expires. Fire-and-forget: never throws or
   * delays the caller.
   */
  private warnNotices(datasourceId: string): void {
    if (!this._warnNotices) return;
    const entry = this.noticesEntry(datasourceId);
    if (!entry) return;
    entry.request
      .then((notices) => {
        for (const notice of notices ?? []) {
          if (
            !WARN_SEVERITIES.has(notice.severity) ||
            entry.warned.has(notice.id)
          ) {
            continue;
          }
          if (entry.warned.size >= NOTICES_WARNED_SIZE) {
            const oldest = entry.warned.values().next().value;
            if (oldest !== undefined) entry.warned.delete(oldest);
          }
          entry.warned.add(notice.id);
          console.warn(
            `Datamesh notice for datasource ${datasourceId} (${notice.severity}): ${sanitiseTitle(notice.title)}. ` +
              `See connector.getNotices("${datasourceId}") for details.`,
          );
        }
      })
      .catch(() => undefined);
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
