import { proxy, subscribe, snapshot } from "valtio/vanilla";
import { validateSchema } from "./eidosmodel";
import { EidosSpec } from "../schema/interfaces";

const DEFAULT_RENDERER = "https://render.eidos.oceanum.io";

/**
 * Embed the EIDOS iframe and set up message passing
 * @param element HTML element to render the EIDOS spec into
 * @param spec The EIDOS specification object
 * @param id The unique identifier for the EIDOS spec (optional, defaults to spec.id)
 * @param eventListener Optional callback for handling events from the renderer
 * @param renderer URL of the EIDOS renderer
 * @returns A proxy object that can be used with useEidosSpec
 */
const render = async (
  element: HTMLElement,
  spec: EidosSpec,
  id?: string,
  eventListener?: (payload: unknown) => void,
  renderer = DEFAULT_RENDERER
): Promise<Proxy<EidosSpec>> => {
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
    element.appendChild(iframe);

    iframe.onload = () => {
      const win = iframe.contentWindow;

      window.addEventListener("message", (event) => {
        if (event.source !== win) return;
        if (event.data.id !== id) return;

        if (event.data.type === "init") {
          // Send initial spec
          win?.postMessage(
            {
              id: _id,
              type: "spec",
              payload: structuredClone(eidos),
            },
            "*"
          );
        } else {
          eventListener?.(event.data.payload);
        }
      });

      // Subscribe to changes and send patches to renderer
      subscribe(eidos, () => {
        win?.postMessage(
          {
            id: _id,
            type: "spec",
            payload: snapshot(eidos),
          },
          "*"
        );
      });

      resolve(eidos);
    };

    iframe.onerror = () => {
      reject(new Error("Failed to load EIDOS renderer"));
    };
  });
  return eidos;
};

export { render };
