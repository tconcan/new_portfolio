import { EXPERIENCES } from "../../../data/experience";
import { useIsMobile } from "../../../hooks/useMediaQuery";
import { SwipeCarousel } from "../../ui/SwipeCarousel";
import { SECTION_TITLE } from "../../ui/styles";
import { ExperienceCard, MobileExperienceCard } from "./ExperienceCard";

export default function Experience() {
  const isMobile = useIsMobile();

  return (
    <section id="experience" className="py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className={`${SECTION_TITLE} mb-8 md:mb-12`}>Professional Experience</h2>

        {isMobile ? (
          <SwipeCarousel label="Professional experience">
            {EXPERIENCES.map((experience) => (
              <MobileExperienceCard key={experience.company} experience={experience} />
            ))}
          </SwipeCarousel>
        ) : (
          <div className="space-y-8">
            {EXPERIENCES.map((experience) => (
              <ExperienceCard key={experience.company} experience={experience} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
