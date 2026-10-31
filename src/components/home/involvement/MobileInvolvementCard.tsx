import type { Involvement } from "../../../data/involvement";
import { ClampText } from "../../ui/Disclosure";
import { CARD } from "../../ui/styles";

/** Phone layout: logo + title row, description clamped with "Read more". */
export default function MobileInvolvementCard({ item }: { item: Involvement }) {
  return (
    <article className={`${CARD} p-5`}>
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
    </article>
  );
}
