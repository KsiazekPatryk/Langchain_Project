import { createAgent } from "langchain";

const agent = createAgent(
    {model: "claude-sonnet-4-5-20250929"}
    );

agent.invoke(
    {
        messages: [{role:"user", content:""}]
    }
)

