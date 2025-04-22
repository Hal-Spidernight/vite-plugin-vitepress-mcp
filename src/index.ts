import { Plugin, UserConfig } from "vite";
import { UserConfig as VPUserConfig } from "vitepress";
import render from "./modules/render";

export type MCPPluginOptions = {
  port: number;
};

export function MCPPlugin(inlineOptions?: Partial<MCPPluginOptions>): Plugin {
  return {
    name: "vite-plugin-vitepress-mcp",
    enforce: "post",
    config: (config: UserConfig): VPUserConfig => {
      // console.log("config");
      const vpConfig = config as VPUserConfig;

      // console.log("vpUserConfig", vpConfig);
      let vpUserThemeConfig = (config as any).vitepress.userConfig.themeConfig;

      // console.log("vpUserThemeConfig", vpUserThemeConfig);

      if (!vpUserThemeConfig) vpUserThemeConfig = {};

      if (!vpUserThemeConfig.search) vpUserThemeConfig.search = {};

      if (!vpUserThemeConfig.search.options) vpUserThemeConfig.search.options = {};

      // _renderを上書き
      let originalRender = async (src, env, md) => {
        // console.log("no original");
        const html = await md.render(src, env);
        return html;
      };
      if (vpUserThemeConfig.search.options._render) {
        originalRender = vpUserThemeConfig.search.options._render;
      }
      vpUserThemeConfig.search.options._render = async (src, env, md) => {
        await render(src, env, md);
        return await originalRender(src, env, md);
      };

      // vpUserThemeConfig.search.options.hoge = "10"
      // console.log(vpConfig.vitepress.userConfig.themeConfig.search.options)
      return vpConfig;
    },
  } satisfies Plugin;
}
