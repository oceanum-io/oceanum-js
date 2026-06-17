import { proxy, subscribe, snapshot, Proxy } from "valtio/vanilla";
import { validateSchema } from "./eidosmodel";
import { EidosSpec } from "../schema/interfaces";
import { version } from "../../package.json";

const MINOR_VERSION = version.split(".").slice(0, 2).join(".");
const DEFAULT_RENDERER = `https://render.eidos.oceanum.io/v${MINOR_VERSION}/index.html`;

/**
 * Options for rendering an EIDOS spec
 */
export interface RenderOptions {
  /** The unique identifier for the EIDOS spec (optional, defaults to spec.id) */
  id?: string;
  /** Optional callback for handling events from the renderer */
  eventListener?: (payload: unknown) => void;
  /** URL of the EIDOS renderer */
  renderer?: string;
  /** Authentication token to pass to the renderer for data fetching */
  authToken?: string | (() => string | Promise<string>);
  /** Optional callback when the spec proxy changes (for syncing to external state like Yjs) */
  onChange?: (snapshot: EidosSpec) => void;
}

/**
 * Result from the render function
 */
export interface RenderResult {
  /** The reactive EIDOS spec proxy */
  spec: Proxy<EidosSpec>;
  /** Update the auth token sent to the renderer */
  updateAuth: (
    token: string | (() => string | Promise<string>),
  ) => Promise<void>;
  /** The iframe element */
  iframe: HTMLIFrameElement;
  /** Destroy the renderer and clean up resources */
  destroy: () => void;
  /** Send an event action to the renderer's event bus */
  triggerAction: (payload: unknown) => void;
}

/**
 * Embed the EIDOS iframe and set up message passing
 * @param element HTML element to render the EIDOS spec into
 * @param spec The EIDOS specification object
 * @param options Render options including id, eventListener, renderer URL, and authToken
 * @returns A RenderResult object containing the spec proxy and control methods
 */
const render = async (
  element: HTMLElement,
  spec: EidosSpec,
  options: RenderOptions = {},
): Promise<RenderResult> => {
  const {
    id,
    eventListener,
    renderer = DEFAULT_RENDERER,
    authToken,
    onChange,
  } = options;

  // Check if this container is already initialized
  // We check both for an existing iframe and a marker on the container itself
  // This prevents double-mounting even if destroy() was called but the container is being reused
  const existingIframe = element.querySelector("iframe[data-eidos-renderer]");
  const isInitialized =
    element.getAttribute("data-eidos-initialized") === "true";

  if (existingIframe || isInitialized) {
    throw new Error(
      "EIDOS renderer already mounted in this container. Call destroy() before re-rendering.",
    );
  }

  // Mark container as initialized
  element.setAttribute("data-eidos-initialized", "true");

  // Validate the spec before creating proxy
  try {
    await validateSchema(spec);
  } catch (e: any) {
    throw new Error(`Invalid Eidos Spec: ${e.message}`);
  }

  // Create Valtio proxy - naturally mutable, no unprotect needed
  const eidos = proxy(structuredClone(spec));
  const _id = id || spec.id;

  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.src = `${renderer}?id=${_id}`;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";
    // Mark this as an EIDOS iframe for duplicate detection
    iframe.setAttribute("data-eidos-renderer", "true");
    element.appendChild(iframe);

    let messageHandler: ((event: MessageEvent) => void) | null = null;
    let unsubscribe: (() => void) | null = null;

    iframe.onload = () => {
      const win = iframe.contentWindow;

      // Helper to send auth token to iframe
      const sendAuth = async (
        token: string | (() => string | Promise<string>),
      ) => {
        const resolvedToken =
          typeof token === "function" ? await token() : token;
        win?.postMessage(
          {
            id: _id,
            type: "auth",
            payload: resolvedToken,
          },
          "*",
        );
      };

      messageHandler = (event: MessageEvent) => {
        // Debug: log all messages from iframe
        if (event.source === win && event.data?.type) {
          console.log(
            "[EIDOS] Message from renderer:",
            event.data.type,
            event.data,
          );
        }

        if (event.source !== win) return;

        // Check ID only if both message and expected ID exist
        // Some EIDOS renderers may not include ID in event messages
        if (event.data.id && event.data.id !== _id) return;

        if (event.data.type === "init") {
          // Send initial spec. Use valtio's `snapshot()` — NOT
          // `structuredClone(eidos)` — to serialize the proxy. structuredClone
          // on a raw valtio Proxy throws DataCloneError ("#<Object> could not
          // be cloned"), whereas `snapshot()` returns a plain frozen object
          // that postMessage serializes cleanly. This matches the update path
          // below, which already uses `snapshot(eidos)`.
          win?.postMessage(
            {
              id: _id,
              type: "spec",
              payload: snapshot(eidos),
            },
            "*",
          );
          // Send auth token on init if provided
          if (authToken) {
            sendAuth(authToken);
          }
        } else if (event.data.type || event.data.action || event.data.control) {
          // Process as event - EIDOS events may not have 'type' but have 'action' and 'control'
          eventListener?.(event.data);
        }
      };
      window.addEventListener("message", messageHandler);

      // Subscribe to changes and send patches to renderer
      unsubscribe = subscribe(eidos, () => {
        const currentSnapshot = snapshot(eidos);

        // Send to renderer iframe
        win?.postMessage(
          {
            id: _id,
            type: "spec",
            payload: currentSnapshot,
          },
          "*",
        );

        // Notify parent of changes (for Yjs sync, etc.)
        onChange?.(currentSnapshot as EidosSpec);
      });

      // Send initial auth token if provided (in case init already happened)
      if (authToken) {
        sendAuth(authToken);
      }

      const triggerAction = (payload: unknown) => {
        win?.postMessage({ id: _id, type: "event", payload }, "*");
      };

      resolve({
        spec: eidos,
        updateAuth: sendAuth,
        triggerAction,
        iframe,
        destroy: () => {
          if (messageHandler) {
            window.removeEventListener("message", messageHandler);
          }
          if (unsubscribe) {
            unsubscribe();
          }
          iframe.remove();
          // Clear the initialization marker when explicitly destroyed
          element.removeAttribute("data-eidos-initialized");
        },
      });
    };

    iframe.onerror = () => {
      reject(new Error("Failed to load EIDOS renderer"));
    };
  });
};

export { render };
