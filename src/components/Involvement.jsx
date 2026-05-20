import { useState, useEffect } from 'react';

function Involvement() {
  const logos = [
    { name: "Rocket", image: "/involvement/rocket.webp", url: "https://www.needhamma.gov/" },
    { name: "Hearth", image: "/involvement/hearth.webp", url: "https://hearthpizzeria.com/" },
    { name: "Purdue", image: "/involvement/purdue.webp", url: "https://www.purdue.edu" },
    { name: "SNU", image: "/involvement/snu.webp", url: "https://www.sigmanu.org/" },
    { name: "ASC", image: "/involvement/asc.webp", url: "https://www.purdue.edu/asc/" },
    { name: "HKN", image: "/involvement/hkn.webp", url: "https://hkn.ieee.org/" },
    { name: "es@p", image: "/involvement/esap1.webp", url: "https://embedded-purdue.github.io/" },
    { name: "USAF", image: "/involvement/usaf.webp", url: "https://www.airforce.com/" }
  ];

  const detailedInvolvement = [
    {
      name: "Academic Success Center",
      role: "Supplemental Instruction Leader",
      logo: "/involvement/asc.webp",
      description: "Led twice-weekly group tutoring sessions and exam reviews for introductory electrical engineering courses, developing collaborative learning strategies and strong facilitation skills.",
      dates: "August 2024 - December 2025",
      highlights: ["Team Leader", "Communication Skills", "ECE 2k2", "ECE 270"]
    },
    {
      name: "Embedded Systems @ Purdue",
      role: "Co-Founder & President",
      logo: "/involvement/esap1.webp",
      description: "Built a student-led community of 100+ members who are interested embedded systems, organized workshops and speaker events, and led technical projects.",
      dates: "January 2025 - May 2026",
      image: "/involvement/esap2.webp",
      highlights: ["Leadership", "Technical Projects", "Professional Workshops"]
    },
    {
      name: "Purdue University",
      role: "Bachelor of Science in Computer Engineering",
      logo: "/involvement/purdue.webp",
      description: "At Purdue I've been able to explore my interests in computer engineering through coursework, research, and involvement in various student organizations.",
      dates: "August 2022 - May 2026",
      highlights: ["3.98 GPA", "Computer Systems", "Software Engineering", "Microelectronics + Semiconductors"]
    },
    {
      name: "United States Air Force",
      role: "Second Lieutenant",
      logo: "/involvement/usaf.webp",
      description: "After graduation, I will be commissioning as a Second Lieutenant in the United States Air Force through OTS. I will be serving as a Computer Systems Developmental Engineer (62EC).",
      dates: "January 2027",
      highlights: ["62EC"]
    }
  ];

  const [currentCard, setCurrentCard] = useState(2);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMedium, setIsSmallMedium] = useState(false);
  const [isMedium, setIsMedium] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallMedium(width >= 768 && width < 900);
      setIsMedium(width >= 900 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % detailedInvolvement.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + detailedInvolvement.length) % detailedInvolvement.length);
  };

  return (
    <section id="involvement" className="py-10 overflow-hidden">
      {/* Auto-scrolling logos */}
      <div className="px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          Involvement
        </h2>
      </div>

      <div className="relative mb-2">
        <div className="flex gap-4 md:gap-8 animate-scroll pl-4 md:pl-8">
          {duplicatedLogos.map((logo, index) => (
            <a
              key={index}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg flex items-center justify-center p-4 md:p-6 hover:scale-105 transition-transform cursor-pointer"
            >
              <img
                src={logo.image}
                alt={logo.name}
                loading="lazy"
                className="max-w-full max-h-full object-contain"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Manual carousel with detailed cards */}
      <div className="relative px-4 sm:px-6">
        <div className="relative min-h-[500px] md:h-[600px] flex items-center justify-center py-8 md:py-0">
          {detailedInvolvement.map((item, index) => {
            const offset = index - currentCard;
            const isActive = index === currentCard;

            // Responsive transforms with better scaling for different screen sizes
            const translateX = isMobile ? offset * 100 : offset * 70;
            const scale = isActive
              ? (isMobile ? 1 : isSmallMedium ? 1.05 : isMedium ? 1.15 : 1.3)
              : (isMobile ? 0.8 : isSmallMedium ? 0.82 : isMedium ? 0.87 : 0.9);
            const opacity = isActive ? 1 : (isMobile ? 0 : 0.3);
            const width = isMobile ? '90%' : isSmallMedium ? '70%' : isMedium ? '65%' : '60%';

            return (
              <div
                key={index}
                className={`absolute transition-all duration-500 ease-in-out ${isActive ? 'z-20' : 'z-10'
                  }`}
                style={{
                  transform: `translateX(${translateX}%) scale(${scale})`,
                  opacity: opacity,
                  width: width,
                  maxWidth: '800px'
                }}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-12 border border-gray-700 h-full">
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 ${item.image ? 'items-start' : 'items-center'}`}>
                    {/* Left - Image */}
                    <div className={`hidden md:flex ${item.image ? 'flex-col items-start justify-start -space-y-8 -mt-8' : 'flex-col items-center justify-center'}`}>
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="w-48 h-48 object-contain rounded-lg"
                      />
                      {item.image && (
                        <img
                          src={item.image}
                          alt={`${item.name} additional`}
                          className="w-48 h-auto object-contain rounded-lg"
                        />
                      )}
                    </div>

                    {/* Right - Content */}
                    <div className="md:col-span-2 text-gray-300 space-y-3 md:space-y-4">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                          {item.name}
                        </h3>
                        <p className="text-lg sm:text-xl text-purple-400 mb-1">
                          {item.role}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {item.dates}
                        </p>
                      </div>

                      <p className="text-base sm:text-lg leading-relaxed">
                        {item.description}
                      </p>

                      <div>
                        <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Highlights</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.highlights.map((highlight, idx) => (
                            <span
                              key={idx}
                              className="bg-purple-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={prevCard}
            className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {detailedInvolvement.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCard(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentCard ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextCard}
            className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Involvement;