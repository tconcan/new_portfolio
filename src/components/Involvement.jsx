function Involvement() {
  const logos = [
    { name: "Rocket", image: "/involvement/rocket.webp", url: "https://www.needhamma.gov/" },
    { name: "Hearth", image: "/involvement/hearth.webp", url: "https://hearthpizzeria.com/" },
    { name: "Purdue", image: "/involvement/purdue.webp", url: "https://www.purdue.edu" },
    { name: "SNU", image: "/involvement/snu.webp", url: "https://www.sigmanu.org/" },
    { name: "ASC", image: "/involvement/asc.webp", url: "https://www.purdue.edu/asc/" },
    { name: "HKN", image: "/involvement/hkn.webp", url: "https://hkn.ieee.org/" },
    { name: "es@p", image: "/involvement/esap.webp", url: "https://embedded-purdue.github.io/" },
    { name: "USAF", image: "/involvement/usaf.webp", url: "https://www.airforce.com/" }
  ];

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section id="involvement" className="py-20 overflow-hidden">
      <div className="px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          Involvement
        </h2>
      </div>

      <div className="relative">
        {/* Scrolling Container */}
        <div className="flex gap-8 animate-scroll pl-8">
          {duplicatedLogos.map((logo, index) => (
            <a
              key={index}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-48 h-48 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg flex items-center justify-center p-6 hover:scale-105 transition-transform cursor-pointer"
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
    </section>
  );
}

export default Involvement;