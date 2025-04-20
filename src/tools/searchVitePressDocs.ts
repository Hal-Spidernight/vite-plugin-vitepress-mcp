import { z } from "zod";
import { search } from "../modules/search";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function toolSearchVitePressDocs(mcp: McpServer) {
  mcp.tool(
    "search_vitepress_docs",
    "Search VitePress Documents For This Product. Extract up to five keywords each English and native language, and define all of them as single words. e.g. Vitepress, API, Specification,Extensions etc.",
    { keywords: z.array(z.string()) },
    async ({ keywords }) => {
      console.log("START: search-docs", keywords);
      const results = keywords.map((keyword) => {
        const searchResults = search(keyword);
        return searchResults.map((item) => ({
          title: item.title,
          relativePath: item.relativePath,
          content: item.content,
          excerpt: item.excerpt,
        }));
      });
      console.log("END: search-docs", results);
      const mcpResponse = results.map((item) => ({
        type: "text" as const,
        text: JSON.stringify(item),
      }));
      console.log("mcpResponse", mcpResponse);
      return { content: mcpResponse };
    }
  );
}
