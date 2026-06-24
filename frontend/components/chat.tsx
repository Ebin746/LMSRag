"use client";

import { useState } from "react";

export default function Chat() {
  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const askQuestion = async () => {
    const res = await fetch(
      "http://localhost:8000/chat",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      }
    );

    const data = await res.json();

    setAnswer(data.answer);
  };

  return (
    <div className="border p-4 rounded-xl space-y-4">
      <h2 className="font-bold text-lg">
        Chat
      </h2>

      <textarea
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }
        placeholder="Ask anything..."
        className="w-full border p-2 rounded"
      />

      <button
        onClick={askQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Ask
      </button>

      {answer && (
        <div className="bg-gray-100 p-3 rounded">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}