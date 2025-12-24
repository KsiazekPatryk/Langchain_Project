import { createAgent, llmToolSelectorMiddleware, modelCallLimitMiddleware, summarizationMiddleware, tool } from "langchain";
import { userInfo } from "os";
import z from "zod"
import "dotenv/config"



const searchTool = tool(({query})=> 
{
    return `Search results for "${query}" : Found 5 articles are returned`
},
{
    name: "search",
    description: "Search the internet for information",
    schema: z.object({
        query: z.string()
    })
})

const emailTool = tool(({recipient,subject}) => {
    `Email sent to ${recipient} with subject: ${subject}`
}, {
    name: "send_email",
    description: "Send an email to someone",
    schema: z.object({
        recipient: z.string(),
        subject: z.string(),
    })
})

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

//10,000 - 
const agent = createAgent({
    model: "gpt-4o",
    tools: [searchTool,emailTool,getWeather],
    middleware : [
        modelCallLimitMiddleware("gpt-4o-mini","gpt-3.5-turbo"),
        summarizationMiddleware({
            model: "gpt-4o",
            maxTokensBeforeSummary: 8000, //Trigger summarization of 8000 tokens
            messagesToKeep: 20,
        }),
        //50 tools - basic model - 3-4 tools - Main model (reasoning) - output
        llmToolSelectorMiddleware({
            
            model: "gpt-4o-mini",
            maxTools : 2,


        })
    ]
})

const response = await agent.invoke({
    messages: [{role: "user", content: "What is the weather in Tokyo and email to noname@gmail.com with subject"}]
})
console.log(response)