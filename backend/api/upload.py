import os 
from fastapi import(
    APIRouter,
    UploadFile,
    File,
    HTTPException
) 

from database.supabase_client import supabase
from service.pdf_service import(
    process_pdf,
    delete_pdf
)

from service.embedding_service import (
    embed_documents
)


router=APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

@router.post("/")
async def upload_pdfs(
    files: list[UploadFile] = File(...)
):
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
            # Process PDF
            # -----------------------------------

            file_path, chunks = process_pdf(file)

            texts = [
                chunk["content"]
                for chunk in chunks
            ]

            # -----------------------------------
            # Batch Embeddings
            # -----------------------------------

            embeddings = embed_documents(texts)

            # -----------------------------------
            # Insert document
            # -----------------------------------

            document = (
                supabase
                .table("documents")
                .insert(
                    {
                        "filename": file.filename
                    }
                )
                .execute()
            )

            document_id = document.data[0]["id"]

            # -----------------------------------
            # Prepare Bulk Insert
            # -----------------------------------

            rows = []

            for chunk, embedding in zip(
                chunks,
                embeddings
            ):

                rows.append(
                    {
                        "document_id": document_id,
                        "content": chunk["content"],
                        "page": chunk["page"],
                        "chunk_index": chunk["chunk_index"],
                        "embedding": embedding,
                    }
                )

            # -----------------------------------
            # Bulk Insert
            # -----------------------------------

            (
                supabase
                .table("document_chunks")
                .insert(rows)
                .execute()
            )

            uploaded_documents.append(
                {
                    "document_id": document_id,
                    "filename": file.filename,
                    "chunks": len(rows),
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
        "message": "Upload completed successfully.",
        "documents_uploaded": len(uploaded_documents),
        "documents": uploaded_documents,
    }