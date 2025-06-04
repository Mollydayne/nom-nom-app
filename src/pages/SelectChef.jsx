import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SelectChef() {
  const [chefs, setChefs] = useState([]);
  const [selectedChefId, setSelectedChefId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/users/chefs')
      .then(res => res.json())
      .then(data => setChefs(data))
      .catch(err => console.error('Erreur chargement traiteurs :', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const body = {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      chef_id: selectedChefId,
    };

    const res = await fetch('http://localhost:3001/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert('Ton traiteur a bien été enregistré 🍱');
      navigate('/client-dashboard');
    } else {
      const data = await res.json();
      alert(data.error || 'Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff7e6] px-4">
      <h1 className="text-2xl font-bold mb-4">Sélectionne ton traiteur</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-2 font-semibold">Traiteur :</label>
        <select
          required
          value={selectedChefId}
          onChange={e => setSelectedChefId(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        >
          <option value="">-- Choisis un traiteur --</option>
          {chefs.map(chef => (
            <option key={chef.id} value={chef.id}>
              {chef.firstname} {chef.lastname} ({chef.email})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-[#a41623] hover:bg-[#891c1c] text-white font-semibold py-2 px-4 rounded-full w-full transition-transform hover:scale-105"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}

