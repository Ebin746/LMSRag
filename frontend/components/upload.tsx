"use client";

import { useState } from "react";

export default function Upload() {

  const [files, setFiles] = useState<File[]>([]);

  const [visibility, setVisibility] =
    useState("public");

  const [courseId, setCourseId] =
    useState("");

  const [moduleId, setModuleId] =
    useState("");

 

  const [uploading, setUploading] =
    useState(false);

  const uploadPDFs = async () => {

    if (files.length === 0) return;

    setUploading(true);

    const formData = new FormData();

    files.forEach((file) => {

      formData.append(
        "files",
        file
      );

    });

    formData.append(
      "visibility",
      visibility
    );

    if (courseId)
      formData.append(
        "course_id",
        courseId
      );

    if (moduleId)
      formData.append(
        "module_id",
        moduleId
      );

  
    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "/api/upload",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      alert(data.message);

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

      <select

        value={visibility}

        onChange={(e)=>

          setVisibility(e.target.value)

        }

        className="border rounded p-2 w-full"

      >

        <option value="public">

          Public

        </option>

        <option value="course">

          Course

        </option>

        <option value="teacher">

          Teacher

        </option>

        <option value="admin">

          Admin

        </option>

      </select>

      {visibility==="course" && (

        <>

          <input

            placeholder="Course ID"

            className="border rounded p-2 w-full"

            value={courseId}

            onChange={(e)=>

              setCourseId(e.target.value)

            }

          />

          <input

            placeholder="Module ID"

            className="border rounded p-2 w-full"

            value={moduleId}

            onChange={(e)=>

              setModuleId(e.target.value)

            }

          />

        

        </>

      )}

      <input

        type="file"

        multiple

        accept=".pdf"

        onChange={(e)=>

          setFiles(

            Array.from(

              e.target.files || []

            )

          )

        }

      />

      {files.map((file,index)=>(

        <p key={index}>

          📄 {file.name}

        </p>

      ))}

      <button

        onClick={uploadPDFs}

        disabled={uploading}

        className="bg-black text-white px-4 py-2 rounded"

      >

        {uploading

          ? "Uploading..."

          : "Upload PDFs"}

      </button>

    </div>

  );

}