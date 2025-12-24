import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";


const loader = new PDFLoader("DOCUMENTS_PATH")
const docs = await loader.load()
console.log(docs.length)
console.log(docs[0].pageContent)


