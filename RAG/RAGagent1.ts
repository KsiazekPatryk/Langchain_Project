import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


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

new OpenAIEmbeddings({
    model: "text-embedding-3-large",
})
