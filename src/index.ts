import { Plugin, UserConfig } from "vite";
import { UserConfig as VPUserConfig } from "vitepress";
import { styleText } from "node:util";
import render from "./modules/render";
import { runServer, restartServer } from "./modules/server";

export type MCPPluginOptions = {
  port: number;
};

let serverBootFlg = false;

export function MCPPlugin(inlineOptions?: Partial<MCPPluginOptions>): Plugin {
  return {
    name: "vite-plugin-vitepress-mcp",
    enforce: "post",
    config: (config: UserConfig): VPUserConfig => {
      const vpConfig = config as VPUserConfig;

      let vpUserThemeConfig = (config as any).vitepress.userConfig.themeConfig;

      if (!vpUserThemeConfig) vpUserThemeConfig = {};
      if (!vpUserThemeConfig.search) vpUserThemeConfig.search = {};
      if (!vpUserThemeConfig.search.options) {
        console.error(styleText("bgRed", "Vitepress search.options are not defined. Please set 'themeConfig.search.options' on VitePress config."));
        serverBootFlg = false;
        return config;
      }

      let originalRender = async (src: any, env: any, md: any) => {
        const html = await md.render(src, env);
        return html;
      };

      if (vpUserThemeConfig.search.options._render) {
        originalRender = vpUserThemeConfig.search.options._render;
      }
      vpUserThemeConfig.search.options._render = async (src: any, env: any, md: any) => {
        await render(src, env, md);
        return await originalRender(src, env, md);
      };
      serverBootFlg = true;

      return vpConfig;
    },
    configResolved() {
      setTimeout(async () => {
        if (!serverBootFlg) {
          console.error("search-index.json is not found.");
          return;
        }

        runServer(inlineOptions?.port);
      }, 1500);
    },
    async watchChange() {
      if (serverBootFlg) {
        await restartServer();
      }
    },
  } satisfies Plugin;
}
