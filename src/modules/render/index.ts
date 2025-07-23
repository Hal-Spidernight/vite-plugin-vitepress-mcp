import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import { MarkdownEnv } from "vitepress";
import MarkdownIt from "markdown-it";
import { openAPIRender } from "./openApi";
let renderCount = 0;

/**
 * Render function for VitePress.
 * @param src
 * @param env
 * @param md
 * @param buildMode
 * @returns
 */
export async function mainRender(src: string, env: MarkdownEnv, md: MarkdownIt, buildMode = false, specPath?: string) {
  const html = await md.render(src, env);

  const pathPrefix = getPathPrefix();

  //build時は.vitepress/distへ出力
  let buildPath = "";
  if (buildMode) {
    // ビルドモードの場合、.vitepressフォルダはプロジェクトルートにあると仮定
    buildPath = "dist";
  }

  // 検索用インデックスを生成・保存
  const indexPath = path.resolve(pathPrefix, ".vitepress", buildPath, "search-index.json");
  let index: any[] = [];
  if (renderCount === 0) {
    const dir = path.dirname(indexPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(indexPath, JSON.stringify([], null, 2), "utf-8");
  }
  if (fs.existsSync(indexPath)) {
    index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
    renderCount++;
  }

  if (env.content?.includes("OASpec")) {
    console.log("OpenAPI Spec detected. Using custom OpenAPI render.");
    if (specPath) {
      env.content = openAPIRender(src, env, md, specPath);
    } else {
      console.error("OpenAPI spec path is not defined. Skipping OpenAPI render.");
    }
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

/**
 * Get the path prefix for the VitePress project.
 * @returns
 * @private
 */
function getPathPrefix() {
  //.vitepressフォルダを検索
  const cliArgs = process.argv.slice(2);
  //NOTE: "npm run dev docs"のように実行した場合、cliArgs[0]は"dev"になる
  let pathPrefix = process.cwd();
  if (cliArgs.length >= 2) {
    const targetPathPrefix = cliArgs[1];
    pathPrefix = path.resolve(process.cwd(), targetPathPrefix);
  }
  return pathPrefix;
}
