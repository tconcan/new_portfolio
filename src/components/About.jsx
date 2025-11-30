function About() {
  return (
    <section id="about" className="min-h-[80vh] flex items-center justify-center py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          About Me
        </h2>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left column - Image */}
            <div className="flex justify-center">
              <img 
                src="about/portrait.webp" 
                alt="Tom Concannon" 
                className="rounded-xl shadow-2xl max-w-md w-full object-cover border-4 border-blue-400"
              />
            </div>

            {/* Right column - Content */}
            <div className="text-gray-300 space-y-6">             
              <p className="text-lg leading-relaxed">
                Through my coursework and projects, I've developed a strong foundation in embedded systems, 
                working with everything from IoT devices to real-time operating systems. I'm eager to apply 
                my knowledge and continue learning in a professional setting.
              </p>
              <p className="text-lg leading-relaxed">
                I'm a leader. I enjoy taking initiative, and motivating diverse teams 
                towards success. My history of leading projects and mentoring peers
                has honed my ability to inspire and guide others effectively. 
              </p>
              <div className="pt-4 flex gap-4 justify-center">
                <a 
                  href="#experience" 
                  className="border border-white hover:bg-white hover:text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Experience
                </a>
                <a 
                  href="#involvement" 
                  className="border border-white hover:bg-white hover:text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Involvement
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;