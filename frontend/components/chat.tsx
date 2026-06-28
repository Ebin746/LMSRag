"use client";

import { useState } from "react";

type Source = {
  filename: string;
  page: number;
  chunk: number;
};

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8000/chat/",
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
      setSources(data.sources || []);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 space-y-4">

      <h2 className="font-bold text-lg">
        Chat
      </h2>

      <textarea
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }
        placeholder="Ask anything..."
        className="w-full border rounded p-2"
      />

      <button
        disabled={loading}
        onClick={askQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <div className="bg-gray-100 rounded p-4">

          <h3 className="font-semibold">
            Answer
          </h3>

          <p className="mt-2 whitespace-pre-wrap">
            {answer}
          </p>

          {sources.length > 0 && (
            <>
              <h3 className="font-semibold mt-4">
                Sources
              </h3>

              <ul className="mt-2 list-disc list-inside">

                {sources.map(
                  (source, index) => (
                    <li key={index}>
                      <strong>
                        {source.filename}
                      </strong>{" "}
                      (Page {source.page})
                    </li>
                  )
                )}

              </ul>
            </>
          )}

        </div>
      )}

    </div>
  );
}