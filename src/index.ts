import { type UserConfig } from "vitepress";
import { MCPPlugin } from "./mcp-plugin";
export { UserConfig };

declare module "vitepress" {
  interface UserConfig {
    mcp?: any;
    mcpPlugin?: any;
  }
}

export const withMCP = (config: UserConfig) => {
  if (!config.vite) config.vite = {};
  if (!config.vite.plugins) config.vite.plugins = [];
  config.vite.plugins.push(MCPPlugin(config.mcp));
  if (!config.vite.optimizeDeps) config.vite.optimizeDeps = {};
  if (!config.vite.optimizeDeps.include) config.vite.optimizeDeps.include = [];

  if (!config.vite.resolve) config.vite.resolve = {};

  return config;
};
