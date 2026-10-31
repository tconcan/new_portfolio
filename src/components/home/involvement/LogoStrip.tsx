import { useEffect, useRef } from "react";
import type { OrganizationLogo } from "../../../data/involvement";

const DRIFT_SPEED = 45; // px/s, idle drift
const MAX_FLING_SPEED = 1400; // px/s, cap on how fast a flick can send it
const SETTLE_TIME = 0.35; // s, time constant for a fling to ease back to the drift
const DRAG_START = 6; // px before a press becomes a drag
const VELOCITY_WINDOW = 80; // ms of movement used to measure release speed
const COPIES = [0, 1, 2] as const;

/**
 * Infinite logo strip. Position is owned by JS and applied as a transform, so
 * the loop is a plain modulo over one copy's width and never visibly jumps.
 * Touch and mouse drags move it directly, flicks glide (capped) and then ease
 * back into the idle drift, horizontal trackpad swipes scroll it, and vertical
 * page scrolling stays native.
 */
export default function LogoStrip({ logos }: { logos: readonly OrganizationLogo[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstOfCopy = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const drift = reduceMotion ? 0 : DRIFT_SPEED;

    let copyWidth = 0;
    let pos = 0; // px into the strip, kept in [0, copyWidth)
    let velocity = drift; // px/s, positive moves content left
    let frame = 0;
    let lastTime: number | null = null;
    let drag: { id: number; startX: number; lastX: number; moved: boolean; samples: { x: number; t: number }[] } | null =
      null;

    const clampSpeed = (v: number) => Math.max(-MAX_FLING_SPEED, Math.min(MAX_FLING_SPEED, v));
    const wrap = (p: number) => (copyWidth ? ((p % copyWidth) + copyWidth) % copyWidth : p);
    const render = () => {
      track.style.transform = `translate3d(${-pos}px, 0, 0)`;
    };

    const measure = () => {
      const [a, b] = firstOfCopy.current;
      if (!a || !b) return;
      copyWidth = b.offsetLeft - a.offsetLeft; // one copy, including its gaps
      pos = wrap(pos);
      render();
    };

    const tick = (t: number) => {
      const dt = lastTime === null ? 0 : Math.min(t - lastTime, 50) / 1000;
      lastTime = t;
      if (!drag) {
        velocity += (drift - velocity) * (1 - Math.exp(-dt / SETTLE_TIME));
        pos = wrap(pos + velocity * dt);
        render();
      }
      frame = requestAnimationFrame(tick);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag = { id: e.pointerId, startX: e.clientX, lastX: e.clientX, moved: false, samples: [] };
      velocity = 0; // grabbing it stops it
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.lastX;
      drag.lastX = e.clientX;
      if (!drag.moved) {
        if (Math.abs(e.clientX - drag.startX) < DRAG_START) return;
        drag.moved = true;
        viewport.classList.add("is-dragging");
        try {
          viewport.setPointerCapture(e.pointerId);
        } catch {
          // Pointer already released
        }
      }
      pos = wrap(pos - dx);
      render();
      drag.samples.push({ x: e.clientX, t: e.timeStamp });
      while (drag.samples.length > 2 && e.timeStamp - drag.samples[0].t > VELOCITY_WINDOW) drag.samples.shift();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const { moved, samples } = drag;
      drag = null;
      viewport.classList.remove("is-dragging");
      if (!moved) return; // a tap: let the link click through

      // Release velocity from the last ~80ms of movement; none if the finger
      // was held still before letting go or the browser took the gesture.
      const first = samples[0];
      const last = samples[samples.length - 1];
      const held = !last || e.timeStamp - last.t > VELOCITY_WINDOW;
      const span = first && last ? (last.t - first.t) / 1000 : 0;
      velocity = e.type === "pointercancel" || held || span <= 0 ? 0 : clampSpeed(-(last.x - first.x) / span);

      // Swallow the click that ends a drag so it doesn't open a link; drop the
      // guard on the next tick in case no click comes.
      const swallow = (ev: Event) => ev.preventDefault();
      viewport.addEventListener("click", swallow, { capture: true, once: true });
      setTimeout(() => viewport.removeEventListener("click", swallow, { capture: true }), 0);
    };

    // Horizontal trackpad swipes scroll the strip; vertical wheel scrolls the page.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      pos = wrap(pos + e.deltaX);
      velocity = 0;
      render();
    };

    // Keyboard focus brings the focused logo into view. Mouse/touch focus is
    // ignored, or the logo would slide out from under the pointer mid-click.
    const onFocusIn = (e: FocusEvent) => {
      viewport.scrollLeft = 0; // the browser may scroll the clipped box itself
      const link = (e.target as Element).closest("a");
      if (!link || !link.matches(":focus-visible")) return;
      const r = link.getBoundingClientRect();
      const vr = viewport.getBoundingClientRect();
      if (r.left >= vr.left && r.right <= vr.right) return; // already fully visible
      pos = wrap(link.offsetLeft - 16);
      velocity = 0;
      render();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);

    viewport.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("focusin", onFocusIn);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      viewport.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("focusin", onFocusIn);
    };
  }, [logos.length]);

  return (
    <div ref={viewportRef} className="logo-strip mb-2 overflow-hidden select-none" aria-label="Organizations I'm involved with">
      <div ref={trackRef} className="relative flex w-max gap-4 md:gap-8 py-3 will-change-transform">
        {COPIES.map((copy) =>
          logos.map((logo, i) => (
            <a
              key={`${copy}-${logo.name}`}
              ref={
                i === 0
                  ? (node) => {
                      firstOfCopy.current[copy] = node;
                    }
                  : undefined
              }
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              // Only the middle copy is exposed to assistive tech and Tab.
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
