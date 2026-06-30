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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    
    // Listen for custom event when new document is uploaded
    const handleDocumentUploaded = () => {
      fetchDocuments();
    };
    
    window.addEventListener("documentUploaded", handleDocumentUploaded);
    return () => {
      window.removeEventListener("documentUploaded", handleDocumentUploaded);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg flex justify-center items-center min-h-[200px]">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg transition-all w-full">
      <h2 className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
        Knowledge Base Repository
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {doc.visibility}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded font-mono">
                  {doc.chunks} chunks
                </div>
              </div>
              
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1 break-words line-clamp-2" title={doc.filename}>
                {doc.filename}
              </h3>
              
              <div className="space-y-1 mt-4 text-sm">
                {doc.course_id && (
                  <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300 w-16">Course:</span> 
                    <span className="truncate">{doc.course_id}</span>
                  </p>
                )}
                {doc.module_id && (
                  <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300 w-16">Module:</span> 
                    <span className="truncate">{doc.module_id}</span>
                  </p>
                )}
                <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/50 mt-2">
                  <span className="font-medium text-slate-700 dark:text-slate-300 w-16">Doc ID:</span> 
                  <span className="font-mono text-xs truncate" title={doc.document_id}>{doc.document_id.substring(0, 12)}...</span>
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">ChromaDB Chunk Samples</p>
              <div className="flex gap-2">
                {doc.chroma_metadata && doc.chroma_metadata.slice(0, 3).map((meta: any, mIdx: number) => (
                  <div key={mIdx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-600 dark:text-slate-400 flex-1 text-center" title={`Page: ${meta.page}`}>
                    Pg {meta.page}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
