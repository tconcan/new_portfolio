import { useState } from "react";
import type { Involvement } from "../../../data/involvement";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useSwipe } from "../../../hooks/useSwipe";
import { ChevronLeftIcon, ChevronRightIcon } from "../../ui/icons";
import { CARD } from "../../ui/styles";

/** Size of the active and side cards for each desktop width range. */
function useCardLayout() {
  const isSmallMedium = useMediaQuery("(min-width: 768px) and (max-width: 899px)");
  const isMedium = useMediaQuery("(min-width: 900px) and (max-width: 1023px)");
  if (isSmallMedium) return { width: "70%", activeScale: 1.05, sideScale: 0.82 };
  if (isMedium) return { width: "65%", activeScale: 1.15, sideScale: 0.87 };
  return { width: "60%", activeScale: 1.3, sideScale: 0.9 };
}

const SIDE_OFFSET = 70; // % of a card's width between neighbouring cards
const SIDE_OPACITY = 0.3;
const NAV_BUTTON = "bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors";

/**
 * Desktop/tablet carousel: the active card is enlarged in the centre with the
 * others fanned out behind it. Arrows and dots navigate (wrapping around),
 * clicking a side card selects it, and touch screens can swipe.
 */
export default function InvolvementCarousel({
  items,
  initialIndex,
}: {
  items: readonly Involvement[];
  initialIndex: number;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const { width, activeScale, sideScale } = useCardLayout();
  const { containerRef, dragX, isSwiping, wasJustSwiped, handlers } = useSwipe<HTMLDivElement>({
    index: current,
    count: items.length,
    onIndexChange: setCurrent,
  });

  const next = () => setCurrent((i) => (i + 1) % items.length);
  const prev = () => setCurrent((i) => (i - 1 + items.length) % items.length);

  return (
    <div className="relative px-4 sm:px-6" role="region" aria-roledescription="carousel" aria-label="Involvement">
      <div
        ref={containerRef}
        {...handlers}
        className={`relative min-h-[500px] md:h-[600px] flex items-center justify-center py-8 md:py-0 touch-pan-y ${isSwiping ? "select-none" : ""}`}
      >
        {items.map((item, index) => {
          const offset = index - current;
          const isActive = offset === 0;
          return (
            <div
              key={item.name}
              onClick={() => {
                if (!isActive && !wasJustSwiped()) setCurrent(index);
              }}
              aria-hidden={isActive ? undefined : true}
              className={`absolute ${isSwiping ? "" : "transition-all duration-500 ease-in-out"} ${isActive ? "z-20" : "z-10 cursor-pointer"}`}
              style={{
                transform: `translateX(calc(${offset * SIDE_OFFSET}% + ${dragX}px)) scale(${isActive ? activeScale : sideScale})`,
                opacity: isActive ? 1 : SIDE_OPACITY,
                width,
                maxWidth: "800px",
              }}
            >
              <InvolvementCard item={item} />
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button type="button" onClick={prev} className={NAV_BUTTON} aria-label="Previous">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <div className="flex gap-2">
          {items.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === current ? "bg-purple-500" : "bg-gray-600"}`}
              aria-label={`Go to card ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
            />
          ))}
        </div>

        <button type="button" onClick={next} className={NAV_BUTTON} aria-label="Next">
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function InvolvementCard({ item }: { item: Involvement }) {
  return (
    <article className={`${CARD} p-4 sm:p-6 md:p-12 h-full`}>
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 ${item.image ? "items-start" : "items-center"}`}>
        <div
          className={`hidden md:flex ${item.image ? "flex-col items-start justify-start -space-y-8 -mt-8" : "flex-col items-center justify-center"}`}
        >
          <img src={item.logo} alt={item.name} className="w-48 h-48 object-contain rounded-lg" />
          {item.image && (
            <img src={item.image} alt={`${item.name} additional`} className="w-48 h-auto object-contain rounded-lg" />
          )}
        </div>

        <div className="md:col-span-2 text-gray-300 space-y-3 md:space-y-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{item.name}</h3>
            <p className="text-lg sm:text-xl text-purple-400 mb-1">{item.role}</p>
            <p className="text-xs sm:text-sm text-gray-500">{item.dates}</p>
          </div>

          <p className="text-base sm:text-lg leading-relaxed">{item.description}</p>

          <div>
            <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Highlights</h4>
            <div className="flex flex-wrap gap-2">
              {item.highlights.map((highlight) => (
                <span key={highlight} className="bg-purple-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
