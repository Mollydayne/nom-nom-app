import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function App() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log('Réponse API :', data);
    if (res.ok) {
      alert('Inscription réussie !');
      window.location.href = '/login'; // redirection
    } else {
      alert('Erreur : ' + data.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center font-zenloop px-4">
      <h1 className="text-5xl sm:text-6xl md:text-7xl text-[#891c1c] mb-8 leading-none">Create your account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] placeholder:text-[#5a3a00] outline-none w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] placeholder:text-[#5a3a00] outline-none w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="mb-6 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] placeholder:text-[#5a3a00] outline-none w-full"
        />


       <button
  type="submit"
  className="relative w-40 sm:w-48 md:w-56 px-6 py-2 bg-[#f85e00] text-white font-medium rounded-full hover:bg-[#d24a00] transition text-center"
>
  Sign Up
  <span className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#918450]"></span>
        </button>


      </form>

     <p className="mt-6 text-[#5a3a00] text-lg">
  Already have an account ?
  <Link to="/login" className="hover:text-[#891c1c] transition ml-1">
    Log in
  </Link>
</p>

    </div>
  );
}

export default App;