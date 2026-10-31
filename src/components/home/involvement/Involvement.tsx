import { INITIAL_INVOLVEMENT_INDEX, INVOLVEMENTS, ORGANIZATION_LOGOS } from "../../../data/involvement";
import { useIsMobile } from "../../../hooks/useMediaQuery";
import { SwipeCarousel } from "../../ui/SwipeCarousel";
import { SECTION_TITLE } from "../../ui/styles";
import InvolvementCarousel from "./InvolvementCarousel";
import LogoStrip from "./LogoStrip";
import MobileInvolvementCard from "./MobileInvolvementCard";

export default function Involvement() {
  const isMobile = useIsMobile();

  return (
    <section id="involvement" className="py-8 md:py-10 overflow-hidden">
      <div className="px-6">
        <h2 className={`${SECTION_TITLE} mb-8 md:mb-12`}>Involvement</h2>
      </div>

      <LogoStrip logos={ORGANIZATION_LOGOS} />

      {isMobile ? (
        <div className="mt-6 px-0">
          <SwipeCarousel label="Involvement" initialIndex={INITIAL_INVOLVEMENT_INDEX}>
            {INVOLVEMENTS.map((item) => (
              <MobileInvolvementCard key={item.name} item={item} />
            ))}
          </SwipeCarousel>
        </div>
      ) : (
        <InvolvementCarousel items={INVOLVEMENTS} initialIndex={INITIAL_INVOLVEMENT_INDEX} />
      )}
    </section>
  );
}
