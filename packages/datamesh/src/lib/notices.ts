/**
 * Severity of an oceanum.io notice, least to most severe.
 *
 * - `info`: for information only.
 * - `change`: an upcoming or recent change to the resource.
 * - `action_required`: users of the resource need to act (e.g. a deprecation).
 * - `outage`: the resource is, or will be, unavailable.
 */
export type NoticeSeverity = "info" | "change" | "action_required" | "outage";

/**
 * Kind of resource an oceanum.io notice is about.
 */
export type NoticeType = "general" | "datasource" | "app";

/**
 * A published, unexpired oceanum.io notice about a datasource, as returned by
 * {@link Connector.getNotices}.
 */
export interface Notice {
  /** Notice ID (a UUID). */
  id: string;
  /** Kind of resource the notice is about. */
  type: NoticeType;
  /** Notice severity. */
  severity: NoticeSeverity;
  /** Short title. */
  title: string;
  /** Notice body in markdown. Render it safely: never as raw HTML. */
  body: string;
  /** ISO 8601 time the notice was published. */
  publish_at: string;
  /** ISO 8601 time the notice expires, or null if it does not expire. */
  expires_at: string | null;
}
