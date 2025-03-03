import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  // useEffect(() => {
  //   fetch("http://localhost:4000/profile", {
  //     credentials: "include",
  //   })
  //     .then((response) => response.json())
  //     .then((userInfo) => setUserInfo(userInfo))
  //     .catch((error) => console.error("Error fetching user profile:", error));
  // }, []);

  function logout() {
    fetch("http://localhost:5000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header className="px-6 py-4 bg-gray-900 shadow-md flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-white hover:text-orange-400 transition duration-200">
        MyBlog
      </Link>

      <nav className="flex gap-6 text-gray-300">
        {username ? (
          <>
            <Link to="/create" className="hover:text-orange-400 transition duration-200">
              Create new post
            </Link>
            <a onClick={logout} className="cursor-pointer hover:text-red-400 transition duration-200">
              Logout ({username})
            </a>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-orange-400 transition duration-200">Login</Link>
            <Link to="/register" className="hover:text-orange-400 transition duration-200">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
