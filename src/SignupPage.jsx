import { useNavigate, Link } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center font-zenloop px-4">
      <h1 className="text-5xl sm:text-6xl md:text-7xl text-[#891c1c] mb-8 leading-none">Create your account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
        <input type="text" placeholder="Username" className="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] w-full outline-none" />
        <input type="email" placeholder="Email" className="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] w-full outline-none" />
        <input type="password" placeholder="Password" className="mb-6 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] w-full outline-none" />
        <button type="submit" className="flex items-center justify-between gap-4 px-6 py-2 bg-[#f85e00] text-white font-medium rounded-full w-full hover:bg-[#d24a00] transition">
          Sign Up
          <span className="w-6 h-6 rounded-full bg-[#918450] inline-block"></span>
        </button>
      </form>

      <p className="mt-6 text-[#5a3a00] text-lg">
        Already have an account?
        <Link to="/" className="hover:text-[#891c1c] transition ml-1">Log in</Link>
      </p>
    </div>
  );
}

export default SignupPage;
