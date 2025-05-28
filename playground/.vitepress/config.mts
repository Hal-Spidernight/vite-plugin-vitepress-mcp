import { defineConfig } from "vitepress";
// import { MCPPlugin } from "vite-plugin-vitepress-mcp";
import { MCPPlugin } from "../../src/index";

// import render from "./render.mts";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VitePress MCP Server",
  description: "VitepressをMCPに組み込むためのドキュメント",
  themeConfig: {
    search: {
      provider: "local",
      options: {},
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
  },
  vite: {
    plugins: [MCPPlugin({ port: 4000 })],
  },
});
