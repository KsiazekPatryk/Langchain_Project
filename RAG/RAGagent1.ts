import { PDFLoader } from "langchain/document_loaders/fs/pdf";


const loader = new PDFLoader("DOCUMENTS_PATH")
const docs = await loader.load()
console.log(docs.length)

