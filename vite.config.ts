import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    // nodePolyfills({
    //   include: ["path", "fs", "crypto", "util", "stream", "zlib", "http", "net", "events", "querystring"],
    //   // Whether to polyfill specific globals.
    //   globals: {
    //     Buffer: true, // can also be 'build', 'dev', or false
    //     global: true,
    //     process: true,
    //   },
    // }),
    dts({
      tsconfigPath: path.resolve(__dirname, "./tsconfig.json"),
      exclude: ["playground/*"],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "VitePressMCPPlugin",
      fileName: (format: string) => (format == "es" ? `vitepress-plugin-mcp.${format}.mjs` : `vitepress-plugin-mcp.${format}.js`),
    },
    rollupOptions: {
      external: ["markdown-it", "nanoid", "node:crypto", "crypto", "node:fs", "fs", "node:path", "path", "node:util", "node:zlib", "node:http", "node:events", "node:net", "stream", "querystring"],
      output: {
        globals: {
          "node:util": "node_util",
          "node:fs": "fs$2",
          fs: "require$$1$3",
          "node:path": "require$$7$1",
          "node:zlib": "require$$4$1",
          "node:http": "require$$2$1",
          "node:events": "require$$1$4",
          "node:net": "require$$1$3",
          stream: "require$$13",
          querystring: "require$$6$1",
          path: "require$$1$2",
          nanoid: "nanoid",
          crypto: "require$$0$3",
          "node:crypto": "node_crypto",
        },
      },
    },
  },
});
