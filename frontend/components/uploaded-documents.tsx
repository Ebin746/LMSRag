"use client";

import { useEffect, useState } from "react";

export default function UploadedDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/upload/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch documents");

      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!window.confirm("Are you sure you want to delete this document and all its vector chunks?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/upload/documents/${documentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete document");

      setDocuments(documents.filter((doc) => doc.document_id !== documentId));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete document.");
    }
  };

  useEffect(() => {
    fetchDocuments();

    const handleDocumentUploaded = () => fetchDocuments();
    window.addEventListener("documentUploaded", handleDocumentUploaded);
    return () => window.removeEventListener("documentUploaded", handleDocumentUploaded);
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex justify-center items-center min-h-[180px]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm">Loading documents...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-600 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    );
  }

  if (documents.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Knowledge Base Repository</h2>
            <p className="text-sm text-gray-500">{documents.length} document{documents.length !== 1 ? "s" : ""} indexed</p>
          </div>
        </div>
        <button
          onClick={fetchDocuments}
          className="text-sm text-gray-500 hover:text-blue-600 font-medium flex items-center gap-1.5 transition-colors"
          title="Refresh"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Document Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col"
            >
              {/* Card Top Row */}
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider
                  ${doc.visibility === "public" ? "bg-green-100 text-green-700" :
                    doc.visibility === "admin" ? "bg-red-100 text-red-700" :
                    doc.visibility === "course" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-600"}`}>
                  {doc.visibility}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                    {doc.chunks} chunks
                  </span>
                  <button
                    onClick={() => deleteDocument(doc.document_id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete document"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Filename */}
              <div className="flex items-start gap-2 mb-3 flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2" title={doc.filename}>
                  {doc.filename}
                </h3>
              </div>

              {/* Meta Info */}
              <div className="space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3 mt-auto">
                {doc.course_id && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-700 w-14 flex-shrink-0">Course:</span>
                    <span className="truncate">{doc.course_title || doc.course_id}</span>
                  </div>
                )}
                {doc.module_id && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-700 w-14 flex-shrink-0">Module:</span>
                    <span className="truncate">{doc.module_title || doc.module_id}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-700 w-14 flex-shrink-0">Doc ID:</span>
                  <span className="font-mono truncate" title={doc.document_id}>{doc.document_id.substring(0, 14)}...</span>
                </div>
              </div>

              {/* Chunk Samples */}
              {doc.chroma_metadata && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Page samples</p>
                  <div className="flex gap-1.5">
                    {doc.chroma_metadata.slice(0, 3).map((meta: any, mIdx: number) => (
                      <div key={mIdx} className="flex-1 bg-gray-50 border border-gray-100 rounded-lg py-1 text-center text-xs text-gray-500 font-medium">
                        Pg {meta.page}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
