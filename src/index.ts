import { Plugin, UserConfig } from "vite";
import { UserConfig as VPUserConfig } from "vitepress";
import render from "./modules/render";

export type MCPPluginOptions = {
  port: number;
};

export function MCPPlugin(inlineOptions?: Partial<MCPPluginOptions>): Plugin {
  return {
    name: "vitepress-plugin-mcp",
    enforce: "pre",
    config: (userConfig: UserConfig, env): VPUserConfig => {
      const vpConfig = userConfig as VPUserConfig;
        console.log("vpConfig", userConfig.plugins);

      const vtPlg = (userConfig.plugins ?? []).find((plg: any) => plg.name === "vitepress");
      if (vtPlg && vtPlg.configResolved) {
        const originalConfig = vtPlg.configResolved;
        console.log("found vitepress");
        vtPlg.configResolved = function (vpUserConfig: VPUserConfig) {
          console.log("vpUserConfig", vpUserConfig);
          const vpUserThemeConfig = (vpUserConfig as any).vitepress.userConfig.themeConfig;

          console.log("vpUserThemeConfig", vpUserThemeConfig);

          if (!vpUserThemeConfig.themeConfig) vpUserThemeConfig.themeConfig = {};

          if (!vpUserThemeConfig.themeConfig.search) vpUserThemeConfig.themeConfig.search = {};

          if (!vpUserThemeConfig.themeConfig.search.options) vpUserThemeConfig.themeConfig.search.options = {};

          // _renderを上書き
          vpUserThemeConfig.themeConfig.search.options._render = async (src, env, md) => {
            return await render(src, env, md);
          };
          return originalConfig.call(this, vpUserConfig);
        };
      }
      return vpConfig;
    },
    // buildEnd: () => {
    //   // MCPサーバ起動
    //   runServer(inlineOptions?.port);
    // },
    // handleHotUpdate: async (ctx) => {
    //   await stopServer();
    // },
  } satisfies Plugin;
}
