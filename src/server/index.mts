import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { InMemoryEventStore } from "@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js";
import { z } from "zod";
import { search } from "../modules/search";

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

/**
 * Initialize the MCP server with a transport.
 * @private
 * @param transport
 */
const initializeMCPServer = async (transport: StreamableHTTPServerTransport) => {
  // Clean up transport when closed
  transport.onclose = () => {
    if (transport.sessionId) {
      delete transports[transport.sessionId];
    }
  };
  const server = new McpServer({
    name: "example-server",
    version: "1.0.0",
  });

  // ... set up server resources, tools, and prompts ...
  server.tool("search-docs", { keyword: z.string() }, async ({ keyword }) => {
    const results = search(keyword);
    const mcpResponse = results.map((item) => ({
      type: "text" as const,
      text: JSON.stringify(item),
    }));
    return { content: mcpResponse };
  });

  // Connect to the MCP server
  await server.connect(transport);
};

const main = async () => {
  const app = express();
  app.use(express.json());

  // Handle POST requests for client-to-server communication
  app.post("/mcp", async (req, res) => {
    // Check for existing session ID
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      // Reuse existing transport
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      const eventStore = new InMemoryEventStore();
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        eventStore, // Enable resumability
        onsessioninitialized: (sessionId) => {
          // Store the transport by session ID
          transports[sessionId] = transport;
        },
      });

      initializeMCPServer(transport).catch((error) => {
        console.error("Error initializing MCP server:", error);
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -33000,
            message: "Internal Server Error",
          },
          id: null,
        });
        return;
      });
    } else {
      // Invalid request
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: null,
      });
      return;
    }

    // Handle the request
    await transport.handleRequest(req, res, req.body);
  });

  // Reusable handler for GET and DELETE requests
  const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  };

  // Handle GET requests for server-to-client notifications via SSE
  app.get("/mcp", handleSessionRequest);

  // Handle DELETE requests for session termination
  app.delete("/mcp", handleSessionRequest);

  app.listen(3000);
  console.log("Server is running on http://localhost:3000/mcp");
};

main().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
