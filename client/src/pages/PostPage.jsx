import React, { useEffect, useState, useContext  } from "react";
import { useParams, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/post/${id}`)
      .then((response) => response.json())
      .then((postInfo) => setPostInfo(postInfo));
  }, []);

  if (!postInfo) return (
    <div className="min-h-screen bg-[#1E2425] text-gray-200 flex justify-center items-center">
      <p className="text-4xl font-semibold text-[#FF4F61] animate-pulse">Loading...</p>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-[#1E2425] text-gray-200 flex justify-center py-8 px-4">
      <div className="w-full max-w-2xl bg-[#2A2F32] p-6 rounded-lg shadow-lg border border-[#FF4F61]">

        {/* Title and Edit Button */}
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl font-bold text-[#FF4F61]">{postInfo.title}</h1>
          {userInfo?.id === postInfo.author?._id && (
            <Link
              to={`/edit/${postInfo._id}`}
              className="px-4 py-2 bg-[#FF4F61] hover:bg-[#D93A50] text-white font-medium rounded-md transition duration-200 shadow-md"
            >
              Edit Post
            </Link>
          )}
        </div>

        {/* Meta Info */}
        <div className="text-gray-400 text-sm flex justify-between border-b border-[#FF4F61] pb-3 mb-4">
          <span>{formatISO9075(new Date(postInfo.createdAt))}</span>
          <span>by <span className="text-[#FF4F61]">@{postInfo.author.username}</span></span>
        </div>

        {/* Cover Image */}
        {postInfo.cover && (
          <div className="w-full flex justify-center mb-4">
            <img
              src={`${import.meta.env.VITE_REACT_BACKEND_URL}/${postInfo.cover}`}
              alt="Post Cover"
              className="w-full max-h-[500px] object-contain rounded-lg shadow-lg border-2 border-[#FF4F61]"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="text-gray-300 text-base leading-6 space-y-3 max-h-[400px] overflow-y-auto pr-3"
          dangerouslySetInnerHTML={{ __html: postInfo.content }}
        />
      </div>
    </div>
  );
}
