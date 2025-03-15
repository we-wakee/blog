import ReactQuill from "react-quill";
import { useRef, useEffect } from "react";
import DOMPurify from "dompurify";

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

  useEffect(() => {
    if (quillRef.current) {
      console.log("Quill editor is ready");
    }
  }, []);

  const handleEditorChange = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
    onChange(sanitizedContent);
  };

  return (
    <div className="editor-container">
      <label htmlFor="editor" className="sr-only">Text Editor</label>
      <ReactQuill
        id="editor"
        ref={quillRef}
        value={value}
        theme="snow"
        onChange={handleEditorChange}
        placeholder="Write something amazing..."
        className="bg-[#2A2F32] text-white border border-[#FF4F61] rounded-md min-h-[300px] focus:outline-none"
        modules={modules}
      />
    </div>
  );
}
