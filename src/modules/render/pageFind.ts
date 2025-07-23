import { MarkdownEnv } from "vitepress";
import MarkdownIt from "markdown-it";

export async function pageFindRender(src: string, env: MarkdownEnv, md: MarkdownIt, buildMode = false) {
  if (!buildMode) {
    console.warn("This function is intended for build mode only. Please set 'buildMode' to true.");
    return src; // Return original source if not in build mode
  }
}
