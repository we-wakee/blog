import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { Link, Navigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.ok) {
      const userInfo = await response.json();
      setUserInfo(userInfo);
      setRedirect(true);
    } else {
      alert('Wrong credentials');
    }
  }

  if (redirect) {
    return <Navigate to='/' />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1E2425]">
      <div className="bg-[#212B2D] p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-white mb-4">Login</h1>
        <form onSubmit={login} className="space-y-4 bg-[#343BC] p-6 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            className="w-full px-4 py-2 border border-[#511D47] bg-[#444C4D] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4F61]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="w-full px-4 py-2 border border-[#511D47] bg-[#444C4D] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4F61]"
          />
          <button
            type="submit"
            className="w-full bg-[#FF4F61] hover:bg-[#FF4F61] text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-[#ff4d5e96] mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#FF4F61] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
