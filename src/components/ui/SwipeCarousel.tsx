import { Children, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useSwipe } from "../../hooks/useSwipe";

const CARD_WIDTH = 84; // % of the carousel width
const CARD_GAP = 2; // %
const STEP = CARD_WIDTH + CARD_GAP;

/**
 * Swipeable card carousel for phones. Neighbouring cards peek in at the edges,
 * the height follows the current card (including when a "Read more" inside it
 * opens), tapping a peeking card moves to it, and dots show the position.
 */
export function SwipeCarousel({
  children,
  initialIndex = 0,
  label,
}: {
  children: ReactNode;
  initialIndex?: number;
  label: string;
}) {
  const cards = Children.toArray(children);
  const [index, setIndex] = useState(Math.min(initialIndex, cards.length - 1));
  const [height, setHeight] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { containerRef, dragX, isSwiping, wasJustSwiped, handlers } = useSwipe<HTMLDivElement>({
    index,
    count: cards.length,
    onIndexChange: setIndex,
    allowMouse: true,
  });

  useLayoutEffect(() => {
    const card = cardRefs.current[index];
    if (!card) return;
    const update = () => setHeight(card.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(card);
    return () => observer.disconnect();
  }, [index]);

  // Offset so the current card is centred.
  const offset = (100 - CARD_WIDTH) / 2 - index * STEP;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={containerRef}
        {...handlers}
        className={`overflow-hidden touch-pan-y transition-[height] duration-300 ease-out ${isSwiping ? "select-none" : ""}`}
        style={height ? { height } : undefined}
      >
        <div
          className={`flex items-start ${isSwiping ? "" : "transition-transform duration-300 ease-out"}`}
          style={{ transform: `translateX(calc(${offset}% + ${dragX}px))` }}
        >
          {cards.map((card, i) => {
            const active = i === index;
            return (
              <div
                key={i}
                ref={(node) => {
                  cardRefs.current[i] = node;
                }}
                aria-hidden={active ? undefined : true}
                onClickCapture={(e) => {
                  if (active) return;
                  e.preventDefault();
                  e.stopPropagation();
                  if (!wasJustSwiped()) setIndex(i);
                }}
                className={`shrink-0 transition-[opacity,transform] duration-300 ${active ? "" : "opacity-40 scale-95 cursor-pointer"}`}
                style={{ width: `${CARD_WIDTH}%`, marginRight: `${CARD_GAP}%` }}
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
