import os
from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
)
from typing import Optional

from database.supabase_client import supabase
from services.pdf_service import (
    process_pdf,
    delete_pdf,
)
from services.embedding_service import embed_documents
from services.vector_service import add_chunks


router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


@router.post("/")
async def upload_pdfs(
    files: list[UploadFile] = File(...),
    course_id: Optional[str] = Form(None),
    module_id: Optional[str] = Form(None),
    batch_id: Optional[str] = Form(None),
):
    """
    Upload one or more PDFs.

    Optional form fields:
      - course_id  : Supabase UUID of the course this document belongs to
      - module_id  : Supabase UUID of the module
      - batch_id   : Supabase UUID of the batch

    Flow
    ────
    1. Process PDF → chunks
    2. Embed chunks (Gemini RETRIEVAL_DOCUMENT)
    3. Insert metadata record into Supabase documents table
    4. Upsert embeddings + rich metadata into ChromaDB via vector_service
    """
    if len(files) == 0:
        raise HTTPException(
            status_code=400,
            detail="No PDF uploaded."
        )

    uploaded_documents = []

    for file in files:

        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail=f"{file.filename} is not a PDF."
            )

        file_path = None

        try:

            # -----------------------------------
            # 1. Process PDF → chunks
            # -----------------------------------

            file_path, chunks = process_pdf(file)

            texts = [chunk["content"] for chunk in chunks]

            # -----------------------------------
            # 2. Batch Embeddings
            # -----------------------------------

            embeddings = embed_documents(texts)

            # -----------------------------------
            # 3. Insert document record (Supabase)
            #    Keeps relational metadata intact.
            # -----------------------------------

            doc_payload: dict = {"filename": file.filename}
            if course_id:
                doc_payload["course_id"] = course_id
            if module_id:
                doc_payload["module_id"] = module_id

            document = (
                supabase
                .table("documents")
                .insert(doc_payload)
                .execute()
            )

            document_id = document.data[0]["id"]

            # -----------------------------------
            # 4. Upsert chunks into ChromaDB
            # -----------------------------------

            stored = add_chunks(
                chunks=chunks,
                embeddings=embeddings,
                document_id=document_id,
                filename=file.filename,
                course_id=course_id,
                module_id=module_id,
                batch_id=batch_id,
            )

            uploaded_documents.append(
                {
                    "document_id": document_id,
                    "filename":    file.filename,
                    "chunks":      stored,
                    "course_id":   course_id,
                    "module_id":   module_id,
                    "batch_id":    batch_id,
                }
            )

        except Exception as e:

            raise HTTPException(
                status_code=500,
                detail=f"{file.filename} : {str(e)}"
            )

        finally:

            if file_path and os.path.exists(file_path):
                delete_pdf(file_path)

    return {
        "message":            "Upload completed successfully.",
        "documents_uploaded": len(uploaded_documents),
        "documents":          uploaded_documents,
    }