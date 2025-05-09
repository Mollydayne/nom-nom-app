// client/src/components/Toast.jsx

import { useEffect } from 'react';

function Toast({ message, type = 'success', duration = 3000, onClose }) {
  // Lance le timer de fermeture automatique
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Appelle la fonction fournie pour masquer le toast
    }, duration);

    return () => clearTimeout(timer); // Nettoyage
  }, [duration, onClose]);

  // Choix de la couleur selon le type
  const bgColor = {
    success: 'bg-[#5a3a00]',
    error: 'bg-red-700',
    info: 'bg-blue-600',
  }[type] || 'bg-gray-800';

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in`}>
      {message}
    </div>
  );
}

export default Toast;
