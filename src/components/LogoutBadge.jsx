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
      {/* Cercle rouge foncé (collé au coin) */}
      <div className="fixed top-[40px] right-[-100px] w-[200px] h-[200px] rounded-full bg-[#A41623] z-10 overflow-hidden" />

      {/* Bouton Log out : étiré et poussé vers la droite pour passer sous le cercle */}
      <button
        onClick={handleLogout}
        className="fixed top-[120px] right-[-40px] bg-[#f85e00] hover:bg-[#d24a00] text-white font-medium py-1.5 pl-6 pr-24 rounded-full shadow-md transition z-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f85e00] "
        aria-label="Log out"
      >
        Log out
      </button>
    </>
  );
}
