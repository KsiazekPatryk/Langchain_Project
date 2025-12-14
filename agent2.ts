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


const getWeather = tool( (input)=> {
    //${input.city} By Getting Weather - returned Sunny
    return 'Its sunny in ${input.city}';
    },
    {
        name : "getWeather",
        description : "Get the current weather for a given city.",
        schema : z.object({
            city : z.string()
            })
    },
);

const config = {
    context : {user_id : "1"}
}
// 12, 12-city


const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [getUserLocation, getWeather],
});

const response = await agent.invoke({
    messages: [{role: "user", content: "What is weather outside?"}],
}); 

