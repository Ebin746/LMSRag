"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UploadedDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/upload/documents/${documentToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete document");

      setDocuments(documents.filter((doc) => doc.document_id !== documentToDelete));
      toast.success("Document deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete document.");
    } finally {
      setIsDeleting(false);
      setDocumentToDelete(null);
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
    <div className="bg-white border-0 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden ring-1 ring-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Knowledge Base Repository</h2>
            <p className="text-sm text-gray-500 font-medium">
              <span className="text-emerald-600 font-bold">{documents.length}</span> document{documents.length !== 1 ? "s" : ""} indexed and embedded
            </p>
          </div>
        </div>
        <button
          onClick={fetchDocuments}
          className="text-sm text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm"
          title="Refresh"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* Document Grid */}
      <div className="p-6 bg-slate-50/50 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden group"
            >
              {/* Top accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              {/* Card Top Row */}
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border
                  ${doc.visibility === "public" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    doc.visibility === "admin" ? "bg-rose-50 text-rose-700 border-rose-200" :
                    doc.visibility === "course" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                    "bg-gray-100 text-gray-600 border-gray-200"}`}>
                  {doc.visibility}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-blue-700 font-bold font-mono bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md shadow-sm">
                    {doc.chunks} CHUNKS
                  </span>
                  <button
                    onClick={() => setDocumentToDelete(doc.document_id)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors border border-transparent hover:border-red-600 shadow-sm"
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
      {/* Delete Confirmation Modal */}
      {documentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Document</h3>
                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                    Are you sure you want to delete this document and all its vector chunks? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDocumentToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : "Delete Document"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
