import { useState } from 'react';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Tentative de login avec :', form);

      const res = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          email: form.email.toLowerCase(), // normalise ici aussi
        }),
      });

      const data = await res.json();
      console.log('Réponse backend :', data);

      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('Token sauvegardé :', data.token);
      alert('Connexion réussie 🍱');

      window.location.href = '/central-kitchen';
    } catch (err) {
      console.error('Erreur login :', err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffd29d] flex flex-col items-center justify-center font-zenloop px-4">
      <h1 className="text-4xl text-[#891c1c] mb-6">Log In</h1>
      <form onSubmit={handleLogin} className="flex flex-col w-full max-w-sm">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="mb-4 px-6 py-2 rounded-full bg-white text-[#5a3a00] placeholder:text-[#5a3a00] text-center outline-none w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="mb-4 px-6 py-2 rounded-full bg-white text-[#5a3a00] placeholder:text-[#5a3a00] text-center outline-none w-full"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-[#f85e00] text-white rounded-full hover:bg-[#d24a00] transition"
        >
          Log In
        </button>
      </form>
      {error && <p className="mt-4 text-red-700">{error}</p>}
    </div>
  );
}

export default Login;
