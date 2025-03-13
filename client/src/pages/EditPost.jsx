import React, { useEffect, useState } from 'react'
import Editor from '../Editor.jsx'
import { useParams } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

export default function EditPost() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState([])
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/post/${id}`, {
      credentials: 'include',
    })
      .then((response) => {
        response.json().then((postInfo) => {
          setTitle(postInfo.title)
          setContent(postInfo.content)
          setSummary(postInfo.summary)
        })
      })
  }, [id])

  async function updatePost(ev) {
    ev.preventDefault()
    const data = new FormData()

    data.set('title', title)
    data.set('summary', summary)
    data.set('content', content)
    data.set('id', id)

    if (files && files.length > 0) {
      data.set('file', files[0])
    }

    const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/post`, {
      method: 'PUT',
      body: data,
      credentials: 'include',
    })

    if (response.ok) {
      setRedirect(true)
    } else {
      const error = await response.text()
      console.error('Error updating post:', error)
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />
  }

  return (
    <div className="min-h-screen bg-[#1E2425] text-gray-200 flex justify-center py-8 px-4">
      <div className="w-full max-w-2xl bg-[#2A2F32] p-6 rounded-lg shadow-lg border border-[#FF4F61]">
        <form onSubmit={updatePost}>
          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            className="w-full p-4 mb-4 bg-[#1E2425] text-gray-200 border border-[#FF4F61] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4F61]"
          />
          
          {/* Summary */}
          <input
            type="text"
            placeholder="Summary"
            value={summary}
            onChange={(ev) => setSummary(ev.target.value)}
            className="w-full p-4 mb-4 bg-[#1E2425] text-gray-200 border border-[#FF4F61] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4F61]"
          />
          
          {/* File Upload */}
          <input
            type="file"
            onChange={(ev) => setFiles(ev.target.files)}
            className="w-full p-4 mb-4 bg-[#1E2425] text-gray-200 border border-[#FF4F61] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4F61]"
          />

          {/* Editor */}
          <Editor onChange={setContent} value={content} />

          {/* Update Button */}
          <button
            type="submit"
            className="w-full py-3 mt-5 bg-[#FF4F61] text-white font-semibold rounded-md shadow-md transition duration-200 hover:bg-[#D93A50]"
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
  )
}
