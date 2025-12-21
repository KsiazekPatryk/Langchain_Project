import { createAgent, createMiddleware, initChatModel, tool} from "langchain";
import z from "zod"
import "dotenv/config";
import { MemorySaver } from "@langchain/langgraph"
import { threadId } from "worker_threads";
import { ChatOpenAI } from "@langchain/openai";


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

const basicmodel = new ChatOpenAI(
    {
        model:"gpt-4o-mini",

    }
)


const dynamicModelSelection = createMiddleware({
    name : "dynamicModelSelection",
    wrapModelCall :(request,handler) =>
    {
        const messageCount = request.messages.length;
        return handler({
            ...request,
            model: messageCount >3? model : basicmodel
        })
    }
})

const config = {
    configurable : {threadId : "1"},
    context : {user_id : "1"},
    db :    {}
}

const qaconfig = {
    configurable : {threadId : "2"},
    context : {user_id : "3"},
    db :    {} //QA Database
}
// 12, 12-city
const responseFormat = z.object({
    humour_response : z.string(),
    weather_conditions : z.string() 
});

//if message count is less than 3 --> CheaperModel, AdvancedModel
const model = await initChatModel(
    "claude-sonnet-4-5-20250929",
    {
        temperature : 0.7, timeout: 30, max_tokens : 1000
    }
)




const checkpointer = new MemorySaver();

const agent = createAgent({
    model: model,
    tools: [getUserLocation, getWeather],
    systemPrompt,
    responseFormat,checkpointer,
    middleware: [dynamicModelSelection] as const
});

const response = await agent.invoke({
    messages: [{role: "user", content: "What is weather outside?"}],
},config); 

const response1 = await agent.invoke({
    messages: [{role: "user", content: "What location did you just tell me about?"}],
},config); 
const longMessage = response1.messages[response1.messages.length -1].content
console.log(longMessage)

const response2 = await agent.invoke({
    messages: [{role: "user", content: "Suggest me good places in that location?"}],
},config); 
const longMessage1 = response2.messages[response2.messages.length -1].content
console.log(longMessage1)

const response3 = await agent.invoke({
    messages: [{role: "user", content: "Suggest me good places in that location?"}],
},qaconfig); 

const longMessage3 = response3.messages[response3.messages.length -1].content
console.log(longMessage3)


console.log(response.structuredResponse);