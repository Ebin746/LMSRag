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


def build_standalone_query_prompt(question: str, history: list[dict]) -> str:
    """
    Build a prompt to rewrite the user query based on the conversation history.
    """
    history_text = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in history])
    return f"""
Given the following conversation history and the user's new question, rewrite the question to be a standalone query that captures the full context.
If the new question is already standalone or doesn't refer to the history, just return the original question.
Do NOT answer the question, only output the rewritten question.

========================
CHAT HISTORY
========================
{history_text}

========================
NEW QUESTION
========================
{question}

========================
REWRITTEN QUESTION
========================
""".strip()

def build_prompt(
    question: str,
    search_results: list[dict],
    history: list[dict] = None,
    prompt_type: str = "student"
) -> str:
    """
    Build the prompt for the LLM.
    """

    context = build_context(search_results)
    
    history_text = ""
    if history:
        history_text = "\n========================\nCHAT HISTORY\n========================\n"
        history_text += "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in history])
        history_text += "\n"

    if prompt_type == "faq":
        instructions = """- Treat the provided context as the primary source of truth.
- Be extremely friendly, welcoming, and helpful. Use emojis occasionally (like 👋 or 😊).
- Be concise, direct, and to the point. Answer in 1-3 short sentences if possible.
- Output ONLY plain text. Do NOT use any Markdown formatting, bolding, italics, or code blocks.
- Avoid any lengthy explanations.
- Answer naturally in clear English.
- Do NOT mention that you are using context.
- Do NOT say "According to the context..."
- Only respond with "I'm sorry, I couldn't find that information. Could you try rephrasing your question?" when the retrieved documents and history are completely unrelated."""
    else:
        instructions = """- Treat the provided context as the primary source of truth.
- Provide a detailed and comprehensive answer to help the student learn.
- Include examples or explanations if supported by the context.
- Break down complex topics into easy-to-understand parts.
- Answer naturally in clear English.
- Format the output using proper Markdown (e.g., bolding, bullet points, code blocks) to improve readability.
- Mention document names if it helps the student find more information.
- If some detail is missing, infer it only when directly supported by the context or chat history.
- Do NOT mention that you are using context.
- Do NOT say "According to the context..."
- Only respond with "I could not find that information in the uploaded course materials." when the retrieved documents are completely unrelated."""

    return f"""
You are an intelligent AI assistant for a Learning Management System (LMS).

You have already been given the most relevant document excerpts retrieved from the knowledge base.

Your task is to answer the user's question using these excerpts and the provided conversation history.

Instructions:

{instructions}
{history_text}
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