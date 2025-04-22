function App() {
  return (
    <div class="min-h-screen bg-[#ffb563] flex flex-col items-center justify-center font-zenloop px-4">
      <h1 class="text-5xl sm:text-6xl md:text-7xl text-[#891c1c] mb-8 leading-none">Create your account</h1>

      <form onsubmit="event.preventDefault(); window.location.href='/dashboard.html';" class="flex flex-col items-center w-full max-w-sm">
        <input type="text" placeholder="Username"
          class="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] placeholder:text-[#5a3a00] outline-none w-full" />

        <input type="email" placeholder="Email"
          class="mb-4 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] placeholder:text-[#5a3a00] outline-none w-full" />

        <input type="password" placeholder="Password"
          class="mb-6 px-6 py-2 rounded-full bg-[#ffd29d] text-center text-[#5a3a00] placeholder:text-[#5a3a00] outline-none w-full" />

        <button type="submit"
          class="flex items-center justify-between gap-4 px-6 py-2 bg-[#f85e00] text-white font-medium rounded-full w-full hover:bg-[#d24a00] transition">
          Sign Up
          <span class="w-6 h-6 rounded-full bg-[#918450] inline-block"></span>
        </button>
      </form>

      <p class="mt-6 text-[#5a3a00] text-lg">
        Already have an account ?
        <a href="/index.html" class="hover:text-[#891c1c] transition">Log in</a>
      </p>

    </div>


  );
}
export default App;