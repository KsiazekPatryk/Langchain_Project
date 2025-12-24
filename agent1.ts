import { createAgent, tool } from "langchain";
import "dotenv/config";
import z from "zod"

//20-30 {city : "New York"}


const getWeather = tool( (input)=>{
    //${input.city} By Getting Weather - returned Sunny
    return  `The weather in ${input.city} is sunny with a high of 75°F and a low of 55°F.`;
    },
    {
        name : "getWeather",
        description : "Get the current weather for a given city.",
        schema : z.object({
            city : z.string()
            })
    },
);

const getTime = tool((input)=>{
    return 'The current time in ${input.city} is 3:00 PM.'
},
    {
        name: "getTime",
        description: "Get the current time in a given city.",
        schema: z.object({
            city: z.string()
        }),
    }
)

const agent = createAgent(
    {model: "claude-sonnet-4-5-20250929"
    , tools: [getWeather,getTime]
    },


    );

const response = await agent.invoke({
        //messages : [{role:"user", content:"What is weather in New York"}]
        //messages : [{role:"user", content:"What is the time in New York?"}]
        messages : [{role:"user", content:"What is the weather & time in New York?"}]
    });
//const longMessage = response.messages[response.messages.length - 1].content;
//console.log(longMessage);

