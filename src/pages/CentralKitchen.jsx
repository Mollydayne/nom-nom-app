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

  return (
    <div className="min-h-screen bg-[#ffd29d] flex flex-col items-center justify-center font-zenloop px-4">
      <h1 className="text-4xl text-[#891c1c] mb-6">Central Kitchen 🍱</h1>
      <p className="text-[#5a3a00] text-xl">Welcome back, {user?.username}!</p>
    </div>
  );
}

export default CentralKitchen;
