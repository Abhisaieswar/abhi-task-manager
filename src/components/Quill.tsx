import { useMemo, useState } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

interface QuillTypes {
  value: string;
  onChange: any;
  error?: string;
  label?: string;
}

const QuillComponent = ({ value, onChange, error, label }: QuillTypes) => {
  let modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  let formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);

  return (
    <div className="text-editor">
      {label && <label className="block font-bold mb-2">{label}</label>}

      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={onChange}
        placeholder="Description"
      ></ReactQuill>
      {error && <p>{error}</p>}
    </div>
  );
};

export default QuillComponent;
