import { Expandable, SwipeCarousel, useIsMobile } from "./mobile";

function Experience() {
  const isMobile = useIsMobile();
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
    <section id="experience" className="py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8 md:mb-12">
          Professional Experience
        </h2>

        {isMobile ? (
          <SwipeCarousel label="Professional experience">
            {experiences.map((experience) => (
              <MobileExperienceCard key={experience.company} experience={experience} />
            ))}
          </SwipeCarousel>
        ) : (
          <div className="space-y-8">
            {experiences.map((experience) => (
              <div
                key={experience.company}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700"
              >
                <div className="grid grid-cols-3 gap-8 items-center">
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={experience.logo}
                      alt={experience.company}
                      className="w-48 h-48 object-contain rounded-lg"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="mb-4">
                      <h3 className="text-3xl font-bold text-white mb-1">
                        {experience.role}
                      </h3>
                      <p className="text-xl text-purple-400 mb-1">
                        {experience.company}
                      </p>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                      {experience.location} • {experience.dates}
                    </p>

                    <ul className="text-gray-300 text-lg leading-relaxed space-y-3 list-disc list-outside pl-8 marker:text-purple-400">
                      {experience.description.map((point, idx) => (
                        <li key={idx} className="pl-2">{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Phone layout: compact header, first two bullets, the rest behind a dropdown.
const VISIBLE_BULLETS = 2;

function MobileExperienceCard({ experience }) {
  const shown = experience.description.slice(0, VISIBLE_BULLETS);
  const more = experience.description.slice(VISIBLE_BULLETS);
  const bulletList = "text-gray-300 text-base leading-relaxed space-y-2 list-disc list-outside pl-5 marker:text-purple-400";

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border border-gray-700">
      <div className="flex items-center gap-3 mb-3 border-b border-gray-700/50 pb-3">
        <img
          src={experience.logo}
          alt={experience.company}
          className="w-12 h-12 object-contain rounded-lg bg-gray-700/30 p-1 border border-gray-700"
        />
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white leading-tight">{experience.role}</h3>
          <p className="text-purple-400 font-medium text-sm">{experience.company}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {experience.location} • {experience.dates}
          </p>
        </div>
      </div>

      <ul className={bulletList}>
        {shown.map((point, idx) => (
          <li key={idx} className="pl-1">{point}</li>
        ))}
      </ul>

      {more.length > 0 && (
        <Expandable label={`Show ${more.length} more`}>
          <ul className={`${bulletList} mt-2`}>
            {more.map((point, idx) => (
              <li key={idx} className="pl-1">{point}</li>
            ))}
          </ul>
        </Expandable>
      )}
    </div>
  );
}

export default Experience;
