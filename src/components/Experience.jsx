function Experience() {
  const experiences = [
    {
      company: "Milwaukee Tool",
      role: "Firmware Engineer",
      location: "Milwaukee, WI",
      dates: "May 2025 - August 2025",
      logo: "/experience/met.webp",
      description: [
        "Investigated wireless system latency and reliability to inform a replacement architecture",
        "Developed a drop-in RF solution integrated with proprietary code to improve responsiveness",
        "Validated the redesign with testing, achieving 27 times faster performance and higher reliability",
        "Rewrote an LED control API to enable configurable brightness and behavior profiles"
      ]
    },
    {
      company: "Rogers Imaging Corporation",
      role: "Software Engineer",
      location: "Natick, MA",
      dates: "May 2024 - August 2024",
      logo: "/experience/ric.webp",
      description: [
        "Refactored a predictive risk-analysis tool from R to Python, improving performance by ~30 times",
        "Added interactive 3D visualizations and enhanced analytics to better identify high-risk proteins linked to genetic disorders"
      ]
    }
  ];

  return (
    <section id="experience" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          Experience
        </h2>

        <div className="space-y-8">
          {experiences.map((experience, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
                {/* Left - Logo (desktop only) */}
                <div className="hidden md:flex flex-col items-center justify-center">
                  <img 
                    src={experience.logo}
                    alt={experience.company}
                    className="w-48 h-48 object-contain rounded-lg"
                  />
                </div>

                {/* Right - Content */}
                <div className="md:col-span-2">
                  {/* Mobile Header (Visible on Mobile Only) */}
                  <div className="flex items-center gap-4 mb-4 md:hidden border-b border-gray-700/50 pb-3">
                    <img 
                      src={experience.logo}
                      alt={experience.company}
                      className="w-14 h-14 object-contain rounded-lg bg-gray-700/30 p-1 border border-gray-700"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {experience.role}
                      </h3>
                      <p className="text-purple-400 font-medium mt-0.5">
                        {experience.company}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Header (Hidden on Mobile) */}
                  <div className="hidden md:block mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {experience.role}
                    </h3>
                    <p className="text-lg md:text-xl text-purple-400 mb-1">
                      {experience.company}
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    {experience.location} • {experience.dates}
                  </p>

                  <ul className="text-gray-300 text-base md:text-lg leading-relaxed space-y-3 list-disc list-outside pl-6 md:pl-8 marker:text-purple-400">
                    {experience.description.map((point, idx) => (
                      <li key={idx} className="pl-2">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;

