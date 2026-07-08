"use client";

import { useEffect, useState } from "react";

type Course = {
  id: string;
  title: string;
};

type Module = {
  id: string;
  title: string;
};

export default function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const [visibility, setVisibility] = useState("public");
  const [courseId, setCourseId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [uploading, setUploading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [uploadedMetadata, setUploadedMetadata] = useState<any[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchCourses();
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchModules = async (course: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/modules/${course}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setModules(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCourseChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCourseId(value);
    setModuleId("");
    if (value) {
      await fetchModules(value);
    } else {
      setModules([]);
    }
  };

  const uploadPDFs = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadSuccess(false);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("visibility", visibility);
    if (courseId) formData.append("course_id", courseId);
    if (moduleId) formData.append("module_id", moduleId);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (userRole === "admin" && data.documents) {
        setUploadedMetadata(data.documents);
      }

      setUploadSuccess(true);
      setFiles([]);
      setCourseId("");
      setModuleId("");
      setModules([]);

      // Dispatch event to refresh the global document list
      window.dispatchEvent(new Event("documentUploaded"));
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white border-0 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden flex flex-col h-full ring-1 ring-gray-100">
      {/* Premium Card Header */}
      <div className="px-6 py-6 bg-gradient-to-r from-blue-700 to-blue-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Upload Documents</h2>
            <p className="text-sm text-blue-100 font-medium">Add PDF materials to the AI knowledge base</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-5">

        {/* Success Message */}
        {uploadSuccess && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Documents uploaded and embedded successfully.
          </div>
        )}

        {/* Visibility Level */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
            Visibility Level
          </label>
          <div className="relative">
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm appearance-none"
            >
              <option value="public">Public — Visible to all users</option>
              <option value="course">Course Specific</option>
              <option value="admin">Admin Only</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Course / Module selectors */}
        {visibility === "course" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Course</label>
              <select
                value={courseId}
                onChange={handleCourseChange}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Module</label>
              <select
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                disabled={!courseId}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>{module.title}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* File Drop Zone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">PDF Files</label>
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 group shadow-sm hover:shadow-md">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-sm text-center px-4">
                <span className="font-bold text-blue-700">Click to browse</span>
                <span className="text-slate-500"> or drag & drop</span>
              </div>
              <span className="text-xs font-medium px-3 py-1 bg-white border border-gray-100 rounded-full text-gray-400">PDF files only (Max 50MB)</span>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={(e) => { setUploadSuccess(false); setFiles(Array.from(e.target.files || [])); }}
            />
          </label>
        </div>

        {/* Selected Files Preview */}
        {files.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-800">Selected Files</h4>
              <span className="text-xs font-medium bg-blue-600 text-white px-2 py-0.5 rounded-full">{files.length} file{files.length > 1 ? "s" : ""}</span>
            </div>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center gap-2.5 text-sm text-gray-700 bg-white border border-gray-100 px-3 py-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate font-medium">{file.name}</span>
                  <span className="ml-auto text-xs text-gray-400 flex-shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={uploadPDFs}
          disabled={uploading || files.length === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex justify-center items-center gap-2 text-sm mt-4"
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing & Embedding...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload to Knowledge Base
            </>
          )}
        </button>

        {/* Upload Metadata (Admin only) */}
        {userRole === "admin" && uploadedMetadata.length > 0 && (
          <div className="mt-4 pt-5 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Upload Results — ChromaDB Metadata
            </h3>
            <div className="space-y-3">
              {uploadedMetadata.map((doc, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3 pb-3 border-b border-gray-100">
                    <div><span className="text-gray-500">File:</span> <span className="font-medium text-gray-800">{doc.filename}</span></div>
                    <div><span className="text-gray-500">Visibility:</span> <span className="font-medium text-gray-800 capitalize">{doc.visibility}</span></div>
                    <div><span className="text-gray-500">Chunks:</span> <span className="font-semibold text-blue-600">{doc.chunks} stored</span></div>
                    <div className="col-span-2"><span className="text-gray-500">ID:</span> <span className="font-mono text-xs text-gray-600 break-all">{doc.document_id}</span></div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Vector Sample</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {doc.chroma_metadata && doc.chroma_metadata.slice(0, 3).map((meta: any, mIdx: number) => (
                        <div key={mIdx} className="bg-white border border-gray-100 rounded-lg p-2 text-xs">
                          <div className="text-gray-400">Chunk #{meta.chunk_index}</div>
                          <div className="font-medium text-gray-700">Page {meta.page}</div>
                        </div>
                      ))}
                    </div>
                    {doc.chroma_metadata && doc.chroma_metadata.length > 3 && (
                      <p className="text-xs text-gray-400 mt-2 text-center">+{doc.chroma_metadata.length - 3} more embeddings stored</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}