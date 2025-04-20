// const path = require("path");
// const { defineConfig } = require("vite");
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "VitePressMCPPlugin",
    },
    rollupOptions: {
      external: [
        // "markdown-it",
      ],
    },
  },
});
