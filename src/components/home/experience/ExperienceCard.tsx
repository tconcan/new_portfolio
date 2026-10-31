import type { Experience } from "../../../data/experience";
import { Expandable } from "../../ui/Disclosure";
import { CARD } from "../../ui/styles";

/** Desktop: large logo on the left, role and every bullet on the right. */
export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <article className={`${CARD} p-8`}>
      <div className="grid grid-cols-3 gap-8 items-center">
        <div className="flex flex-col items-center justify-center">
          <img src={experience.logo} alt={experience.company} className="w-48 h-48 object-contain rounded-lg" />
        </div>

        <div className="col-span-2">
          <div className="mb-4">
            <h3 className="text-3xl font-bold text-white mb-1">{experience.role}</h3>
            <p className="text-xl text-purple-400 mb-1">{experience.company}</p>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            {experience.location} • {experience.dates}
          </p>

          <ul className="text-gray-300 text-lg leading-relaxed space-y-3 list-disc list-outside pl-8 marker:text-purple-400">
            {experience.highlights.map((point) => (
              <li key={point} className="pl-2">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

const VISIBLE_ON_MOBILE = 2;
const MOBILE_LIST = "text-gray-300 text-base leading-relaxed space-y-2 list-disc list-outside pl-5 marker:text-purple-400";

/** Phone: compact header, the first two bullets, the rest behind a dropdown. */
export function MobileExperienceCard({ experience }: { experience: Experience }) {
  const shown = experience.highlights.slice(0, VISIBLE_ON_MOBILE);
  const more = experience.highlights.slice(VISIBLE_ON_MOBILE);

  return (
    <article className={`${CARD} p-5`}>
      <div className="flex items-center gap-3 mb-3 border-b border-gray-700/50 pb-3">
        <img
          src={experience.logo}
          alt={experience.company}
          className="w-12 h-12 object-contain rounded-lg bg-gray-700/30 p-1 border border-gray-700"
        />
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white leading-tight">{experience.role}</h3>
          <p className="text-purple-400 font-medium text-sm">{experience.company}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {experience.location} • {experience.dates}
          </p>
        </div>
      </div>

      <ul className={MOBILE_LIST}>
        {shown.map((point) => (
          <li key={point} className="pl-1">
            {point}
          </li>
        ))}
      </ul>

      {more.length > 0 && (
        <Expandable label={`Show ${more.length} more`}>
          <ul className={`${MOBILE_LIST} mt-2`}>
            {more.map((point) => (
              <li key={point} className="pl-1">
                {point}
              </li>
            ))}
          </ul>
        </Expandable>
      )}
    </article>
  );
}
