import { defineConfig } from "vite";

export default defineConfig({
  typecheck: {
    enabled: true,
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
  },
});
