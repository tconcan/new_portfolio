import { CATEGORY_STYLES, TECH_COLORS, type Category, type Project, type Technology } from "../../data/projects";
import { readableTextColor } from "../../lib/color";
import { formatYearMonth } from "../../lib/date";
import { ExternalLinkIcon, ImagePlaceholderIcon } from "../ui/icons";
import LazyVideo from "./LazyVideo";

interface ProjectCardProps {
  project: Project;
  isCategorySelected: boolean;
  isTechnologySelected: (tech: Technology) => boolean;
  onCategoryClick: (category: Category) => void;
  onTechnologyClick: (tech: Technology) => void;
}

/** Project card. Its category badge and technology tags toggle the matching filters. */
export default function ProjectCard({
  project,
  isCategorySelected,
  isTechnologySelected,
  onCategoryClick,
  onTechnologyClick,
}: ProjectCardProps) {
  return (
    <article className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 hover:border-purple-400 transition-all duration-300 overflow-hidden">
      <div className="relative w-full h-48 bg-gray-700 flex items-center justify-center overflow-hidden">
        {project.video ? (
          <LazyVideo src={project.video} poster={project.image} title={project.title} />
        ) : project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <ImagePlaceholderIcon className="w-16 h-16 text-gray-500" />
        )}
        <div className="absolute top-3 left-3">
          <button
            type="button"
            onClick={() => onCategoryClick(project.category)}
            title={`Filter by ${project.category}`}
            aria-pressed={isCategorySelected}
            className={`px-3 py-1 rounded-full text-xs font-semibold border hover:brightness-110 ${CATEGORY_STYLES[project.category]} ${
              isCategorySelected ? "ring-2 ring-white/80" : ""
            }`}
          >
            {project.category}
          </button>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-1">{project.title}</h2>
        <p className="text-sm text-gray-400 mb-3">
          <time dateTime={project.date}>{formatYearMonth(project.date)}</time>
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => {
            const color = TECH_COLORS[tech];
            const selected = isTechnologySelected(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => onTechnologyClick(tech)}
                title={`Filter by ${tech}`}
                aria-pressed={selected}
                className={`px-3 py-1 rounded-full text-xs font-medium hover:brightness-110 ${selected ? "ring-2 ring-white/80" : ""}`}
                style={{ backgroundColor: color, color: readableTextColor(color) }}
              >
                {tech}
              </button>
            );
          })}
        </div>

        <p className="text-gray-300 text-base leading-relaxed mb-4">{project.description}</p>

        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-700/50">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors inline-flex items-center gap-1.5 text-sm"
              >
                {link.text}
                <ExternalLinkIcon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
