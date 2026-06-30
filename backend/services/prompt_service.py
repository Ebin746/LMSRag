# app/services/prompt_service.py


def build_context(search_results: list[dict]) -> str:
    """
    Convert retrieved chunks into a readable context.
    """

    context = []

    for chunk in search_results:

        context.append(
            f"""
Document: {chunk["filename"]}
Page: {chunk["page"]}

Content:
{chunk["content"]}
""".strip()
        )

    return "\n\n------------------------------\n\n".join(context)


def build_prompt(
    question: str,
    search_results: list[dict],
) -> str:
    """
    Build the prompt for the LLM.
    """

    context = build_context(search_results)

    return f"""
You are an intelligent AI assistant for a Learning Management System (LMS).

You have already been given the most relevant document excerpts retrieved from the knowledge base.

Your task is to answer the user's question using these excerpts.

Instructions:

- Treat the provided context as the primary source of truth.
- Summarize and combine information from multiple documents when appropriate.
- Answer naturally in clear English.
- Use bullet points whenever they improve readability.
- Mention document names only when useful.
- If some small detail is missing, infer it only when it is directly supported by the provided context.
- Do NOT mention that you are using context.
- Do NOT say "According to the context..."
- Only respond with "I could not find that information in the uploaded documents." when the retrieved documents are completely unrelated to the user's question.

========================
DOCUMENTS
========================

{context}

========================
QUESTION
========================

{question}

========================
ANSWER
========================
"""