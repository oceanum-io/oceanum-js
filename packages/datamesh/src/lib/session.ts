import { measureTime } from "./observe";

/**
 * Session class for datamesh connections.
 *
 * Sessions are used to manage authentication and resource allocation
 * for datamesh operations.
 */
export class Session {
  id!: string;
  user!: string;
  creationTime!: Date;
  endTime!: Date;
  write!: boolean;
  verified: boolean = false;
  private _connection!: any;

  /**
   * Acquire a session from the connection.
   *
   * @param connection - Connection object to acquire session from.
   * @param options - Session options.
   * @param options.duration - The desired length of time for the session in hours. Defaults to 1 hour.
   * @returns A new session instance.
   * @throws {Error} - If the session cannot be acquired.
   */
  @measureTime
  static async acquire(
    connection: any,
    options: { duration?: number } = {}
  ): Promise<Session> {
    // Check if the connection supports sessions (v1 API)
    if (!connection._isV1) {
      const session = new Session();
      session.id = "dummy_session";
      session.user = "dummy_user";
      session.creationTime = new Date();
      session.endTime = new Date(
        Date.now() + (options.duration || 1) * 60 * 60 * 1000
      );
      session.write = false;
      session.verified = false;
      session._connection = connection;

      // Register cleanup function for when the process exits
      if (typeof process !== "undefined" && process.on) {
        process.on("beforeExit", () => {
          session.close();
        });
      }

      return session;
    }

    try {
      const headers = { ...connection._authHeaders };
      headers["Cache-Control"] = "no-store";
      const params = { duration: options.duration || 1 };
      const response = await fetch(
        `${connection._gateway}/session/?${params}`,
        { headers }
      );

      if (response.status !== 200) {
        throw new Error(`Failed to create session: ${await response.text()}`);
      }

      const data = await response.json();
      const session = new Session();
      session.id = data.id;
      session.user = data.user;
      session.creationTime = new Date(data.creation_time);
      session.endTime = new Date(data.end_time);
      session.write = data.write;
      session.verified = data.verified || false;
      session._connection = connection;

      // Register cleanup function for when the process exits
      if (typeof process !== "undefined" && process.on) {
        process.on("beforeExit", () => {
          session.close();
        });
      }

      return session;
    } catch (error) {
      throw new Error(`Error when acquiring datamesh session: ${error}`);
    }
  }

  /**
   * Get the session header for requests.
   *
   * @returns The session header object.
   */
  get header(): Record<string, string> {
    return { "X-DATAMESH-SESSIONID": this.id };
  }

  /**
   * Add session header to an existing headers object.
   *
   * @param headers - The headers object to add the session header to.
   * @returns The updated headers object.
   */
  addHeader(headers: Record<string, string>): Record<string, string> {
    return { ...headers, ...this.header };
  }

  /**
   * Close the session.
   *
   * @param finaliseWrite - Whether to finalise any write operations. Defaults to false.
   * @throws {Error} - If the session cannot be closed and finaliseWrite is true.
   */
  async close(finaliseWrite: boolean = false): Promise<void> {
    // Back-compatibility with beta version (ignoring)
    if (!this._connection._isV1) {
      return;
    }

    try {
      // Remove the beforeExit handler if possible
      if (typeof process !== "undefined" && process.off) {
        process.off("beforeExit", this.close);
      }

      const response = await fetch(
        `${this._connection._gateway}/session/${this.id}`,
        {
          method: "DELETE",
          headers: this.header,
          body: JSON.stringify({ finalise_write: finaliseWrite }),
        }
      );

      if (response.status !== 204) {
        if (finaliseWrite) {
          throw new Error(`Failed to finalise write: ${await response.text()}`);
        }
        console.warn(`Failed to close session: ${await response.text()}`);
      }
    } catch (error) {
      if (finaliseWrite) {
        throw new Error(`Error when closing datamesh session: ${error}`);
      }
      console.warn(`Error when closing datamesh session: ${error}`);
    }
  }

  /**
   * Enter a session context.
   *
   * @returns The session instance.
   */
  async enter(): Promise<Session> {
    return this;
  }

  /**
   * Exit a session context.
   *
   * @param error - Any error that occurred during the session.
   * @returns A promise that resolves when the session is closed.
   */
  async exit(error?: any): Promise<void> {
    // When using context manager, close the session
    // and finalise the write if no exception was raised
    await this.close(error === undefined);
  }
}
