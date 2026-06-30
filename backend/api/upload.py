
import os

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
    Depends,
)

from typing import Optional

import uuid

from database.supabase_client import supabase
from services.pdf_service import (
    process_pdf,
    delete_pdf,
)

from services.embedding_service import embed_documents
from services.vector_service import add_chunks, get_metadata_by_document_id, get_all_document_metadata, delete_by_document_id

from core.dependencies import require_admin


router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)


@router.post("")
async def upload_pdfs(
    files: list[UploadFile] = File(...),
    visibility:str=Form("public"),
    course_id: Optional[str] = Form(None),
    module_id: Optional[str] = Form(None),

    current_user: dict = Depends(require_admin),
):
    """
    Upload PDFs (Admin Only).
    """

    if len(files) == 0:
        raise HTTPException(
            status_code=400,
            detail="No PDF uploaded.",
        )

    uploaded_documents = []

    for file in files:

        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail=f"{file.filename} is not a PDF.",
            )

        file_path = None

        try:

            file_path, chunks = process_pdf(file)

            texts = [
                chunk["content"]
                for chunk in chunks
            ]

            embeddings = embed_documents(texts)

            document_id = str(uuid.uuid4())
            print("NEW UPLOAD FILE IS RUNNING")
            stored = add_chunks(
            chunks=chunks,
            embeddings=embeddings,
            document_id=document_id,
              filename=file.filename,

                visibility=visibility,

                course_id=course_id,

            module_id=module_id,

        

            uploaded_by=current_user["id"],
                )
            chroma_metadata = get_metadata_by_document_id(document_id)
            uploaded_documents.append(
                {
                    "document_id": document_id,
                    "filename": file.filename,
                    "visibility": visibility,
                    "chunks": stored,
                    "course_id": course_id,
                    "module_id": module_id,
                    "chroma_metadata": chroma_metadata,
                }
            )

        finally:

            if file_path and os.path.exists(file_path):
                delete_pdf(file_path)

    return {
        "message": "Upload completed successfully.",
        "uploaded_by": current_user["name"],
        "documents_uploaded": len(uploaded_documents),
        "documents": uploaded_documents,
    }

@router.get("/documents")
async def get_all_documents(
    current_user: dict = Depends(require_admin),
):
    """
    Get all uploaded document metadata from ChromaDB (Admin Only).
    """
    documents = get_all_document_metadata()
    return {"documents": documents}

@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: str,
    current_user: dict = Depends(require_admin),
):
    """
    Delete a document and its chunks from ChromaDB (Admin Only).
    """
    try:
        delete_by_document_id(document_id)
        return {"message": "Document deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))