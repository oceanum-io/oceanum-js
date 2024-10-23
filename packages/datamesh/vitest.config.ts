import { defineConfig } from "vite";

export default defineConfig({
  watch: true,
  typecheck: {
    enabled: true,
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    checker: "tsc --noEmit --pretty false --watch",
  },
});
