import { useEffect, useState } from 'react';
import Post from '../Post';

export default function IndexPage() {
  const [posts, setPosts] = useState([]); // Initialize posts as an empty array
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/post`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched Posts:", data); // Debugging
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Invalid API response:", data);
        }
      })
      .catch(error => console.error("Error fetching posts:", error));
  }, []);
  
  return (
    <div className="bg-[#181818] min-h-screen p-6">
      <div className="container mx-auto">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => <Post {...post} key={post._id} />)}
          </div>
        ) : (
          <div className="bg-[#181818] text-white text-3xl text-center py-10">
            Loading posts...
          </div>
        )}
      </div>
    </div>
  );
}
