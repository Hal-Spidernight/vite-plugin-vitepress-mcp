import { Plugin, UserConfig } from "vite";
import { UserConfig as VPUserConfig } from "vitepress";
import render from "./modules/render";

export function MCPPlugin(inlineOptions?: any): Plugin {
  return {
    name: "vite-plugin-mcp",
    enforce: "pre",
    config(userConfig: UserConfig): UserConfig {
      // SiteConfig 型にキャストして安全に操作
      const vpConfig = userConfig as VPUserConfig;

      //   // 例：markdown オプションを置き換え
      //   vpConfig.markdown = {
      //     ...(vpConfig.markdown || {}),
      //     lineNumbers: true,
      //   };

      return vpConfig;
    },
    configResolved: (resolvedConfig) => {
      const vpConfig = resolvedConfig as VPUserConfig;
      if (!vpConfig.themeConfig) vpConfig.themeConfig = {};
      if (!vpConfig.themeConfig.search) vpConfig.themeConfig.search = {};
      if (!vpConfig.themeConfig.search.options) vpConfig.themeConfig.search.options = {};
      if (!vpConfig.themeConfig.search.options._render) {
        vpConfig.themeConfig.search.options._render = async (src, env, md) => {
          return await render(src, env, md);
        };
      } else {
        vpConfig.themeConfig.search.options._render = async (src, env, md) => {
          await render(src, env, md);
          return await vpConfig.themeConfig.search.options._render(src, env, md);
        };
      }
    },
  } satisfies Plugin;
}
