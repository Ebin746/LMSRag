# LMS RAG Backend

FastAPI backend for the LMS RAG project. This service handles authentication, PDF upload and indexing, retrieval-augmented chat, and admin access to course and module metadata.

## What It Uses

- FastAPI for the HTTP API
- Supabase for users, courses, and modules
- ChromaDB for vector storage and retrieval
- Google Gemini for embeddings
- Groq for chat generation
- JWT for authentication and role-based access control

## Requirements

- Python 3.10 or newer
- A Supabase project with the expected tables and data
- Google API credentials for embeddings
- Groq API credentials for chat responses

## Install

From the `backend` folder:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file in `backend/` with the required values:

```env
GOOGLE_API_KEY=your_google_api_key
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET_KEY=your_jwt_secret
```

Optional values:

```env
EMBEDDING_MODEL=gemini-embedding-2
EMBEDDING_DIMENSION=768
CHAT_MODEL=llama-3.3-70b-versatile
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CHROMA_PERSIST_DIR=chroma_store
CHROMA_COLLECTION_NAME=lms_documents
UPLOAD_DIR=uploads
ALLOWED_ORIGINS=http://localhost:3000
```

The app validates the required variables on startup and will fail fast if any are missing.

## Run

Start the API from the `backend` directory:

```bash
uvicorn main:app --reload
```

Default local URL:

- API: `http://127.0.0.1:8000`
- Docs: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

## API Overview

### Public

- `GET /` returns a simple service status response
- `GET /health` returns a health check response
- `POST /auth/login`
- `POST /auth/signup`

### Authenticated / Role-Based

- `POST /chat` accepts a question and uses the current user context when available
- `GET /courses` requires an admin token
- `GET /modules/{course_id}` requires an admin token

### Admin Only

- `POST /upload` uploads one or more PDFs, extracts text, embeds chunks, and stores them in ChromaDB
- `GET /upload/documents` lists uploaded document metadata
- `DELETE /upload/documents/{document_id}` removes a document and its chunks

## Authentication Flow

- `POST /auth/signup` creates a student account and returns a JWT access token
- `POST /auth/login` verifies credentials and returns a JWT access token
- Protected routes expect an `Authorization: Bearer <token>` header

## Data Model Notes

The backend expects Supabase tables for:

- `users`
- `courses`
- `modules`

It also stores vector data locally in `backend/chroma_store/` and temporary uploaded PDFs in `backend/uploads/`.

## RAG Database Schema

The retrieval-augmented generation layer uses a hybrid data model:

1. Supabase stores document metadata and LMS relationships.
2. ChromaDB stores chunk-level text and embeddings for semantic search.
3. Authorization is enforced through metadata filters applied during retrieval.

### 1. Supabase Document Metadata

The primary relational record for uploaded knowledge assets is the `documents` table.

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | UUID | Unique identifier for the uploaded document |
| `filename` | TEXT | Original file name |
| `uploaded_by` | UUID | References `users.id` and identifies the uploader |
| `course_id` | UUID | Optional reference to `courses.id` |
| `module_id` | UUID | Optional reference to `modules.id` |
| `uploaded_at` | TIMESTAMP | Time the document was registered |

This table is intentionally lightweight. It does not store embeddings or chunk content. Instead, it acts as the authoritative metadata layer for ownership, course mapping, and lifecycle tracking.

### 2. ChromaDB Chunk Store

The vector index is stored in the persistent ChromaDB collection named `lms_documents`.

Each uploaded PDF is split into chunks, and each chunk is stored with:

- Chunk text content
- Chunk embedding
- `document_id` to link back to the source document
- `filename`
- `page`
- `chunk_index`
- `visibility`
- `course_id`
- `module_id`
- `teacher_id`
- `uploaded_by`

This structure allows retrieval to return the most relevant passages while preserving the source context needed for citations and access control.

### 3. Access Control Metadata

The retrieval pipeline uses metadata-based filtering before vector search results are returned.

- Public users can only access content marked as public.
- Students can access public content and course-scoped content for enrolled courses.
- Teachers can access public content, teacher-visible content, and course-scoped content for assigned courses.
- Admin users can access all content.

This design keeps authorization close to the retrieval layer, which is important for RAG systems because the embedding index itself is not user-aware.

### 4. Legacy SQL Artifact

The repository also contains [backend/database/function.sql](backend/database/function.sql), which defines a pgvector-style `match_documents` function for tables such as `document_chunks`.

That function does not match the current Python implementation, which uses ChromaDB instead of a Postgres vector table. It is best treated as legacy or experimental schema code unless you plan to migrate the vector store from ChromaDB to Postgres.

### 5. Lifecycle Summary

The end-to-end flow is:

1. An admin uploads one or more PDFs.
2. The backend extracts text and splits it into chunks.
3. Chunks are embedded and stored in ChromaDB.
4. Document-level metadata is tracked through Supabase and embedded into Chroma metadata.
5. During chat, the system embeds the user question, filters chunks by role and visibility, and retrieves the most relevant passages.
6. The LLM generates an answer using the retrieved chunks and returns the sources.

## Behavior Notes

- Uploaded files must be PDFs
- The upload flow limits file size to 20 MB
- Chunking uses an 800 character chunk size with 150 character overlap
- Retrieval defaults to top 5 chunks

## Project Layout

- `main.py` app entrypoint
- `api/` route handlers
- `core/` config, dependencies, and security helpers
- `database/` Supabase and ChromaDB clients
- `models/` request and response schemas
- `services/` embedding, PDF, RAG, and auth logic

## Notes

If you change the API surface or required environment variables, update this README so it stays aligned with the backend code.