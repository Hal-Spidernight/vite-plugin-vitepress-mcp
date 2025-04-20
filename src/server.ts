import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { InMemoryEventStore } from "@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js";
import { toolSearchVitePressDocs } from "./tools/searchVitePressDocs";
import { promptBasic } from "./prompts/basic";

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

const server = new McpServer({
  name: "VitePress-server",
  version: "1.0.0",
});

toolSearchVitePressDocs(server);
promptBasic(server);

/**
 * Initialize the transport for the MCP server.
 * @private
 * @returns
 */
const initializeTransport = async () => {
  let transport: StreamableHTTPServerTransport;
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

  // Clean up transport when closed
  transport.onclose = () => {
    if (transport.sessionId) {
      delete transports[transport.sessionId];
    }
  };

  return transport;
};

/**
 * Initialize the MCP server with a transport.
 * @private
 * @param transport
 */
const initializeMCPServer = async (transport: StreamableHTTPServerTransport, res: express.Response) => {
  try {
    // Connect to the MCP server
    await server.connect(transport);
  } catch (error) {
    console.error("Error initializing MCP server:", error);
    res.status(500).json({
      jsonrpc: "2.0",
      error: {
        code: -32603,
        message: "Internal Server Error",
      },
      id: null,
    });
    throw error;
  }
};

const app = express();
app.use(express.json());

// Handle POST requests for client-to-server communication
app.post("/mcp", async (req, res) => {
  try {
    // Check for existing session ID
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      // Reuse existing transport
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      transport = await initializeTransport();

      await initializeMCPServer(transport, res);
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
      res.send();
      return;
    }

    // Handle the request
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (req: express.Request, res: express.Response) => {
  console.log("Received request:", req.headers, req.body);
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

// graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  try {
    // すべてのトランスポートを閉じる
    for (const sessionId in transports) {
      const transport = transports[sessionId];
      if (transport) {
        await transport.close();
        console.log(`Transport closed for session ID: ${sessionId}`);
      }
    }
  } catch (error) {
    console.error(`Error closing transport:`, error);
  }

  await server.close();
  console.log("Server shutdown complete");
  process.exit(0);
});
