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

  useEffect(() => {
    fetchCourses();
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
    <div className="border rounded-xl p-4 space-y-4">
      <h2 className="text-lg font-bold">
        Upload PDFs
      </h2>

      <select
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
        className="border rounded p-2 w-full"
      >
        <option value="public">Public</option>

        <option value="course">Course</option>

        <option value="teacher">Teacher</option>

        <option value="admin">Admin</option>
      </select>

      {visibility === "course" && (
        <>
          <select
            value={courseId}
            onChange={handleCourseChange}
            className="border rounded p-2 w-full"
          >
            <option value="">
              Select Course
            </option>

            {courses.map((course) => (
              <option
                key={course.id}
                value={course.id}
              >
                {course.title}
              </option>
            ))}
          </select>

          <select
            value={moduleId}
            onChange={(e) =>
              setModuleId(e.target.value)
            }
            disabled={!courseId}
            className="border rounded p-2 w-full disabled:bg-gray-100"
          >
            <option value="">
              Select Module
            </option>

            {modules.map((module) => (
              <option
                key={module.id}
                value={module.id}
              >
                {module.title}
              </option>
            ))}
          </select>
        </>
      )}

      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={(e) =>
          setFiles(Array.from(e.target.files || []))
        }
      />

      {files.map((file, index) => (
        <p key={index}>
          📄 {file.name}
        </p>
      ))}

      <button
        onClick={uploadPDFs}
        disabled={uploading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading
          ? "Uploading..."
          : "Upload PDFs"}
      </button>
    </div>
  );
}