"use client";

import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);

  const uploadPDF = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      "http://localhost:8000/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="border p-4 rounded-xl space-y-4">
      <h2 className="font-bold text-lg">
        Upload PDF
      </h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <button
        onClick={uploadPDF}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Upload
      </button>
    </div>
  );
}