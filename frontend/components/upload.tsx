"use client";

import { useState } from "react";

export default function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadPDFs = async () => {
    if (files.length === 0) return;

    setUploading(true);

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch(
        "http://localhost:8000/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      alert(
        `${data.documents_uploaded} PDF(s) uploaded successfully.`
      );

      console.log(data);

      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 space-y-4">

      <h2 className="text-lg font-bold">
        Upload PDFs
      </h2>

      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={(e) =>
          setFiles(
            Array.from(e.target.files || [])
          )
        }
      />

      {files.length > 0 && (
        <div className="space-y-1">

          <p className="font-medium">
            Selected Files
          </p>

          {files.map((file, index) => (
            <p
              key={index}
              className="text-sm"
            >
              📄 {file.name}
            </p>
          ))}

        </div>
      )}

      <button
        disabled={uploading}
        onClick={uploadPDFs}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload PDFs"}
      </button>

    </div>
  );
}