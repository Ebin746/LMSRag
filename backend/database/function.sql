-- Restore match_documents to accept vector parameter.
-- Now that upload.py stores embeddings as proper vector strings,
-- and rag_service.py queries with a string that casts to vector,
-- the original function signature works correctly.

DROP FUNCTION IF EXISTS public.match_documents(text, integer);
DROP FUNCTION IF EXISTS public.match_documents(vector, integer);
DROP FUNCTION IF EXISTS public.match_documents(vector(768), integer);

CREATE OR REPLACE FUNCTION public.match_documents(
    query_embedding vector(768),
    match_count     integer DEFAULT 5
)
RETURNS TABLE (
    id           bigint,
    document_id  bigint,
    filename     text,
    content      text,
    page         integer,
    chunk_index  integer,
    similarity   double precision
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        dc.id,
        dc.document_id,
        d.filename,
        dc.content,
        dc.page,
        dc.chunk_index,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM document_chunks dc
    JOIN documents d ON dc.document_id = d.id
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
$$;
