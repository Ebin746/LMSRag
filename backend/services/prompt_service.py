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
    history: list[dict] = None
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

    return f"""
You are an intelligent AI assistant for a Learning Management System (LMS).

You have already been given the most relevant document excerpts retrieved from the knowledge base.

Your task is to answer the user's question using these excerpts and the provided conversation history.

Instructions:

- Treat the provided context as the primary source of truth.
- Be highly concise and directly answer the user's question without unnecessary filler.
- Keep answers as short as possible while still being fully informative.
- Avoid lengthy explanations unless explicitly requested by the user.
- Summarize and combine information from multiple documents when appropriate.
- Answer naturally in clear English.
- Use bullet points whenever they improve readability and conciseness.
- Mention document names only when strictly useful.
- If some small detail is missing, infer it only when it is directly supported by the provided context or chat history.
- Do NOT mention that you are using context.
- Do NOT say "According to the context..."
- Only respond with "I could not find that information in the uploaded documents." when the retrieved documents and history are completely unrelated to the user's question.
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