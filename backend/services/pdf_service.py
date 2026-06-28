# app/services/pdf_service.py

import os
import shutil
from uuid import uuid4

from fastapi import UploadFile

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from core.config import settings


def save_pdf(file: UploadFile) -> str:
    """
    Save uploaded PDF and return its path.
    """

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    filename = f"{uuid4()}_{file.filename}"

    file_path = os.path.join(
        settings.UPLOAD_DIR,
        filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_path


def load_pdf(file_path: str):
    """
    Load PDF using LangChain.
    """

    loader = PyPDFLoader(file_path)

    return loader.load()


def split_documents(documents):
    """
    Split documents into chunks while preserving page numbers.
    """

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        separators=[
            "\n\n",
            "\n",
            ". ",
            " ",
        ],
    )

    chunks = splitter.split_documents(documents)

    processed_chunks = []

    for index, chunk in enumerate(chunks):

        processed_chunks.append(
            {
                "content": chunk.page_content,
                "page": chunk.metadata.get("page", 0) + 1,
                "chunk_index": index,
            }
        )

    return processed_chunks


def process_pdf(file: UploadFile):
    """
    Complete PDF processing pipeline.

    Save
        ↓
    Load
        ↓
    Split
    """

    path = save_pdf(file)

    documents = load_pdf(path)

    chunks = split_documents(documents)

    return path, chunks


def delete_pdf(file_path: str):
    """
    Delete temporary uploaded PDF.
    """

    if os.path.exists(file_path):
        os.remove(file_path)