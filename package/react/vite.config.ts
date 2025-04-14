import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: "./tsconfig.app.json" })],
  build: {
    lib: {
      name: "index",
      formats: ["es", "cjs"],
      fileName: (module, entry) => `${entry}.${module === "es" ? "m" : "c"}js`,
      entry: resolve(__dirname, "index.ts"),
    },
  },
});
