import { useState, useEffect, useRef } from 'react';

const SCROLL_SPEED = 50; // px per second
const RESUME_DELAY = 1500; // ms after the user stops interacting

// Infinite, auto-advancing logo strip that the user can also scroll, swipe or
// drag. The logos are rendered three times and scrollLeft is kept inside the
// middle copy: whenever it leaves, it is shifted by exactly one copy's width,
// which looks identical, so the loop never visibly jumps in either direction.
function LogoStrip({ logos }) {
  const scrollerRef = useRef(null);
  const firstOfSet = useRef([]); // first logo element of each copy

  useEffect(() => {
    const el = scrollerRef.current;
    let setWidth = 0;
    let pos = 0; // float position; scrollLeft may round to whole pixels
    let paused = false;
    let resumeTimer = null;
    let frame = null;
    let last = null;
    let drag = null;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const measure = () => {
      const [a, b] = firstOfSet.current;
      if (!a || !b) return;
      const offsetInSet = setWidth ? pos - setWidth : 0;
      setWidth = b.offsetLeft - a.offsetLeft; // one copy, including its gaps
      pos = setWidth + offsetInSet;
      el.scrollLeft = pos;
    };

    // Keep the position inside the middle copy. Returns the shift applied.
    const wrap = () => {
      if (!setWidth) return 0;
      let shift = 0;
      if (el.scrollLeft < setWidth * 0.5) shift = setWidth;
      else if (el.scrollLeft >= setWidth * 1.5) shift = -setWidth;
      if (shift) {
        el.scrollLeft += shift;
        pos += shift;
        if (drag) drag.startScroll += shift;
      }
      return shift;
    };

    const pause = () => {
      paused = true;
      clearTimeout(resumeTimer);
    };
    const resumeLater = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, RESUME_DELAY);
    };

    const tick = (t) => {
      const dt = last === null ? 0 : Math.min(t - last, 50) / 1000;
      last = t;
      // Pick up any position change made by the user (wheel, swipe, drag).
      if (Math.abs(el.scrollLeft - pos) > 1) pos = el.scrollLeft;
      if (!paused && !reduceMotion && setWidth) {
        pos += SCROLL_SPEED * dt;
        el.scrollLeft = pos;
        wrap();
      }
      frame = requestAnimationFrame(tick);
    };

    // Mouse drag-to-scroll (touch and trackpads scroll natively).
    const onPointerDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { startX: e.clientX, startScroll: el.scrollLeft, moved: false };
      pause();
    };
    const onPointerMove = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      if (Math.abs(dx) > 5) drag.moved = true;
      if (drag.moved) {
        el.scrollLeft = drag.startScroll - dx;
        pos = el.scrollLeft;
        wrap();
      }
    };
    const onPointerUp = () => {
      if (!drag) return;
      const wasDrag = drag.moved;
      drag = null;
      // Swallow the click that ends a drag so it doesn't open a link.
      // The click fires right after pointerup, so drop the guard on the next
      // tick in case the drag ended outside the strip and no click comes.
      if (wasDrag) {
        const swallow = (e) => e.preventDefault();
        el.addEventListener('click', swallow, { capture: true, once: true });
        setTimeout(() => el.removeEventListener('click', swallow, { capture: true }), 0);
      }
      if (!el.matches(':hover')) resumeLater();
    };

    const onScroll = () => wrap();
    const onEnter = () => pause();
    const onLeave = () => { if (!drag) resumeLater(); };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resumeLater, { passive: true });
    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resumeTimer);
      ro.disconnect();
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resumeLater);
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [logos.length]);

  const copies = [0, 1, 2];

  return (
    <div
      ref={scrollerRef}
      className="logo-strip mb-2 overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing select-none"
      aria-label="Organizations I'm involved with"
    >
      <div className="flex w-max gap-4 md:gap-8 py-3">
        {copies.map((copy) =>
          logos.map((logo, i) => (
            <a
              key={`${copy}-${i}`}
              ref={i === 0 ? (node) => { firstOfSet.current[copy] = node; } : undefined}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              aria-hidden={copy !== 1 ? true : undefined}
              tabIndex={copy !== 1 ? -1 : undefined}
              className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg flex items-center justify-center p-4 md:p-6 hover:scale-105 transition-transform"
            >
              <img
                src={logo.image}
                alt={logo.name}
                draggable={false}
                className="max-w-full max-h-full object-contain pointer-events-none"
              />
            </a>
          ))
        )}
      </div>
    </div>
  );
}

function Involvement() {
  const logos = [
    { name: "Rocket", image: "/involvement/rocket.webp", url: "https://www.needhamma.gov/" },
    { name: "Hearth", image: "/involvement/hearth.webp", url: "https://hearthpizzeria.com/" },
    { name: "Purdue", image: "/involvement/purdue.webp", url: "https://www.purdue.edu" },
    { name: "SNU", image: "/involvement/snu.webp", url: "https://www.sigmanu.org/" },
    { name: "ASC", image: "/involvement/asc.webp", url: "https://www.purdue.edu/asc/" },
    { name: "HKN", image: "/involvement/hkn.webp", url: "https://hkn.ieee.org/" },
    { name: "es@p", image: "/involvement/esap1.webp", url: "https://embedded-purdue.github.io/" },
    { name: "USAF", image: "/involvement/usaf.webp", url: "https://www.airforce.com/" },
    { name: "Roma Tom", image: "/involvement/romatom.webp", url: "https://romatom.com/" }
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

      <LogoStrip logos={logos} />

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