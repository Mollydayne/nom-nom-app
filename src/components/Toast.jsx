import { useEffect } from 'react';

function Toast({ message, type = 'success', duration = 3000, onClose, position = 'bottom' }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-[#5a3a00]',
    error: 'bg-red-700',
    info: 'bg-blue-600',
  }[type] || 'bg-gray-800';

  const positionClasses =
    position === 'center'
      ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      : 'bottom-6 left-1/2 transform -translate-x-1/2';

  return (
    <div
      className={`fixed ${positionClasses} ${bgColor} text-white px-6 py-3 rounded-full shadow-lg z-50 text-center max-w-[90%] w-auto`}
    >
      {message}
    </div>
  );
}

export default Toast;
