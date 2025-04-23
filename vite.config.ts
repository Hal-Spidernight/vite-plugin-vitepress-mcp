import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: path.resolve(__dirname, "./tsconfig.json"),
      exclude: ["playground/*"],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "VitePressMCPPlugin",
      fileName: (format: string) => (format == "es" ? `vitepress-plguin-mcp.${format}.mjs` : `vitepress-plugin-mermaid.${format}.js`),
    },
    rollupOptions: {
      external: ["markdown-it", "nanoid", "node:crypto", "crypto", "node:fs", "node:path", "node:util"],
      output: {
        globals: {
          "node:util": "node_util",
          "node:fs": "fs$2",
          "node:path": "require$$7$1",
          nanoid: "nanoid",
          crypto: "require$$0$3",
          "node:crypto": "node_crypto",
        },
      },
    },
  },
});
