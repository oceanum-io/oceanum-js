/// <reference types='vitest' />
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import * as path from "path";

export default defineConfig({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/packages/layers",
  plugins: [
    dts({
      entryRoot: "src",
      tsconfigPath: path.join(__dirname, "tsconfig.lib.json"),
    }),
  ],
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    reportCompressedSize: true,
    target: "esnext",
    lib: {
      entry: "src/index.ts",
      name: "layers",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "@deck.gl/core",
        "@deck.gl/layers",
        "@deck.gl/geo-layers",
        "@luma.gl/core",
        "@oceanum/deck-gl-grid",
        "@oceanum/datamesh",
        /^@zarrita\//,
      ],
    },
  },
  test: {
    watch: true,
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../coverage/packages/layers",
      provider: "v8",
    },
  },
  resolve: {
    alias: {
      "@oceanum/deck-gl-grid": path.resolve(
        __dirname,
        "src/test/__mocks__/deck-gl-grid.ts",
      ),
      "@deck.gl/core": path.resolve(
        __dirname,
        "src/test/__mocks__/deck-gl-core.ts",
      ),
      "@oceanum/datamesh": path.resolve(
        __dirname,
        "src/test/__mocks__/oceanum-datamesh.ts",
      ),
    },
  },
});
