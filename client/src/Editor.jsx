import ReactQuill from "react-quill";
import { useRef, useEffect } from "react";

export default function Editor({ value, onChange }) {
  const quillRef = useRef(null);

  const modules = {
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

  return (
    <div>
      <ReactQuill
        ref={quillRef} // Attach the ref properly
        value={value}
        theme="snow"
        onChange={onChange}
        className="bg-[#1E2425] text-white border-2 border-white rounded-md min-h-[300px]"
        modules={modules}
      />
    </div>
  );
}
