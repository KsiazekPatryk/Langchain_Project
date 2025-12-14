import { createAgent, tool} from "langchain";
import z from "zod"


const getUserLocation = tool((_,config) => {

    const user_id = config.context.user_id;
    // fire database query to get location based on user_id/API
    user_id === 1 ? "Florida" : "SFO";
    },


    {
        name : "getUserLocation",
        description : "Retrieve user information based on User Id",
        schema: z.object({})
    }
);


const config = {
    context : {user_id : "1"}
}
// 12, 12-city


const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [],
});

const response = await agent.invoke({
    messages: [{role: "user", content: "What is weather outside?"}],
});