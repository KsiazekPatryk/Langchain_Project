import { MultiServerMCPClient } from "@langchain/mcp-adapters";  
import { ChatAnthropic } from "@langchain/anthropic";
import { createAgent,tool } from "langchain";


const client = new MultiServerMCPClient({

    ecommerce: {
        transport : "sdio",
        command : "node",
        args: ["./ecommerce-mcp-server.js"],

})

const mcpTools = await client. getTools();

const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [...mcpTools]
});

const response = await agent.invoke({
    messages : [{role: "user", content: "Get product with id 10"}]

})

