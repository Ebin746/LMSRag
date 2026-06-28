
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

from database.supabase_client import supabase

from services.pdf_service import (
    process_pdf,
    delete_pdf,
)

from services.embedding_service import embed_documents
from services.vector_service import add_chunks

from core.dependencies import require_admin


router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)


@router.post("/")
async def upload_pdfs(
    files: list[UploadFile] = File(...),
    course_id: Optional[str] = Form(None),
    module_id: Optional[str] = Form(None),
    batch_id: Optional[str] = Form(None),

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

            doc_payload = {
                "filename": file.filename,
                "uploaded_by": current_user["id"],
            }

            if course_id:
                doc_payload["course_id"] = course_id

            if module_id:
                doc_payload["module_id"] = module_id

            if batch_id:
                doc_payload["batch_id"] = batch_id

            document = (
                supabase
                .table("documents")
                .insert(doc_payload)
                .execute()
            )

            document_id = document.data[0]["id"]

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
                    "filename": file.filename,
                    "chunks": stored,
                    "course_id": course_id,
                    "module_id": module_id,
                    "batch_id": batch_id,
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