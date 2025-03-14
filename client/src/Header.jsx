import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/profile`, {
      method: "GET",
      credentials: "include",  // Ensure cookies are sent
      // headers: token ? { Authorization: `Bearer ${token}` } : {},

    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }
        return response.json();
      })
      .then((userInfo) => setUserInfo(userInfo))
      .catch((error) => console.error("Error fetching user profile:", error.message));
  }, []);
  

  function logout() {
    fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/logout`, {
      credentials: "include",
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to logout');
        }
        setUserInfo(null); // Clear user info after logout
      })
      .catch((error) => console.error("Error logging out:", error.message));
  }
  

  const username = userInfo?.username;

  return (
    <header className="px-6 py-4 bg-[#212B2D] shadow-md flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-white hover:text-[#FF4F61] transition duration-200">
        Vivek Blog
      </Link>

      <nav className="flex gap-6 text-gray-300">
        {username ? (
          <>
            <Link to="/create" className="hover:text-[#FF4F61] transition duration-200">
              Create new post
            </Link>
            <a onClick={logout} className="cursor-pointer hover:text-red-400 transition duration-200">
              Logout ({username})
            </a>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-[#FF4F61] transition duration-200">Login</Link>
            <Link to="/register" className="hover:text-[#FF4F61] transition duration-200">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
