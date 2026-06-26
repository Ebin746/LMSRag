import os
from dotenv import load_dotenv
load_dotenv()
from database.supabase_client import supabase
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI,
)

from langchain_community.document_loaders import (
    PyPDFLoader,
)

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-2",
      output_dimensionality=768
)

llm = ChatGoogleGenerativeAI(
    model="gemini-3-flash-preview",
    temperature=0,
)


class QuestionRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {
        "message": "RAG Backend Running"
    }


@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):


    os.makedirs(
        "uploads",
        exist_ok=True,
    )

    file_path = os.path.join(
        "uploads",
        file.filename,
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    loader = PyPDFLoader(
        file_path
    )

    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )

    chunks = splitter.split_documents(docs)

    doc = supabase.table("documents").insert({
        "filename": file.filename
    }).execute()

    document_id = doc.data[0]["id"]

    for chunk in chunks:

        vector = embeddings.embed_query(
         chunk.page_content
        )

        supabase.table("document_chunks").insert({
        "document_id": document_id,
        "content": chunk.page_content,
        "embedding": vector
        }).execute()

    return {
        "message": "PDF uploaded successfully",
        "chunks": len(chunks),
    }


@app.post("/chat")
async def ask_question(
    request: QuestionRequest
):
  
    query_embedding = embeddings.embed_query(
            request.question
                )
    results = supabase.rpc(
        "match_documents",
        {
        "query_embedding": query_embedding,
        "match_count": 3
        }
        ).execute()
    context = ""

    for row in results.data:
        context += row["content"] + "\n\n"

    prompt = f"""
You are a helpful LMS assistant.

Answer ONLY from the provided context.

If the answer is not present in the context,
say "I could not find that information in the document."

Context:
{context}

Question:
{request.question}
"""

    response = llm.invoke(
        prompt
    )
    answer = response.content[0]["text"]
    print(answer)
    return {
        "answer": answer
    }