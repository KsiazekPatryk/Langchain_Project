import { createAgent, tool } from "langchain";
import z from "zod"


const searchTool(({query})=> 
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


const agent = createAgent({
    model: "gpt-4o",
    tools: [searchTool],
    middleware : []
})
