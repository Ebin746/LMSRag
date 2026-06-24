import os
from dotenv import load_dotenv

from fastapi import FastAPI,UploadFile,File
from pydantic import BaseModel

from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI,
)

from langchain_community.document_loaders import PyPDFLoader

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter

)

from langchain_community.vectorstores import FAISS

from langchain.chains.question_answering import (
    load_qa_chain,
)
load_dotenv()
from fastapi.middleware.cors import CORSMiddleware
app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

vector_store=None

embeddings=GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-2"

)

llm=ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.4
)


@app.get("/api/health")
def home():
    return {"message":"Rag backend running"}


@app.post("/upload")
async def upload_pdf(
    file:UploadFile=File(...)

):
    global vector_store

    os.makedirs(
        "uploads",
        exist_ok=True
    )

    file_path=(
        f"uploads/{file.filename}"
    )

    with open(file_path ,"wb") as f:
        f.write(await file.read())

    loader=PyPDFLoader(file_path)
    docs=loader.load()


    splitter=(
        RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200

        )   
    )

    chunks=splitter.split_documents(
        docs
    )

    vector_store=(
        FAISS.from_documents(
            chunks,
            embeddings
        )

    )

class QuestionsRequest(BaseModel):
    qustion:str

@app.post("/chat")
async def chat(
    request:QuestionsRequest
):
    global vector_store
    if vector_store is None :
        return {
            "answere":
            "Please upload a pdf first"

        }
    
    docs=(
        vector_store.similarity_search(
            request.question,
            k=4
        )
    )


    chain=load_qa_chain(
        llm,
        chain_type="stuff"

    )
    response=chain.run(
        input_document=docs,
        question=request.question,
    )
    return {
        "answere":response
    }