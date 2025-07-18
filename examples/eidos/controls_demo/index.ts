import "./style.css";
import { embed } from "@oceanum/eidos";

document.querySelector("#app")!.innerHTML = `
  <div>
    <h1>EIDOS demo</h1>
    <div class="eidos">
      <button id="counter" type="button"></button>
    </div>
  </div>
`;

const spec = {
  id: "overlay-demo",
  name: "DemControls",
  description: "Demonstration of controls",
  title: "Controls demo",
  data: [],
  root: {
    id: "map-1",
    nodeType: "world",
    nodeSpec: {
      baseLayer: "oceanum",
      viewState: {
        viewType: "map",
        longitude: 174,
        latitude: -39.5,
        pitch: 45,
        bearing: 0,
        maxZoom: 19,
        zoom: 8,
        maxPitch: 80,
      },
      currentTime: "2019-01-01 00:00:00Z",
      timeControl: {
        range: ["2019-01-01 00:00:00Z", "2020-01-01 00:00:00Z"],
      },
      mapControls: [
        {
          position: { top: 100, left: 10 },
          orientation: "horizontal",
          visible: true,
          controls: [
            {
              type: "drop",
              id: "dropTree",
              tooltip: "Plant a tree",
              icon: {
                default: "icon://tree",
                hover: "icon://tree",
                cursorOffset: { x: 32, y: 32 },
              },
            },
            { type: "points", id: "points", tooltip: "Select points" },
            { type: "polygon", id: "polygon", tooltip: "Draw polygon" },
          ],
        },
      ],
      gridLayout: { w: 6, h: 1, x: 0, y: 0 },
    },
  },
};

embed(document.querySelector(".eidos"), spec, (payload) =>
  console.log(payload)
);
