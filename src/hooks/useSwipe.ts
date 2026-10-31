import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

interface SwipeOptions {
  index: number;
  count: number;
  onIndexChange: (index: number) => void;
  /** Mouse drags swipe too (phones only use touch, so this is off on desktop). */
  allowMouse?: boolean;
}

const START_DISTANCE = 8; // px before a press becomes a swipe
const SNAP_FRACTION = 0.2; // of the container width
const FLICK_SPEED = 0.5; // px/ms
const EDGE_RESISTANCE = 0.35; // rubber-band factor past the first/last card

/**
 * Horizontal swipe between cards. Cards follow the finger (`dragX`), then snap
 * to the next/previous card past 20% of the width or on a quick flick; the
 * first and last cards rubber-band. Vertical swipes stay native page scrolls
 * (put `touch-pan-y` on the container).
 */
export function useSwipe<T extends HTMLElement>({ index, count, onIndexChange, allowMouse = false }: SwipeOptions) {
  const containerRef = useRef<T>(null);
  const gesture = useRef<{ id: number; startX: number; startTime: number; active: boolean } | null>(null);
  const justSwiped = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const last = count - 1;

  const onPointerDown = (e: ReactPointerEvent<T>) => {
    if (e.pointerType === "mouse" && (!allowMouse || e.button !== 0)) return;
    gesture.current = { id: e.pointerId, startX: e.clientX, startTime: e.timeStamp, active: false };
  };

  const onPointerMove = (e: ReactPointerEvent<T>) => {
    const g = gesture.current;
    if (!g || e.pointerId !== g.id) return;
    let dx = e.clientX - g.startX;
    if (!g.active) {
      if (Math.abs(dx) < START_DISTANCE) return;
      g.active = true;
      setIsSwiping(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // The pointer may already be gone (e.g. the browser took the gesture).
      }
    }
    if ((index === 0 && dx > 0) || (index === last && dx < 0)) dx *= EDGE_RESISTANCE;
    setDragX(dx);
  };

  const onPointerEnd = (e: ReactPointerEvent<T>) => {
    const g = gesture.current;
    if (!g || e.pointerId !== g.id) return;
    gesture.current = null;
    if (!g.active) return;

    if (e.type !== "pointercancel") {
      const dx = e.clientX - g.startX;
      const speed = dx / Math.max(1, e.timeStamp - g.startTime);
      const threshold = (containerRef.current?.offsetWidth ?? 300) * SNAP_FRACTION;
      if ((dx < -threshold || speed < -FLICK_SPEED) && index < last) onIndexChange(index + 1);
      else if ((dx > threshold || speed > FLICK_SPEED) && index > 0) onIndexChange(index - 1);
    }
    setIsSwiping(false);
    setDragX(0);
    // The click that ends a swipe shouldn't also select a card.
    justSwiped.current = true;
    setTimeout(() => {
      justSwiped.current = false;
    }, 0);
  };

  return {
    containerRef,
    dragX,
    isSwiping,
    /** True for the click event that immediately follows a swipe. */
    wasJustSwiped: () => justSwiped.current,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
    },
  };
}
