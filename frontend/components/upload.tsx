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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setModules(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCourseChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
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

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("visibility", visibility);

    if (courseId) {
      formData.append("course_id", courseId);
    }

    if (moduleId) {
      formData.append("module_id", moduleId);
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      alert(data.message);

      console.log(data);

      if (userRole === "admin" && data.documents) {
        setUploadedMetadata(data.documents);
      }
      setFiles([]);
      setCourseId("");
      setModuleId("");
      setModules([]);
    } catch (err) {
      console.error(err);

      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 space-y-6 shadow-lg transition-all">
      <h2 className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        Upload Resources
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Visibility Level</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-900 dark:text-slate-100"
          >
            <option value="public">Public</option>
            <option value="course">Course Specific</option>
            <option value="teacher">Teacher Only</option>
            <option value="admin">Admin Only</option>
          </select>
        </div>

        {visibility === "course" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course</label>
              <select
                value={courseId}
                onChange={handleCourseChange}
                className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-900 dark:text-slate-100"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Module</label>
              <select
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                disabled={!courseId}
                className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-900 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>{module.title}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="pt-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select PDF Files</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-3 text-slate-500 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold text-purple-600 dark:text-purple-400">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">PDF documents only</p>
              </div>
              <input 
                type="file" 
                multiple 
                accept=".pdf" 
                className="hidden" 
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Files to upload ({files.length}):</h4>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                  <span className="truncate">{file.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={uploadPDFs}
          disabled={uploading || files.length === 0}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 mt-4"
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing & Embedding...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              Upload to Knowledge Base
            </>
          )}
        </button>

        {userRole === "admin" && uploadedMetadata.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Successful Uploads Metadata (ChromaDB)
            </h3>
            
            <div className="space-y-4">
              {uploadedMetadata.map((doc, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <div><span className="text-slate-500 dark:text-slate-400">Filename:</span> <span className="font-medium text-slate-800 dark:text-slate-200">{doc.filename}</span></div>
                    <div><span className="text-slate-500 dark:text-slate-400">Visibility:</span> <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{doc.visibility}</span></div>
                    <div className="col-span-2"><span className="text-slate-500 dark:text-slate-400">Document ID:</span> <span className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all">{doc.document_id}</span></div>
                    <div><span className="text-slate-500 dark:text-slate-400">Chunks:</span> <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-semibold">{doc.chunks} stored</span></div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Vector Store Records Sample</h4>
                    <div className="space-y-2">
                      {doc.chroma_metadata && doc.chroma_metadata.slice(0, 3).map((meta: any, mIdx: number) => (
                        <div key={mIdx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-3 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div><span className="text-slate-400 block">Chunk ID</span><span className="font-medium text-slate-700 dark:text-slate-300">#{meta.chunk_index}</span></div>
                          <div><span className="text-slate-400 block">Page</span><span className="font-medium text-slate-700 dark:text-slate-300">{meta.page}</span></div>
                          <div><span className="text-slate-400 block">Course</span><span className="font-medium text-slate-700 dark:text-slate-300">{meta.course_id || 'N/A'}</span></div>
                          <div><span className="text-slate-400 block">Module</span><span className="font-medium text-slate-700 dark:text-slate-300">{meta.module_id || 'N/A'}</span></div>
                        </div>
                      ))}
                      {doc.chroma_metadata && doc.chroma_metadata.length > 3 && (
                        <div className="text-center py-2 text-xs text-slate-500 dark:text-slate-400 italic">
                          ... and {doc.chroma_metadata.length - 3} more vector embeddings stored.
                        </div>
                      )}
                    </div>
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