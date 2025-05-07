import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CentralKitchen() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#ffd29d] relative font-zenloop px-4 flex flex-col items-center justify-center text-[#891c1c]">
      {/* Bouton Log out en haut à droite */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-[#f85e00] hover:bg-[#d24a00] text-white font-medium py-1.5 px-4 rounded-full shadow-md transition"
      >
        Log out
      </button>

      <h1 className="text-6xl mb-10 tracking-tight">Central<br />Kitchen</h1>

      <h2 className="text-xl italic mb-6 text-[#5a3a00]">
  Hello, <span className="font-bold text-[#891c1c]">{user?.username}</span> — ready to cook?
</h2>


      {/* Placeholder pour ton interface */}
      <div className="grid grid-cols-2 gap-6">
        {/* Exemple : boutons ou composants plus tard */}
        <div className="flex flex-col items-center">
          <div className="bg-[#ffe4b3] py-1 px-4 rounded-full mb-1">Select name</div>
          <button className="bg-[#f85e00] text-white px-6 py-1.5 rounded-full hover:bg-[#d24a00] transition">
            View profile
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-[#ffe4b3] py-1 px-4 rounded-full mb-1">Parameters</div>
          <button className="bg-[#f85e00] text-white px-6 py-1.5 rounded-full hover:bg-[#d24a00] transition">
            Go !
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-[#ffe4b3] py-1 px-4 rounded-full mb-1">Box Inventory</div>
          <button className="bg-[#f85e00] text-white px-6 py-1.5 rounded-full hover:bg-[#d24a00] transition">
            See
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-[#ffe4b3] py-1 px-4 rounded-full mb-1">Add a client</div>
          <button className="bg-[#f85e00] text-white px-6 py-1.5 rounded-full hover:bg-[#d24a00] transition">
            Yeah
          </button>
        </div>
      </div>
    </div>
  );
}

export default CentralKitchen;
