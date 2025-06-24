import React from 'react';

function ReturnModal({ onReturnOnly, onReturnAndPay, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
        <h2 className="text-xl font-semibold text-[#891c1c] mb-4">Retour de gamelle</h2>
        <p className="text-[#5a3a00] mb-6">La gamelle est-elle revenue ? Et a-t-elle été payée ?</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onReturnAndPay}
            className="bg-[#f85e00] text-white px-6 py-2 rounded-full hover:bg-[#d24a00] transition"
          >
            Oui, revenue et payée
          </button>
          <button
            onClick={onReturnOnly}
            className="bg-[#ffd29d] text-[#5a3a00] px-6 py-2 rounded-full hover:bg-[#ffcc85] transition"
          >
            Oui, revenue (pas encore payée)
          </button>
          <button
            onClick={onClose}
            className="text-sm text-[#918450] underline mt-2"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReturnModal;
