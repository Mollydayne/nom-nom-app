import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  return (
    <div className="min-h-screen bg-[#ffd29d] flex flex-col items-center justify-center font-zenloop px-4 text-[#5a3a00]">
      <h1 className="text-4xl text-[#891c1c] mb-6">User Profile</h1>
      <div className="bg-[#ffe4b3] rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User ID:</strong> {user?.id}</p>
      </div>
    </div>
  );
}

export default Profile;
