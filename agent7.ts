import { createAgent, llmToolSelectorMiddleware, modelCallLimitMiddleware, piiMiddleware, piiRedactionMiddleware, summarizationMiddleware, tool } from "langchain";
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
        piiRedactionMiddleware ({
            rules:{
                credit_card: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
                ssn : /\b\d{3}-\d{2}-\d{4}\b/g,
                phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
            }
        }) 
    ]
})

//const response = await agent.invoke({
//   messages: [{role: "user", content: "My card is 4532-1234-5678-9010, is mastercard or visa?"}]
//})
//console.log(response)

const response = await agent.invoke({
    messages: [{role: "user", content: "My ssn is 123-45-6789 and call me 555-123-4567"}]
})

console.log(response)