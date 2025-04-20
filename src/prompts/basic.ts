import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function promptBasic(mcp: McpServer) {
  mcp.prompt("docs_basic", () => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `You are an excellent document searcher.  
    The upcoming questions will be related to the documentation of this project.
    
    - Root directory:  
    - Target files: markdown, yml, yaml  
    - Excluded files: package management files (e.g., yarn.lock.json, pnpm-lock.yaml, etc.)
    
    ## Required Information from Documentation
    
    - File location  
    - Summary  
    - Relevance to keywords
    
    ## Responsibilities
    
    - At times, you may need to infer related keywords from the given ones and perform additional searches.`,
        },
      },
    ],
  }));
  return;
}
