/**
 * Regression tests for render() message handling and mount lifecycle.
 *
 * - The init-message handler must post a *snapshot* of the valtio proxy:
 *   proxies are not structured-cloneable, so cloning/posting the proxy
 *   itself threw DataCloneError on every renderer init and the spec never
 *   reached the iframe.
 * - A failed iframe load must clean up the container, otherwise the
 *   data-eidos-initialized guard rejects every retry in that element.
 */
import { describe, expect, it, vi } from "vitest";
import * as v8 from "node:v8";

// Some DOM test environments do not expose structuredClone. Polyfill with
// the v8 serializer, which has the same DataCloneError semantics for
// proxies as the real structured clone algorithm.
if (typeof globalThis.structuredClone !== "function") {
  (globalThis as Record<string, unknown>).structuredClone = (value: unknown) =>
    v8.deserialize(v8.serialize(value));
}

// render() schema-validates against the live schema URL before mounting —
// stub it so tests stay offline.
vi.mock("../src/lib/eidosmodel", () => ({
  validateSchema: vi.fn().mockResolvedValue(true),
}));

import { render } from "../src/lib/render";
import { validateSchema } from "../src/lib/eidosmodel";

const makeSpec = () => ({
  version: "0.11",
  id: "test-spec",
  name: "Test Spec",
  root: { id: "root", nodeType: "world" },
});

/** Wait until render() has appended its iframe to the container. */
const waitForIframe = async (el: HTMLElement): Promise<HTMLIFrameElement> => {
  for (let i = 0; i < 50; i++) {
    const iframe = el.querySelector<HTMLIFrameElement>("iframe");
    if (iframe) return iframe;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  throw new Error("iframe was never created");
};

describe("render()", () => {
  it("responds to the renderer init message with a cloneable spec snapshot", async () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const pending = render(el, makeSpec());
    const iframe = await waitForIframe(el);
    iframe.dispatchEvent(new Event("load"));
    const view = await pending;

    const win = iframe.contentWindow;
    expect(win).toBeTruthy();
    const postMessage = vi.spyOn(win!, "postMessage");

    window.dispatchEvent(
      new MessageEvent("message", {
        data: { type: "init", id: "test-spec" },
        source: win,
      }),
    );

    expect(postMessage).toHaveBeenCalledTimes(1);
    const message = postMessage.mock.calls[0][0] as {
      id: string;
      type: string;
      payload: Record<string, unknown>;
    };
    expect(message.type).toBe("spec");
    expect(message.id).toBe("test-spec");
    expect(message.payload.name).toBe("Test Spec");
    // The payload must survive the structured clone that postMessage
    // performs — the old code posted the raw valtio proxy, which throws.
    expect(() => structuredClone(message.payload)).not.toThrow();

    view.destroy();
  });

  it("cleans up the container when the iframe fails to load, allowing retry", async () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const pending = render(el, makeSpec());
    const iframe = await waitForIframe(el);
    iframe.dispatchEvent(new Event("error"));

    await expect(pending).rejects.toThrow("Failed to load EIDOS renderer");
    expect(el.getAttribute("data-eidos-initialized")).toBeNull();
    expect(el.querySelector("iframe")).toBeNull();

    // A retry in the same container must not hit the already-mounted guard.
    const retry = render(el, makeSpec());
    const retryIframe = await waitForIframe(el);
    retryIframe.dispatchEvent(new Event("load"));
    const view = await retry;
    expect(view.iframe).toBe(retryIframe);
    view.destroy();
  });

  it("cleans up the container when spec validation fails, allowing retry", async () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    // e.g. a transient schema-fetch failure — must not poison the container.
    vi.mocked(validateSchema).mockRejectedValueOnce(
      new Error("Loading error: 503"),
    );
    await expect(render(el, makeSpec())).rejects.toThrow("Invalid Eidos Spec");
    expect(el.getAttribute("data-eidos-initialized")).toBeNull();
    expect(el.querySelector("iframe")).toBeNull();

    // A retry in the same container must not hit the already-mounted guard.
    const retry = render(el, makeSpec());
    const retryIframe = await waitForIframe(el);
    retryIframe.dispatchEvent(new Event("load"));
    const view = await retry;
    expect(view.iframe).toBe(retryIframe);
    view.destroy();
  });
});
