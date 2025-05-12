// src/pages/Unauthorized.jsx

import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ffb563] font-zenloop px-4 text-center">
<h1 className="text-5xl sm:text-6xl text-[#891c1c] mb-6 animate-bounce">Oops! 🧂</h1>
      <p className="text-xl text-[#5a3a00] max-w-md mb-8">
        Tu n'es pas sensé être ici.<br />
        Tu as peut-être poussé la mauvaise porte dans la cuisine ?
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-[#f85e00] text-white px-6 py-2 rounded-full shadow hover:bg-[#d94e00] transition"
      >
        Retour à l’accueil
      </button>
    </div>
  );
}
