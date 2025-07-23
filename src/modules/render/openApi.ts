import { MarkdownEnv } from "vitepress";
import MarkdownIt from "markdown-it";
import fs from "node:fs";

/**
 * Render function for OpenAPI in VitePress.
 * @param content HTML content to render.
 */
export function openAPIRender(src: string, env: MarkdownEnv, md: MarkdownIt, specPath: string) {
  //openAPIのファイルを取得
  const openApiSpec = fs.readFileSync(specPath, "utf-8");
  if (!openApiSpec) {
    console.error("OpenAPI specification not found at path:", specPath);
    return;
  }
  // OASpecをSpecファイルの中身に置き換える
  const openAPISpecJson = JSON.stringify(openApiSpec, null, 2);
  return env.content?.replace("OASpec", openAPISpecJson) ?? env.content;
}
