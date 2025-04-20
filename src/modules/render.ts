import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import { MarkdownEnv } from "vitepress";
import MarkdownIt from "markdown-it";
let renderCount = 0;

export default async function (src: string, env: MarkdownEnv, md: MarkdownIt) {
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
}
