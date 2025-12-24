import { createAgent, tool} from "langchain";
import z from "zod"
import "dotenv/config";


const systemPrompt = "You are an expert weather forecaster. You have access to two tools. You have access to two tools: -get_weather_for_location: usethis to get the weather for a specific location. -get_user_location: use this to get the user's location. If a user asks you for the weather, make sure you know the location first. If you can tell from the question that they mean wherever they are, use get_use_location to find their location.";
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
    context : {user_id : "1"},
    db :    {}
}

const qaconfig = {
    context : {user_id : "3"},
    db :    {} //QA Database
}
// 12, 12-city


const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [getUserLocation, getWeather],
    systemPrompt
});

const response = await agent.invoke({
    messages: [{role: "user", content: "What is weather outside?"}],
},qaconfig); 

