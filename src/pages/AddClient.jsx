import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddClient() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    allergies: '',
    likes: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la création');

      alert('Client ajouté 🍱');
      navigate('/central-kitchen');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffd29d] flex flex-col items-center justify-center font-zenloop px-4 text-[#5a3a00]">
      <h1 className="text-4xl text-[#891c1c] mb-6">Add a Client</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm space-y-3">
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-full bg-white text-center outline-none"
        />
        <input
          name="email"
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-white text-center outline-none"
        />
        <input
          name="allergies"
          type="text"
          placeholder="Allergies"
          value={form.allergies}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-white text-center outline-none"
        />
        <input
          name="likes"
          type="text"
          placeholder="Likes"
          value={form.likes}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-white text-center outline-none"
        />

        <button
          type="submit"
          className="bg-[#f85e00] text-white py-2 rounded-full hover:bg-[#d24a00] transition">
          Add client
        </button>

        {error && <p className="text-red-700 mt-2">{error}</p>}
      </form>
    </div>
  );
}

export default AddClient;
