import os
from dotenv import load_dotenv

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

from langchain_community.vectorstores import (
    FAISS,
)

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vector_store = None

embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-2"
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
    global vector_store

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

    chunks = splitter.split_documents(
        docs
    )

    vector_store = FAISS.from_documents(
        chunks,
        embeddings,
    )

    return {
        "message": "PDF uploaded successfully",
        "chunks": len(chunks),
    }


@app.post("/chat")
async def ask_question(
    request: QuestionRequest
):
    global vector_store

    if vector_store is None:
        return {
            "error": "Upload a PDF first"
        }
    docs = vector_store.similarity_search(
        request.question,
        k=3,
    )

    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

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
    print(response.content)
    answer = response.content[0]["text"]
    return {
        "answer": answer
    }