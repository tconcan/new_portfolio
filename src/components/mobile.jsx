import { Children, useEffect, useLayoutEffect, useRef, useState } from "react";

const MOBILE_QUERY = "(max-width: 767px)"; // below Tailwind's `md`

// True on phone-sized screens; updates on resize/rotation.
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

function Chevron({ open }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const toggleClass =
  "mt-2 inline-flex items-center gap-1 text-sm font-semibold text-purple-400 hover:text-purple-300";

// Paragraph clamped to a few lines with a "Read more" toggle. The toggle only
// appears when the text actually overflows.
export function ClampText({ children, lines = 3, className = "" }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const clampClass = { 2: "line-clamp-2", 3: "line-clamp-3", 4: "line-clamp-4" }[lines];

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || open) return;
    const check = () => setOverflows(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, children]);

  return (
    <div>
      <p ref={ref} className={`${className} ${open ? "" : clampClass}`}>{children}</p>
      {(overflows || open) && (
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={toggleClass}>
          {open ? "Show less" : "Read more"}
          <Chevron open={open} />
        </button>
      )}
    </div>
  );
}

// Content hidden behind a dropdown toggle, animated open/closed.
export function Expandable({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden" inert={!open}>
          {children}
        </div>
      </div>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={toggleClass}>
        {open ? "Show less" : label}
        <Chevron open={open} />
      </button>
    </div>
  );
}

// Swipeable card carousel for phones. Cards follow the finger and snap to the
// next/previous one past 20% of the width or on a quick flick; the first and
// last cards rubber-band. Neighbours peek in at the edges, the height follows
// the current card, and tapping a peeking card moves to it.
export function SwipeCarousel({ children, initialIndex = 0, label }) {
  const cards = Children.toArray(children);
  const last = cards.length - 1;
  const [index, setIndex] = useState(Math.min(initialIndex, last));
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [height, setHeight] = useState(null);
  const viewportRef = useRef(null);
  const cardRefs = useRef([]);
  const swipe = useRef(null);
  const justSwiped = useRef(false);

  // Track the current card's height so the section shrinks/grows with it
  // (including when a "Read more" inside it opens).
  useLayoutEffect(() => {
    const el = cardRefs.current[index];
    if (!el) return;
    const update = () => setHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [index]);

  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swipe.current = { id: e.pointerId, startX: e.clientX, startT: e.timeStamp, active: false };
  };

  const onPointerMove = (e) => {
    const s = swipe.current;
    if (!s || e.pointerId !== s.id) return;
    let dx = e.clientX - s.startX;
    if (!s.active) {
      if (Math.abs(dx) < 8) return;
      s.active = true;
      setDragging(true);
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    }
    if ((index === 0 && dx > 0) || (index === last && dx < 0)) dx *= 0.35;
    setDragX(dx);
  };

  const onPointerEnd = (e) => {
    const s = swipe.current;
    if (!s || e.pointerId !== s.id) return;
    swipe.current = null;
    if (!s.active) return;
    const dx = e.clientX - s.startX;
    const speed = dx / Math.max(1, e.timeStamp - s.startT); // px/ms
    const threshold = (viewportRef.current?.offsetWidth || 300) * 0.2;
    if (e.type !== "pointercancel") {
      if ((dx < -threshold || speed < -0.5) && index < last) setIndex(index + 1);
      else if ((dx > threshold || speed > 0.5) && index > 0) setIndex(index - 1);
    }
    setDragging(false);
    setDragX(0);
    justSwiped.current = true;
    setTimeout(() => { justSwiped.current = false; }, 0);
  };

  // Card width 84% with a 2% gap; offset by 8% so the current card is centred.
  const CARD = 84;
  const STEP = CARD + 2;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        className={`overflow-hidden touch-pan-y transition-[height] duration-300 ease-out ${dragging ? "select-none" : ""}`}
        style={height ? { height } : undefined}
      >
        <div
          className={`flex items-start ${dragging ? "" : "transition-transform duration-300 ease-out"}`}
          style={{ transform: `translateX(calc(${(100 - CARD) / 2 - index * STEP}% + ${dragX}px))` }}
        >
          {cards.map((card, i) => {
            const active = i === index;
            return (
              <div
                key={i}
                ref={(node) => { cardRefs.current[i] = node; }}
                aria-hidden={active ? undefined : true}
                onClickCapture={(e) => {
                  if (active) return;
                  e.preventDefault();
                  e.stopPropagation();
                  if (!justSwiped.current) setIndex(i);
                }}
                className={`shrink-0 transition-[opacity,transform] duration-300 ${active ? "" : "opacity-40 scale-95 cursor-pointer"}`}
                style={{ width: `${CARD}%`, marginRight: "2%" }}
              >
                {/* Inert content: peeking cards can't be tabbed into, and taps
                    fall through to this wrapper, which selects the card. */}
                <div inert={!active}>{card}</div>
              </div>
            );
          })}
        </div>
      </div>

      {cards.length > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to card ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-purple-500" : "w-2.5 bg-gray-600"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
