import { ABOUT_PARAGRAPHS } from "../../data/about";
import { OWNER_NAME } from "../../data/site";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { Expandable } from "../ui/Disclosure";
import { CARD, OUTLINE_BUTTON, SECTION_TITLE } from "../ui/styles";

const PARAGRAPH = "text-base sm:text-lg leading-relaxed";
const BUTTON = `${OUTLINE_BUTTON} px-6 py-3 text-sm sm:text-base`;

export default function About() {
  const isMobile = useIsMobile();
  const [first, ...rest] = ABOUT_PARAGRAPHS;

  return (
    <section id="about" className="md:min-h-[80vh] flex items-center justify-center py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className={`${SECTION_TITLE} mb-8 md:mb-12`}>About Me</h2>

        <div className={`${CARD} p-5 sm:p-8 md:p-12`}>
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
            {/* Portrait (smaller on phones to keep the card short) */}
            <div className="flex justify-center">
              <img
                src="/about/portrait.webp"
                alt={OWNER_NAME}
                className="rounded-xl shadow-2xl w-44 sm:w-64 md:max-w-md md:w-full object-cover border-4 border-blue-400"
              />
            </div>

            <div className="text-gray-300 space-y-4 md:space-y-6 text-center md:text-left">
              {isMobile ? (
                <>
                  <p className={PARAGRAPH}>{first}</p>
                  <Expandable label="Read more">
                    {rest.map((paragraph) => (
                      <p key={paragraph} className={`${PARAGRAPH} pt-1`}>
                        {paragraph}
                      </p>
                    ))}
                  </Expandable>
                </>
              ) : (
                ABOUT_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph} className={PARAGRAPH}>
                    {paragraph}
                  </p>
                ))
              )}
              <div className="pt-2 md:pt-4 flex gap-4 justify-center md:justify-start">
                <a href="#experience" className={BUTTON}>
                  Experience
                </a>
                <a href="#involvement" className={BUTTON}>
                  Involvement
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
