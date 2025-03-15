import { Link } from 'react-router-dom';
import { formatISO9075 } from 'date-fns';

export default function Post({ _id, cover, title, author, createdAt, summary, username, content }) {
  
  return (
    <div className="bg-[#212B2D] p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="image mb-6">
        <Link to={`/post/${_id}`}>
          <img
            src={`${import.meta.env.VITE_REACT_BACKEND_URL}/${cover}`}
            alt="Post Cover"
            className="w-full h-64 object-cover rounded-lg transition-transform duration-500 hover:scale-105"
          />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2 className="text-3xl font-bold text-[#FF4F61] hover:underline transition-colors duration-300">{title}</h2>
        </Link>
        <p className="info text-[#ff4d5e96] text-sm mt-3">
          <span className="author font-semibold">{author?.username}</span> ·
          <time className="ml-1 text-gray-400">{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary text-[#CCCCCC] mt-4 text-lg leading-relaxed">{summary}</p>

        <div className="content mt-6 text-[#CCCCCC] text-lg leading-relaxed" 
             dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
