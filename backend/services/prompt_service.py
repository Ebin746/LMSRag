# app/services/prompt_service.py


def build_context(search_results: list[dict]) -> str:
    """
    Convert retrieved chunks into context.
    """

    context = []

    for chunk in search_results:

        context.append(
            f"""
Document : {chunk["filename"]}
Page     : {chunk["page"]}
Chunk    : {chunk["chunk_index"]}

Content:
{chunk["content"]}
""".strip()
        )

    return "\n\n-------------------------\n\n".join(context)


def build_prompt(
    question: str,
    search_results: list[dict]
) -> str:
    """
    Build final RAG prompt.
    """

    context = build_context(search_results)

    return f"""
You are an AI assistant for an LMS platform.

Answer ONLY using the provided context.

Rules:

1. Never hallucinate.
2. If the answer isn't available, say:
   "I could not find that information in the uploaded documents."
3. Use bullet points whenever possible.
4. Mention the source document and page number naturally.
5. If multiple documents contain relevant information,
   combine them.

==========================
Context
==========================

{context}

==========================
Question
==========================

{question}

==========================
Answer
==========================
"""