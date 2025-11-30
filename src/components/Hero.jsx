function Hero() {
  return (
    <section id="home" className="min-h-[85vh] flex items-center justify-center text-white pt-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <img 
          src="hero/tom.webp" 
          alt="Tom Concannon" 
          className="w-72 h-72 rounded-full mx-auto mb-8 object-cover border-4 border-blue-400 shadow-lg"
        />
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Hi, I'm Tom
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
        Embedded Software Engineer <span className="mx-2">|</span> Leader
        </p>
        <div className="flex gap-4 justify-center">
        <a 
            href="mailto:your.email@example.com" 
            className="border border-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Projects
          </a>
          <a 
            href="mailto:your.email@example.com" 
            className="border border-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;