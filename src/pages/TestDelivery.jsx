import { useState } from 'react';
import BentoDecoration from '../components/BentoDecoration';
import TopRightCircle from '../components/TopRightCircle';
import { apiFetch } from '../api'; // Import de la fonction centralisée apiFetch

function TestDelivery() {
  const [form, setForm] = useState({
    client_id: '',
    sender_id: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0], // Date du jour au format YYYY-MM-DD
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Utilisation de apiFetch à la place de fetch
      const res = await apiFetch('/deliveries', {
        method: 'POST',
        body: form,
      });

      // Gestion de la réponse
      setMessage(`Livraison enregistrée ! ID : ${res.deliveryId}`);
    } catch (error) {
      setMessage('Erreur réseau ou serveur');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffb563] font-zenloop text-[#5a3a00] flex flex-col items-center justify-center px-6 text-center relative">
      <BentoDecoration />
      <TopRightCircle />

      <h1 className="text-4xl sm:text-5xl text-[#891c1c] mb-8">Test Livraison</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="number"
          name="client_id"
          placeholder="ID du client"
          value={form.client_id}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-[#ffe4b3] outline-none text-center"
        />
        <input
          type="number"
          name="sender_id"
          placeholder="ID du traiteur"
          value={form.sender_id}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-[#ffe4b3] outline-none text-center"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantité de gamelles"
          value={form.quantity}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-[#ffe4b3] outline-none text-center"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-[#ffe4b3] outline-none text-center"
        />

        <button
          type="submit"
          className="bg-[#f85e00] text-white py-2 px-6 rounded-full hover:bg-[#d24a00] transition"
        >
          Enregistrer la livraison
        </button>
      </form>

      {message && <p className="mt-6 text-lg">{message}</p>}
    </div>
  );
}

export default TestDelivery;
