import { proxy, subscribe } from "valtio";
import { validateSchema } from "./eidosmodel";

const DEFAULT_RENDERER = "https://render.eidos.oceanum.io";

// Embed the EIDOS iframe and set up message passing
const render = async (
  element: HTMLElement,
  spec: any,
  eventListener?: (payload: any) => void,
  renderer = DEFAULT_RENDERER
) => {
  // Validate the spec before creating proxy
  try {
    await validateSchema(spec);
  } catch (e: any) {
    throw new Error(`Invalid Eidos Spec: ${e.message}`);
  }

  // Create Valtio proxy - naturally mutable, no unprotect needed
  const eidos = proxy(structuredClone(spec));

  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.src = `${renderer}`;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";
    element.appendChild(iframe);

    iframe.onload = () => {
      const win = iframe.contentWindow;

      window.addEventListener("message", (event) => {
        if (event.source !== win) return;
        if (event.data.id !== eidos.id) return;

        if (event.data.type === "init") {
          // Send initial spec
          win?.postMessage(
            {
              id: eidos.id,
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
      subscribe(eidos, (ops) => {
        // ops are already JSON patch format operations
        win?.postMessage(
          {
            id: eidos.id,
            type: "patch",
            payload: ops,
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
};

export { render };
