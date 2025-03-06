import React, { useState } from 'react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function register(ev) {
    ev.preventDefault(); // Prevent default form submission

    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      alert('Registration successful');
    } else {
      alert('Registration failed');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1E2425]">
      <div className="bg-[#212B2D] p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-white mb-4">Register</h1>
        <form onSubmit={register} className="space-y-4 bg-[#343BC] p-6 rounded-lg shadow-md">
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
