import { useState, useEffect, useRef } from 'react';
import { ClampText, SwipeCarousel, useIsMobile } from './mobile';

const AUTO_SPEED = 45; // px/s, idle drift
const MAX_FLING_SPEED = 1400; // px/s, cap on how fast a flick can send it
const SETTLE_TIME = 0.35; // s, time constant for a fling to ease back to the drift

// Infinite logo strip. Position is owned by JS and applied as a transform, so
// the loop is a plain modulo over one copy's width and can never jump. Touch
// and mouse drags move it directly, flicks glide (with a speed cap) and then
// ease back into the idle drift. Vertical page scrolling stays native.
function LogoStrip({ logos }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const firstOfSet = useRef([]); // first logo element of each copy

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const drift = reduceMotion ? 0 : AUTO_SPEED;

    let setWidth = 0;
    let pos = 0; // px scrolled into the strip, kept in [0, setWidth)
    let velocity = drift; // px/s, positive moves content left
    let frame = null;
    let last = null;
    let drag = null;

    const clampSpeed = (v) => Math.max(-MAX_FLING_SPEED, Math.min(MAX_FLING_SPEED, v));
    const wrap = (p) => (setWidth ? ((p % setWidth) + setWidth) % setWidth : p);
    const render = () => {
      track.style.transform = `translate3d(${-pos}px, 0, 0)`;
    };

    const measure = () => {
      const [a, b] = firstOfSet.current;
      if (!a || !b) return;
      setWidth = b.offsetLeft - a.offsetLeft; // one copy, including its gaps
      pos = wrap(pos);
      render();
    };

    const tick = (t) => {
      const dt = last === null ? 0 : Math.min(t - last, 50) / 1000;
      last = t;
      if (!drag) {
        velocity += (drift - velocity) * (1 - Math.exp(-dt / SETTLE_TIME));
        pos = wrap(pos + velocity * dt);
        render();
      }
      frame = requestAnimationFrame(tick);
    };

    const onPointerDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      drag = { id: e.pointerId, startX: e.clientX, lastX: e.clientX, moved: false, samples: [] };
      velocity = 0; // grabbing it stops it
    };

    const onPointerMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.lastX;
      drag.lastX = e.clientX;
      if (!drag.moved) {
        if (Math.abs(e.clientX - drag.startX) < 6) return;
        drag.moved = true;
        viewport.classList.add('is-dragging');
        try { viewport.setPointerCapture(e.pointerId); } catch {}
      }
      pos = wrap(pos - dx);
      render();
      drag.samples.push({ x: e.clientX, t: e.timeStamp });
      while (drag.samples.length > 2 && e.timeStamp - drag.samples[0].t > 80) drag.samples.shift();
    };

    const onPointerUp = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const { moved, samples } = drag;
      drag = null;
      viewport.classList.remove('is-dragging');
      if (!moved) return; // a tap: let the link click through

      // Release velocity from the last ~80ms of movement; none if the finger
      // was held still before letting go or the browser took the gesture.
      const first = samples[0];
      const lastSample = samples[samples.length - 1];
      const held = !lastSample || e.timeStamp - lastSample.t > 80;
      const span = lastSample && first ? (lastSample.t - first.t) / 1000 : 0;
      velocity = e.type === 'pointercancel' || held || span <= 0
        ? 0
        : clampSpeed(-(lastSample.x - first.x) / span);

      // Swallow the click that ends a drag so it doesn't open a link. Drop the
      // guard on the next tick in case no click comes.
      const swallow = (ev) => ev.preventDefault();
      viewport.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(() => viewport.removeEventListener('click', swallow, { capture: true }), 0);
    };

    // Horizontal trackpad swipes scroll the strip; vertical wheel scrolls the page.
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      pos = wrap(pos + e.deltaX);
      velocity = 0;
      render();
    };

    // Keyboard focus: bring the focused logo into view. Ignore mouse/touch
    // focus, or the logo would slide out from under the pointer mid-click.
    const onFocusIn = (e) => {
      viewport.scrollLeft = 0; // the browser may scroll the clipped box itself
      const link = e.target.closest('a');
      if (!link || !link.matches(':focus-visible')) return;
      const r = link.getBoundingClientRect();
      const vr = viewport.getBoundingClientRect();
      if (r.left >= vr.left && r.right <= vr.right) return; // already fully visible
      pos = wrap(link.offsetLeft - 16);
      velocity = 0;
      render();
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(track);

    viewport.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    viewport.addEventListener('wheel', onWheel, { passive: false });
    viewport.addEventListener('focusin', onFocusIn);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      viewport.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('focusin', onFocusIn);
    };
  }, [logos.length]);

  const copies = [0, 1, 2];

  return (
    <div
      ref={viewportRef}
      className="logo-strip mb-2 overflow-hidden select-none"
      aria-label="Organizations I'm involved with"
    >
      <div ref={trackRef} className="relative flex w-max gap-4 md:gap-8 py-3 will-change-transform">
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
  const isMobile = useIsMobile();
  const [isSmallMedium, setIsSmallMedium] = useState(false);
  const [isMedium, setIsMedium] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
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

  // Touch/pen swipe: the cards follow the finger, then snap to the next or
  // previous card past 20% of the width or on a quick flick. Vertical swipes
  // stay native page scrolls (touch-action: pan-y).
  const lastCard = detailedInvolvement.length - 1;
  const carouselRef = useRef(null);
  const swipe = useRef(null);
  const justSwiped = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const onSwipeStart = (e) => {
    if (e.pointerType === 'mouse') return; // mouse uses the buttons, dots, or clicking a side card
    swipe.current = { id: e.pointerId, startX: e.clientX, startT: e.timeStamp, active: false };
  };

  const onSwipeMove = (e) => {
    const s = swipe.current;
    if (!s || e.pointerId !== s.id) return;
    let dx = e.clientX - s.startX;
    if (!s.active) {
      if (Math.abs(dx) < 8) return;
      s.active = true;
      setIsSwiping(true);
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    }
    // Rubber-band at the first and last card
    if ((currentCard === 0 && dx > 0) || (currentCard === lastCard && dx < 0)) dx *= 0.35;
    setDragX(dx);
  };

  const onSwipeEnd = (e) => {
    const s = swipe.current;
    if (!s || e.pointerId !== s.id) return;
    swipe.current = null;
    if (!s.active) return;

    const dx = e.clientX - s.startX;
    const speed = dx / Math.max(1, e.timeStamp - s.startT); // px/ms
    const threshold = (carouselRef.current?.offsetWidth || 300) * 0.2;
    if (e.type !== 'pointercancel') {
      if ((dx < -threshold || speed < -0.5) && currentCard < lastCard) setCurrentCard(currentCard + 1);
      else if ((dx > threshold || speed > 0.5) && currentCard > 0) setCurrentCard(currentCard - 1);
    }
    setIsSwiping(false);
    setDragX(0);
    justSwiped.current = true;
    setTimeout(() => { justSwiped.current = false; }, 0);
  };

  return (
    <section id="involvement" className="py-8 md:py-10 overflow-hidden">
      {/* Auto-scrolling logos */}
      <div className="px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8 md:mb-12">
          Involvement
        </h2>
      </div>

      <LogoStrip logos={logos} />

      {isMobile ? (
        <div className="mt-6 px-0">
          <SwipeCarousel label="Involvement" initialIndex={2}>
            {detailedInvolvement.map((item) => (
              <MobileInvolvementCard key={item.name} item={item} />
            ))}
          </SwipeCarousel>
        </div>
      ) : (
        <>
      {/* Manual carousel with detailed cards */}
      <div className="relative px-4 sm:px-6">
        <div
          ref={carouselRef}
          onPointerDown={onSwipeStart}
          onPointerMove={onSwipeMove}
          onPointerUp={onSwipeEnd}
          onPointerCancel={onSwipeEnd}
          className={`relative min-h-[500px] md:h-[600px] flex items-center justify-center py-8 md:py-0 touch-pan-y ${isSwiping ? 'select-none' : ''}`}
        >
          {detailedInvolvement.map((item, index) => {
            const offset = index - currentCard;
            const isActive = index === currentCard;

            // Responsive transforms with better scaling for different screen sizes.
            // On mobile the neighbouring cards peek in at the edges to show it swipes.
            const translateX = isMobile ? offset * 100 : offset * 70;
            const scale = isActive
              ? (isMobile ? 1 : isSmallMedium ? 1.05 : isMedium ? 1.15 : 1.3)
              : (isMobile ? 0.9 : isSmallMedium ? 0.82 : isMedium ? 0.87 : 0.9);
            const opacity = isActive ? 1 : Math.abs(offset) === 1 ? (isMobile ? 0.5 : 0.3) : (isMobile ? 0 : 0.3);
            const width = isMobile ? '82%' : isSmallMedium ? '70%' : isMedium ? '65%' : '60%';

            return (
              <div
                key={index}
                onClick={() => {
                  if (!isActive && !justSwiped.current) setCurrentCard(index);
                }}
                className={`absolute ${isSwiping ? '' : 'transition-all duration-500 ease-in-out'} ${isActive ? 'z-20' : 'z-10 cursor-pointer'}`}
                style={{
                  transform: `translateX(calc(${translateX}% + ${dragX}px)) scale(${scale})`,
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
        </>
      )}
    </section>
  );
}

// Phone layout: logo + title row, description clamped with "Read more".
function MobileInvolvementCard({ item }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border border-gray-700">
      <div className="flex items-center gap-3 mb-3 border-b border-gray-700/50 pb-3">
        <img
          src={item.logo}
          alt=""
          className="w-12 h-12 object-contain rounded-lg bg-gray-700/30 p-1 border border-gray-700 shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
          <p className="text-purple-400 font-medium text-sm leading-snug">{item.role}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.dates}</p>
        </div>
      </div>

      <ClampText lines={3} className="text-gray-300 text-base leading-relaxed">
        {item.description}
      </ClampText>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {item.highlights.map((highlight) => (
          <span key={highlight} className="bg-purple-600 px-2.5 py-0.5 rounded-full text-xs text-white">
            {highlight}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Involvement;