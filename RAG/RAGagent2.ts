import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Embeddings } from "@langchain/core/embeddings";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {MemoryVectorStore} from "@langchain/classic/vectorstores/memory";
import "dotenv/config";
import { createAgent, dynamicSystemPromptMiddleware } from "langchain";

const loader = new PDFLoader("DOCUMENTS_PATH")
const docs = await loader.load()
console.log(docs.length)
console.log(docs[0].pageContent)

const textSpliter = new RecursiveCharacterTextSplitter(
    {
    chunkSize: 1000,
    chunkOverlap: 200
    }
);
const allSplits = await textSpliter.splitDocuments(docs)
console.log(allSplits.length);

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
})

const vectorStore = new MemoryVectorStore(embeddings);
await vectorStore.addDocuments(allSplits);

const ragMiddleware = dynamicSystemPromptMiddleware(async (state)=>
{
    const userMessage = state.messages[0].content;
    const query = typeof userMessage === "string" ? userMessage : "";
    const retrivedDocs = await vectorStore.similaritySearch(query,2 );
    const docsContent = retrivedDocs.map((doc) => doc.pageContent).join("\n\n");

    return `You are helpful assistant. Use the following context from the document to answer the user's question:\n\n${docsContent}`;




});
const agent = createAgent({
    model: "gpt-4o",
    tools: [],
    middleware: [ragMiddleware]
})

const result = await agent.invoke({
    messages: [{role: "user", content: "When was Nike incorporated?"}]

})




