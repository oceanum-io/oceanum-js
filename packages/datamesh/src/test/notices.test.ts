import { describe, it, expect, vi, afterEach } from "vitest";
import { createServer, Server } from "node:http";
import { AddressInfo } from "node:net";
import { Connector } from "../lib/connector";
import { Notice } from "../lib/notices";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const notice = (
  severity: Notice["severity"],
  title: string = severity,
): Notice => ({
  id: `id-${title}`,
  type: "datasource",
  severity,
  title,
  body: "**markdown**",
  publish_at: "2026-11-01T00:00:00Z",
  expires_at: null,
});

interface Call {
  url: string;
  headers: Record<string, string>;
}

// Mock fetch: the admin notices endpoint answers with `admin` (a Response
// factory); session acquisition returns a stub session and staging returns
// 204 (no data), so loadDatasource() runs to completion without a server.
function stubFetch(
  admin: (url: URL, init?: RequestInit) => Promise<Response> | Response = () =>
    Response.json({ items: [] }),
): Call[] {
  const calls: Call[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string, init?: RequestInit) => {
      const url = new URL(String(input));
      calls.push({
        url: url.toString(),
        headers: { ...((init?.headers as Record<string, string>) ?? {}) },
      });
      if (url.pathname.endsWith("/notices/active")) return admin(url, init);
      if (url.pathname === "/session/") {
        return Response.json({
          id: "sess-abc",
          user: "u",
          creation_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600e3).toISOString(),
          write: false,
        });
      }
      if (url.pathname === "/oceanql/stage/") {
        return new Response(null, { status: 204 });
      }
      return new Response("", { status: 404 });
    }),
  );
  return calls;
}

const noticeCalls = (calls: Call[]) =>
  calls.filter((c) => new URL(c.url).pathname.endsWith("/notices/active"));

const connector = (
  options: ConstructorParameters<typeof Connector>[1] = {},
  token = "test-token",
) =>
  new Connector(token, { service: "https://datamesh.oceanum.io", ...options });

// Let fire-and-forget promise chains settle.
const flush = () => new Promise((r) => setTimeout(r, 0));

describe("Connector.getNotices", () => {
  it("sends a Datamesh token as X-DATAMESH-TOKEN", async () => {
    const calls = stubFetch(() => Response.json({ items: [notice("outage")] }));
    const notices = await connector().getNotices("my-ds");

    expect(notices).toEqual([notice("outage")]);
    expect(noticeCalls(calls)).toHaveLength(1);
    const { url, headers } = noticeCalls(calls)[0];
    expect(url).toBe(
      "https://admin.oceanum.io/notices/active?datasource=my-ds",
    );
    expect(headers["X-DATAMESH-TOKEN"]).toBe("test-token");
    expect(headers.Authorization).toBeUndefined();
  });

  it("sends a JWT as Authorization: Bearer", async () => {
    const calls = stubFetch();
    await connector({ jwtAuth: "the-jwt" }, "").getNotices("my-ds");

    const { headers } = noticeCalls(calls)[0];
    expect(headers.Authorization).toBe("Bearer the-jwt");
    expect(headers["X-DATAMESH-TOKEN"]).toBeUndefined();
  });

  it("url-encodes the datasource id", async () => {
    const calls = stubFetch();
    await connector().getNotices("a b&c");
    expect(noticeCalls(calls)[0].url).toBe(
      "https://admin.oceanum.io/notices/active?datasource=a+b%26c",
    );
  });

  it.each([
    ["https://datamesh.oceanum.io", "https://admin.oceanum.io"],
    ["https://datamesh.oceanum.tech/", "https://admin.oceanum.tech"],
  ])("derives the admin service from %s", async (service, admin) => {
    const calls = stubFetch();
    await connector({ service }).getNotices("ds");
    expect(noticeCalls(calls)[0].url).toBe(
      `${admin}/notices/active?datasource=ds`,
    );
  });

  it("uses the adminService option over the derived host", async () => {
    const calls = stubFetch();
    await connector({
      service: "https://datamesh.oceanum.tech",
      adminService: "https://proxy.example.com/admin/",
    }).getNotices("ds");
    expect(noticeCalls(calls)[0].url).toBe(
      "https://proxy.example.com/admin/notices/active?datasource=ds",
    );
  });

  it("returns [] without a request when no admin service is known", async () => {
    const calls = stubFetch();
    const c = connector({ service: "https://datamesh.example.com" });
    expect(await c.getNotices("ds")).toEqual([]);
    expect(noticeCalls(calls)).toHaveLength(0);
  });

  it.each([401, 404, 422, 429, 500, 502, 503, 504])(
    "returns [] on HTTP %i",
    async (status) => {
      stubFetch(() => Response.json({ detail: "No notices" }, { status }));
      expect(await connector().getNotices("ds")).toEqual([]);
    },
  );

  it("returns [] on a network error", async () => {
    stubFetch(() => Promise.reject(new TypeError("fetch failed")));
    expect(await connector().getNotices("ds")).toEqual([]);
  });

  it("returns [] on a malformed body", async () => {
    stubFetch(() => new Response("not json", { status: 200 }));
    expect(await connector().getNotices("ds")).toEqual([]);
    stubFetch(() => Response.json({ items: "nope" }));
    expect(await connector().getNotices("ds2")).toEqual([]);
  });

  it("gives up after 3 seconds", async () => {
    vi.useFakeTimers();
    let signal: AbortSignal | undefined;
    stubFetch(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          signal = init?.signal ?? undefined;
          signal?.addEventListener("abort", () =>
            reject(new DOMException("aborted", "AbortError")),
          );
        }),
    );
    const result = connector().getNotices("ds");
    await vi.advanceTimersByTimeAsync(2999);
    expect(signal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(signal?.aborted).toBe(true);
    expect(await result).toEqual([]);
  });

  it("caches results per datasource, sharing in-flight requests", async () => {
    const calls = stubFetch(() => Response.json({ items: [notice("change")] }));
    const c = connector();
    const [a, b] = await Promise.all([c.getNotices("ds"), c.getNotices("ds")]);
    const again = await c.getNotices("ds");

    expect(a).toEqual([notice("change")]);
    expect(b).toEqual(a);
    expect(again).toEqual(a);
    expect(noticeCalls(calls)).toHaveLength(1);

    await c.getNotices("other");
    expect(noticeCalls(calls)).toHaveLength(2);
  });

  it("caches failures for 30 seconds only", async () => {
    const calls = stubFetch(() => new Response("", { status: 503 }));
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    const c = connector();
    await c.getNotices("ds");
    now.mockReturnValue(1_000_000 + 30 * 1000 - 1);
    await c.getNotices("ds");
    expect(noticeCalls(calls)).toHaveLength(1);
    now.mockReturnValue(1_000_000 + 30 * 1000);
    await c.getNotices("ds");
    expect(noticeCalls(calls)).toHaveLength(2);
  });

  it("asks fetch never to follow redirects", async () => {
    let redirect: RequestRedirect | undefined;
    stubFetch((_url, init) => {
      redirect = init?.redirect;
      return Response.json({ items: [] });
    });
    await connector().getNotices("ds");
    expect(redirect).toBe("error");
  });

  it("returns [] for an invalid adminService, without throwing", async () => {
    const calls = stubFetch();
    const c = connector({ adminService: "not a url" });
    await expect(c.getNotices("ds")).resolves.toEqual([]);
    await expect(c.getNotices("ds")).resolves.toEqual([]);
    expect(calls).toHaveLength(0);
  });

  it("skips malformed notices", async () => {
    const good = notice("outage", "good");
    stubFetch(() =>
      Response.json({
        items: [
          null,
          "text",
          { ...good, id: 7 },
          { ...good, type: "app" },
          { ...good, severity: "critical" },
          { ...good, title: undefined },
          { ...good, body: null },
          { ...good, publish_at: "not a date" },
          { ...good, expires_at: 5 },
          { ...good, extra: "dropped" },
        ],
      }),
    );
    expect(await connector().getNotices("ds")).toEqual([good]);
  });

  it("sorts notices newest first and returns copies", async () => {
    const at = (title: string, publish_at: string) => ({
      ...notice("info", title),
      publish_at,
    });
    stubFetch(() =>
      Response.json({
        items: [
          at("old", "2026-01-01T00:00:00Z"),
          at("new", "2026-03-01T00:00:00+00:00"),
          at("mid", "2026-02-01T12:00:00+13:00"),
        ],
      }),
    );
    const c = connector();
    const first = await c.getNotices("ds");
    expect(first.map((n) => n.title)).toEqual(["new", "mid", "old"]);

    first[0].title = "mutated";
    first.pop();
    const second = await c.getNotices("ds");
    expect(second.map((n) => n.title)).toEqual(["new", "mid", "old"]);
  });

  it("refetches after the cache expires", async () => {
    const calls = stubFetch();
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    const c = connector();
    await c.getNotices("ds");
    now.mockReturnValue(1_000_000 + 10 * 60 * 1000 - 1);
    await c.getNotices("ds");
    expect(noticeCalls(calls)).toHaveLength(1);
    now.mockReturnValue(1_000_000 + 10 * 60 * 1000);
    await c.getNotices("ds");
    expect(noticeCalls(calls)).toHaveLength(2);
  });

  it("bounds the cache, evicting the oldest datasource", async () => {
    const calls = stubFetch();
    const c = connector();
    for (let i = 0; i < 101; i++) await c.getNotices(`ds${i}`);
    expect(noticeCalls(calls)).toHaveLength(101);
    await c.getNotices("ds100"); // still cached
    expect(noticeCalls(calls)).toHaveLength(101);
    await c.getNotices("ds0"); // evicted
    expect(noticeCalls(calls)).toHaveLength(102);
  });
});

describe("notices requests over HTTP", () => {
  const servers: Server[] = [];
  afterEach(async () => {
    await Promise.all(
      servers.splice(0).map((s) => new Promise((r) => s.close(r))),
    );
  });

  const listen = async (
    handler: Parameters<typeof createServer>[1],
  ): Promise<string> => {
    const server = createServer(handler);
    servers.push(server);
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
    return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  };

  it("never follows a redirect, so the credential stays with admin", async () => {
    const elsewhere: Array<string | undefined> = [];
    const other = await listen((req, res) => {
      elsewhere.push(req.headers["x-datamesh-token"] as string | undefined);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ items: [notice("outage")] }));
    });
    const admin = await listen((_req, res) => {
      res.statusCode = 302;
      res.setHeader("Location", `${other}/notices/active?datasource=ds`);
      res.end();
    });

    const notices = await connector({ adminService: admin }).getNotices("ds");

    expect(notices).toEqual([]);
    expect(elsewhere).toEqual([]);
  });
});

describe("notices on loadDatasource", () => {
  it("warns about action_required and outage notices only", async () => {
    stubFetch(() =>
      Response.json({
        items: [
          notice("info", "fyi"),
          notice("change", "new grid"),
          notice("action_required", "deprecated"),
          notice("outage", "down"),
        ],
      }),
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await connector().loadDatasource("my-ds");
    await flush();

    const messages = warn.mock.calls
      .map((args) => String(args[0]))
      .filter((m) => m.startsWith("Datamesh notice"));
    expect(messages).toHaveLength(2);
    expect(messages[0]).toContain("my-ds");
    expect(messages[0]).toContain("action_required");
    expect(messages[0]).toContain("deprecated");
    expect(messages[1]).toContain("outage");
    expect(messages[1]).toContain("down");
    for (const m of messages) expect(m).not.toContain("test-token");
  });

  it("fetches and warns once per datasource per connector", async () => {
    const calls = stubFetch(() => Response.json({ items: [notice("outage")] }));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const c = connector();
    await c.loadDatasource("ds");
    await flush();
    await c.loadDatasource("ds");
    await flush();

    expect(noticeCalls(calls)).toHaveLength(1);
    const noticeWarnings = warn.mock.calls.filter((args) =>
      String(args[0]).startsWith("Datamesh notice"),
    );
    expect(noticeWarnings).toHaveLength(1);
  });

  it("does not check notices with notices: false", async () => {
    const calls = stubFetch(() => Response.json({ items: [notice("outage")] }));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const c = connector({ notices: false });
    await c.loadDatasource("ds");
    await flush();

    expect(noticeCalls(calls)).toHaveLength(0);
    expect(
      warn.mock.calls.some((args) =>
        String(args[0]).startsWith("Datamesh notice"),
      ),
    ).toBe(false);
    // getNotices still works when asked for explicitly.
    expect(await c.getNotices("ds")).toEqual([notice("outage")]);
  });

  it("never blocks or fails loading", async () => {
    // Admin service hangs: loading must not wait for it.
    stubFetch(() => new Promise<Response>(() => {}));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(connector().loadDatasource("ds")).resolves.toBeNull();

    // Admin service errors: loading must not fail.
    stubFetch(() => Promise.reject(new Error("boom")));
    await expect(connector().loadDatasource("ds")).resolves.toBeNull();
    await flush();
  });

  const noticeWarnings = (warn: { mock: { calls: unknown[][] } }) =>
    warn.mock.calls
      .map((args) => String(args[0]))
      .filter((m) => m.startsWith("Datamesh notice"));

  it("warns after a transient failure once a later check succeeds", async () => {
    let fail = true;
    stubFetch(() =>
      fail
        ? new Response("", { status: 503 })
        : Response.json({ items: [notice("outage", "down")] }),
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    const c = connector();
    await c.loadDatasource("ds");
    await flush();
    expect(noticeWarnings(warn)).toHaveLength(0);

    fail = false;
    now.mockReturnValue(1_000_000 + 30 * 1000);
    await c.loadDatasource("ds");
    await flush();
    expect(noticeWarnings(warn)).toHaveLength(1);
    expect(noticeWarnings(warn)[0]).toContain("down");
  });

  it("warns about a notice published after the first load, once", async () => {
    let items = [notice("outage", "first")];
    const calls = stubFetch(() => Response.json({ items }));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    const c = connector();
    await c.loadDatasource("ds");
    await flush();
    expect(noticeWarnings(warn)).toHaveLength(1);

    items = [notice("action_required", "second"), notice("outage", "first")];
    // Within the cache TTL: no new request, no new warning.
    now.mockReturnValue(1_000_000 + 10 * 60 * 1000 - 1);
    await c.loadDatasource("ds");
    await flush();
    expect(noticeCalls(calls)).toHaveLength(1);
    expect(noticeWarnings(warn)).toHaveLength(1);

    // After it: re-checked, and only the new notice is warned about.
    now.mockReturnValue(1_000_000 + 10 * 60 * 1000);
    await c.loadDatasource("ds");
    await flush();
    expect(noticeCalls(calls)).toHaveLength(2);
    expect(noticeWarnings(warn)).toHaveLength(2);
    expect(noticeWarnings(warn)[1]).toContain("second");

    // And again later: nothing new, nothing warned twice.
    now.mockReturnValue(1_000_000 + 20 * 60 * 1000);
    await c.loadDatasource("ds");
    await flush();
    expect(noticeCalls(calls)).toHaveLength(3);
    expect(noticeWarnings(warn)).toHaveLength(2);
  });

  it("does not warn twice for concurrent loads", async () => {
    stubFetch(() => Response.json({ items: [notice("outage")] }));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const c = connector();
    await Promise.all([c.loadDatasource("ds"), c.loadDatasource("ds")]);
    await flush();
    expect(noticeWarnings(warn)).toHaveLength(1);
  });

  it("sanitises titles in warnings", async () => {
    const title =
      "Line one\nFAKE: log line\r\u001b[31mred\u001b[0m\u2028\u202eevil " +
      "x".repeat(300);
    stubFetch(() => Response.json({ items: [notice("outage", title)] }));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await connector().loadDatasource("ds");
    await flush();

    const [message] = noticeWarnings(warn);
    expect(message).toBeDefined();
    expect(message).not.toMatch(
      // eslint-disable-next-line no-control-regex
      /[\u0000-\u001f\u007f-\u009f\u2028\u2029\u202a-\u202e]/,
    );
    expect(message).toContain("Line one FAKE: log line [31mred [0m evil x");
    const shown = message.slice(
      message.indexOf("): ") + 3,
      message.indexOf(". See"),
    );
    expect(shown).toHaveLength(200);
    expect(shown.endsWith("\u2026")).toBe(true);
  });
});
