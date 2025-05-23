function ReturnToKitchen() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/central-kitchen')}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-[#fff7e6] text-[#5a3a00] rounded-full shadow-lg border border-[#ffd29d] hover:animate-wiggle hover:shadow-xl transition"
    >
      <img
        src="/centralKitchen.png"
        alt="Chef hat"
        className="w-8 h-8"
      />
      <span className="font-semibold text-sm">Central Kitchen</span>
    </button>
  );
}
export default ReturnToKitchen;
