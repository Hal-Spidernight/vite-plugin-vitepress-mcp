## Vite Plugin VitePress MCP

## Example

```ts
import { defineConfig } from "vitepress";
import { MCPPlugin } from "../../dist";

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
