import { defineConfig } from "vitepress";
import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";

let renderCount = 0;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VitePress MCP Server",
  description: "VitepressをMCPに組み込むためのドキュメント",
  themeConfig: {
    search: {
      provider: "local",
      options: {
        async _render(src, env, md) {
          console.log("env", env);
          const html = await md.render(src, env);

          // 検索用インデックスを生成・保存
          const indexPath = path.resolve(process.cwd(), ".vitepress", "search-index.json");
          let index: any[] = [];
          if (renderCount === 0) {
            fs.writeFileSync(indexPath, JSON.stringify([], null, 2), "utf-8");
          }
          if (fs.existsSync(indexPath)) {
            index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
            renderCount++;
          }
          const doc = {
            id: nanoid(),
            title: env?.title,
            relativePath: env?.relativePath,
            content: env.content,
            excerpt: env.excerpt,
            // path: env?.path, // Optional: path to the document
          };
          const exists = index.find((item) => item.id === doc.id);
          if (!exists) {
            index.push(doc);
            fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf-8");
          }

          if (env.frontmatter?.title) return (await md.render(`# ${env.frontmatter.title}`)) + html;
          return html;
        },
      },
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
});
