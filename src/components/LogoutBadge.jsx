import { useNavigate } from 'react-router-dom';

export default function LogoutBadge() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Cercle rouge */}
      <div className="fixed top-[-100px] right-[-100px] w-[200px] h-[200px] rounded-full bg-[#7b1123] z-10" />

      {/* Bouton Log out */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-[30px] bg-[#f85e00] hover:bg-[#d24a00] text-white font-medium py-1.5 px-4 rounded-full shadow-md transition z-20"
      >
        Log out
      </button>
    </>
  );
}
