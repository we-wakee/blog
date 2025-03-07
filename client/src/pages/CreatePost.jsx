import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom'; // Import Navigate

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function createPost(ev) {
    const data = new FormData();
    data.append('title', title);
    data.append('summary', summary);
    data.append('content', content);
    if (files.length > 0) {
      data.append('file', files[0]);
    }
    ev.preventDefault();
    
    const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/post`, {
      method: 'POST', // Fixed method string
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1E2425]">
      <div className="bg-[#343BC] p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-white mb-4">Create a New Post</h1>
        <form className="space-y-4" onSubmit={createPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            className="w-full px-4 py-2 border-2 border-white bg-[#1E2425] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="text"
            placeholder="Summary"
            value={summary}
            onChange={(ev) => setSummary(ev.target.value)}
            className="w-full px-4 py-2 border-2 border-white bg-[#1E2425] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          />

          <input
            type="file"
            onChange={(ev) => setFiles(ev.target.files)}
            className="w-full px-4 py-2 border-2 border-white bg-[#1E2425] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          />

          <ReactQuill
            value={content}
            onChange={setContent}
            className="bg-[#1E2425] text-white border-2 rounded-md min-h-[300px]"
          />

          <button
            type="submit"
            className="w-full bg-[#FF4F61] hover:bg-[#ff4d5e96] text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
}
