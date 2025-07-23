## Vite Plugin VitePress MCP

npm

https://www.npmjs.com/package/vitepress-plugin-mcp

## Description

This Vite plugin is an extension plugin for using VitePress as an MCP server.
By adding the plugin to the VitePress config, you can launch the MCP server.

## Install

```
pnpm add -D vitepress-plugin-mcp
```

## Example

```ts
import { defineConfig } from "vitepress";
import { MCPPlugin } from "vitepress-plugin-mcp";

export default defineConfig({
  title: "VitePress MCP Server",
  description: "Vitepress Search MCP",
  themeConfig: {
    search: {
      provider: "local",
      options: {}, //INSERT THIS
    },
    ...
  },
  vite: {
    plugins: [MCPPlugin({ port: 4000 })], //INSERT THIS
  },
});
```

## Tools

| name                    | description                                                                                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search_vitepress_docs` | Search VitePress Documents For This Product. Extract up to five keywords each English and native language, and define all of them as single words. e.g. Vitepress, API, Specification,Extensions etc. |
