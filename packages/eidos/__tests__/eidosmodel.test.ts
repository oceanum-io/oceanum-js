/**
 * Regression tests for the schema loader behind validateSchema().
 *
 * The old loader returned `res.body` (a ReadableStream) to ajv's
 * compileAsync, which silently compiled an accept-everything validator —
 * and checked `res.statusCode`, which does not exist on fetch Responses,
 * so HTTP errors were swallowed too.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const ROOT = "https://schemas.oceanum.io/eidos/root.json";
const CHILD = "https://schemas.oceanum.io/eidos/node/test-child.json";

const schemas: Record<string, object> = {
  [ROOT]: {
    $id: ROOT,
    type: "object",
    required: ["id", "name"],
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      root: { $ref: CHILD },
    },
  },
  [CHILD]: {
    $id: CHILD,
    type: "object",
    required: ["nodeType"],
    properties: { nodeType: { type: "string" } },
  },
};

const goodFetch = vi.fn(async (uri: string) => ({
  ok: true,
  status: 200,
  json: async () => schemas[uri],
}));

describe("validateSchema()", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("rejects when the schema fails to load (HTTP error)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 404, json: async () => ({}) })),
    );
    const { validateSchema } = await import("../src/lib/eidosmodel");
    await expect(validateSchema({ id: "x", name: "x" })).rejects.toThrow(
      "Loading error: 404",
    );
  });

  it("accepts a spec that satisfies the schema (resolving $refs via the loader)", async () => {
    vi.stubGlobal("fetch", goodFetch);
    const { validateSchema } = await import("../src/lib/eidosmodel");
    await expect(
      validateSchema({ id: "ok", name: "OK", root: { nodeType: "world" } }),
    ).resolves.toBe(true);
    // The $ref child schema must have been fetched through the loader.
    expect(goodFetch).toHaveBeenCalledWith(CHILD);
  });

  it("rejects a spec that violates the schema — validation is not a no-op", async () => {
    vi.stubGlobal("fetch", goodFetch);
    const { validateSchema } = await import("../src/lib/eidosmodel");
    await expect(
      validateSchema({ id: 123, root: { nodeType: 42 } }),
    ).rejects.toThrow(/EIDOS spec validation failed/);
  });
});
