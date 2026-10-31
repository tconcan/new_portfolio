import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Masonry from "react-masonry-css";

// Color mapping for technology tags (using hex values)
const techColorMap = {
  // Languages & Hardware Design
  "Embedded C": "#2980b9", // Blue
  "SystemVerilog": "#7B1FA2", // Deep Purple
  "Python": "#3572A5", // Python Blue
  "R": "#198CE7", // R Blue
  "JavaScript": "#F1E05A", // JS Yellow
  "HTML": "#E34C26", // HTML Orange
  "CSS": "#563D7C", // CSS Purple

  // Hardware / Microcontrollers
  "STM32": "#002A54", // ST Dark Blue
  "ESP32": "#E7352C", // Espressif Red
  "Arduino": "#00979D", // Arduino Teal

  // Concepts & Tech
  "Radio": "#27AE60", // Green
  "Data Structures & Algorithms": "#8E44AD", // Purple
  "Artificial Intelligence": "#D35400", // Orange
  "Computer Vision": "#1ABC9C", // Turquoise
  "Object-Oriented": "#2C3E50", // Slate

  // Frameworks & Tools
  "Jupyter": "#DA5B0B", // Jupyter Orange
  "Flask": "#3c3c3c", // Dark Grey
  "SQLite": "#003B57", // SQLite Blue
};

// Color mapping for organizations/categories
const categoryColorMap = {
  "Milwaukee Tool": "bg-red-600/90 text-white border-red-500",
  "Purdue": "bg-amber-600/90 text-white border-amber-500",
  "es@p": "bg-indigo-600/90 text-white border-indigo-500",
  "Rogers Imaging": "bg-emerald-600/90 text-white border-emerald-500",
  "Personal Project": "bg-slate-600/90 text-white border-slate-500",
  "Hackathon": "bg-yellow-600/90 text-white border-yellow-500",
};

// Function to get color for a technology
const getTechColor = (tech) => {
  if (techColorMap[tech]) {
    return techColorMap[tech];
  }
  // Return error color if technology not found
  return "#b91c1c"; // red-700
};

// Dark text on light tag colors (e.g. JavaScript yellow), white text otherwise
const getTextColor = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const luminance = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return luminance > 0.6 ? "#111827" : "#ffffff";
};

// Function to get styles for a category badge
const getCategoryStyles = (category) => {
  return categoryColorMap[category] || "bg-gray-600/90 text-white border-gray-500";
};

// "2025-08" -> "Aug 2025"
const formatDate = (yearMonth) =>
  new Date(`${yearMonth}-01T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" });

const SORT_OPTIONS = {
  newest: "Newest first",
  oldest: "Oldest first",
  title: "Title (A–Z)",
};

// Breakpoint columns for masonry layout
const breakpointColumnsObj = {
  default: 3,
  1024: 2,
  768: 1
};

// `date` is the year and month the project was completed ("YYYY-MM"); it drives the time sort.
const projects = [
  {
    title: "Improved VACLINK™",
    category: "Milwaukee Tool",
    date: "2025-08",
    description: "During my internship with Milwaukee Tool, I worked on improving the VACLINK™ system, which allows users to wirelessly control their vacuums. My contributions included enhancing the communication protocol, optimizing the firmware for better performance, and implementing new features to improve user experience.",
    technologies: ["STM32", "Embedded C", "Radio", "Data Structures & Algorithms"],
    image: "/projects/vaclink.webp",
    links: []
  },
  {
    title: "AI Hardware Accelerator",
    category: "Purdue",
    date: "2025-04",
    description: "Our project implements an ASIC for matrix multiplication acceleration using an 8x8 systolic array. A top-level controller, interfaced via AHB, manages I/O buffers and coordinates weight and data loading. The design is modular, fully synthesizable, and verified through simulation and synthesis reports.",
    technologies: ["SystemVerilog", "Artificial Intelligence"],
    image: "/projects/337.webp",
    links: []
  },
  {
    title: "Mechanical Seven-Segment Display",
    category: "es@p",
    date: "2025-04",
    description: "Traditional seven-segment displays are too boring. This mechanical version offers a new twist on the commonly seen display, using a servo on each digit to display digits from 0 to 9.",
    technologies: ["Arduino", "ESP32"],
    image: "/projects/mssd-poster.webp",
    video: "/projects/mssd.mp4",
    links: []
  },
  {
    title: "PurduDraw",
    category: "es@p",
    date: "2025-04", 
    description: "PurduDraw transforms any uploaded image into a continuous line drawing using custom image processing techniques, then brings it to life on a classic Etch A Sketch. Stepper motors, driven by an ESP32 microcontroller, precisely turn the knobs to recreate the drawing.",
    technologies: ["Arduino", "ESP32", "Python", "Data Structures & Algorithms"],
    image: "/projects/purdudraw.webp",
    links: []
  },
  {
    title: "Smart Lock",
    category: "Purdue",
    date: "2024-12", 
    description: "Smart Lock provides a secure, efficient, and convenient solution for home protection. Doors can be locked using a customizable 4-digit PIN, securely stored in EEPROM, and unlocked by entering the PIN or tapping an RFID tag on the scanner.",
    technologies: ["Embedded C", "STM32"],
    image: "/projects/smartlock-poster.webp",
    video: "/projects/smartlock.mp4",
    links: [
      { text: "YouTube", url: "https://youtu.be/C6wKMHrVE4o" }
    ]
  },
  {
    title: "Focal Split",
    category: "Purdue",
    date: "2024-11", 
    description: "Focal Split is a handheld DfDD camera with onboard compute, capturing dual defocused images to estimate depth at 500 FLOPs/pixel. It runs on a Raspberry Pi 5, draws 4.9 W, and outputs 480x360 depth maps at 2.1FPS for 0.4-1.2m ranges. Accepted to CVPR 2025.",
    technologies: ["Python", "Computer Vision", "Artificial Intelligence"],
    image: "/projects/dfdd-poster.webp",
    video: "/projects/dfdd.mp4",
    links: [
      { text: "CVPR 2025 Publication", url: "https://openaccess.thecvf.com/content/CVPR2025/html/Luo_Focal_Split_Untethered_Snapshot_Depth_from_Differential_Defocus_CVPR_2025_paper.html" }
    ]
  },
  {
    title: "Predictive diagnostic disease tool",
    category: "Rogers Imaging",
    date: "2024-08",
    description: "A program used for identifying responsive genes to pharmacological interventions, ranking disease-associated SNPs, and assessing disease risk using unbiased analytical methods to support precision medicine.",
    technologies: ["Python", "R", "Artificial Intelligence", "Data Structures & Algorithms"],
    image: "/projects/interactome-poster.webp",
    video: "/projects/interactome.mp4",
    links: []
  },
  {
    title: "Graph Playground",
    category: "Personal Project",
    date: "2024-07",
    description: "A force-directed graph simulation allowing users to alter physics in real time and visualize Dijkstra's algorithm and k-means clustering on their network.",
    technologies: ["JavaScript", "HTML", "CSS", "Object-Oriented", "Data Structures & Algorithms"],
    image: "/projects/graph-poster.webp",
    video: "/projects/graph.mp4",
    links: [
      { text: "Try it out!", url: "/projects/Network/graph.html" },
      { text: "GitHub", url: "https://github.com/tconcan/Network" }
    ]
  },
  {
    title: "Particle Life",
    category: "Personal Project",
    date: "2024-07",
    description: "Particle Life is a computational art project that simulates interactions between particles based on randomized forces.",
    technologies: ["JavaScript", "HTML", "CSS", "Object-Oriented"],
    image: "/projects/life-poster.webp",
    video: "/projects/life.mp4",
    links: [
      { text: "Try it out!", url: "/projects/Network/life.html" },
      { text: "GitHub", url: "https://github.com/tconcan/Network" }
    ]
  },
  {
    title: "AD RayOptics",
    category: "Purdue",
    date: "2024-05",
    description: "AD Ray-Optics is a fast, stable framework for differentiable ray tracing in multi-layer optics, outperforming finite difference methods in gradient calculation, and is validated through lens and optics optimization experiments.",
    technologies: ["Python", "Jupyter", "Object-Oriented"],
    image: "/projects/ad_rayoptics.webp",
    links: [
      { text: "GitHub", url: "https://github.com/guo-research-group/AD-Ray-Optics" }
    ]
  },
  {
    title: "IceBreak",
    category: "Hackathon",
    date: "2024-03",
    description: "IceBreak is a platform that combats college loneliness by using a proprietary algorithm to match students with compatible friends within social organizations and providing AI-generated conversation topics to foster meaningful connections and friendships.",
    technologies: ["Python", "Flask", "SQLite", "HTML", "CSS", "Artificial Intelligence"],
    image: "/projects/ice_break.webp",
    links: [
      { text: "Devpost", url: "https://devpost.com/software/ice-break" }
    ]
  }
];

// Filter options with project counts. Organizations keep the color-map order;
// technologies are ordered by how many projects use them.
const countBy = (values) =>
  values.reduce((acc, v) => acc.set(v, (acc.get(v) || 0) + 1), new Map());

const orgCounts = countBy(projects.map((p) => p.category));
const orgOptions = [
  ...Object.keys(categoryColorMap).filter((org) => orgCounts.has(org)),
  ...[...orgCounts.keys()].filter((org) => !(org in categoryColorMap)),
];

const techCounts = countBy(projects.flatMap((p) => p.technologies));
const techOptions = [...techCounts.keys()].sort(
  (a, b) => techCounts.get(b) - techCounts.get(a) || a.localeCompare(b)
);

// Looping, muted card video. Shows the poster image until the card is near the
// screen, then loads and plays; pauses again when scrolled away. Users who ask
// for reduced motion just see the poster.
function LazyVideo({ src, poster, title }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [activated, setActivated] = useState(false); // once loaded, keep the source
  const [reduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    const io = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setActivated(true);
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !activated) return;
    if (inView) el.play().catch(() => {});
    else el.pause();
  }, [inView, activated]);

  return (
    <video
      ref={ref}
      src={activated ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={title}
      className="w-full h-full object-cover"
    />
  );
}

function FilterChip({ active, onClick, className = "", style, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={style}
      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors inline-flex items-center gap-1.5 ${className}`}
    >
      {children}
    </button>
  );
}

function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Sort and filters live in the URL so a filtered view can be shared or bookmarked.
  const sort = SORT_OPTIONS[searchParams.get("sort")] ? searchParams.get("sort") : "newest";
  const selectedOrgs = searchParams.getAll("org");
  const selectedTechs = searchParams.getAll("tech");
  const techMatch = searchParams.get("match") === "any" ? "any" : "all";
  const activeFilterCount = selectedOrgs.length + selectedTechs.length;

  const [filtersOpen, setFiltersOpen] = useState(activeFilterCount > 0);

  const updateParams = (mutate) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next, { replace: true });
  };

  const toggleParam = (key, value) =>
    updateParams((next) => {
      const values = next.getAll(key);
      next.delete(key);
      const updated = values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
      updated.forEach((v) => next.append(key, v));
    });

  const setSort = (value) =>
    updateParams((next) => (value === "newest" ? next.delete("sort") : next.set("sort", value)));

  const setTechMatch = (value) =>
    updateParams((next) => (value === "all" ? next.delete("match") : next.set("match", value)));

  const clearFilters = () =>
    updateParams((next) => {
      next.delete("org");
      next.delete("tech");
      next.delete("match");
    });

  // Clicking a tag or badge on a card filters by it and shows the filter panel.
  const filterFromCard = (key, value) => {
    toggleParam(key, value);
    setFiltersOpen(true);
  };

  const visibleProjects = useMemo(() => {
    const filtered = projects.filter((p) => {
      const orgOk = selectedOrgs.length === 0 || selectedOrgs.includes(p.category);
      const techOk =
        selectedTechs.length === 0 ||
        (techMatch === "all"
          ? selectedTechs.every((t) => p.technologies.includes(t))
          : selectedTechs.some((t) => p.technologies.includes(t)));
      return orgOk && techOk;
    });

    const byTitle = (a, b) => a.title.localeCompare(b.title);
    return filtered.sort((a, b) => {
      if (sort === "title") return byTitle(a, b);
      const byDate = sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      return byDate || byTitle(a, b);
    });
    // The arrays are rebuilt from the URL each render, so key on their contents.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, techMatch, selectedOrgs.join("|"), selectedTechs.join("|")]);

  return (
    <>
      <section className="py-20 px-4 sm:px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-10">
            Projects
          </h2>

          {/* Toolbar */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <span>Sort</span>
                  {/* Custom-styled select: Safari's native styling clips the label */}
                  <span className="relative inline-flex">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="appearance-none bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg pl-3 pr-9 py-2 text-white text-sm leading-5 min-w-[9.5rem] cursor-pointer focus:outline-none focus:border-purple-400"
                    >
                      {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setFiltersOpen((open) => !open)}
                  aria-expanded={filtersOpen}
                  aria-controls="project-filters"
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border backdrop-blur-sm transition-colors ${
                    filtersOpen || activeFilterCount
                      ? "bg-purple-500/20 border-purple-400 text-white"
                      : "bg-gray-800/80 border-gray-700 text-gray-300 hover:border-purple-400 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18l-7 8.5V19l-4 2v-8.5L3 4z" />
                  </svg>
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="bg-purple-500 text-white rounded-full text-xs min-w-[1.25rem] h-5 px-1.5 inline-flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-400" aria-live="polite">
                Showing {visibleProjects.length} of {projects.length}
                {activeFilterCount > 0 && (
                  <>
                    {" · "}
                    <button type="button" onClick={clearFilters} className="text-purple-400 hover:text-purple-300 font-medium">
                      Clear filters
                    </button>
                  </>
                )}
              </p>
            </div>

            {filtersOpen && (
              <div
                id="project-filters"
                className="mt-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-5 space-y-5"
              >
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Organization</h3>
                  <div className="flex flex-wrap gap-2">
                    {orgOptions.map((org) => {
                      const active = selectedOrgs.includes(org);
                      return (
                        <FilterChip
                          key={org}
                          active={active}
                          onClick={() => toggleParam("org", org)}
                          className={active ? getCategoryStyles(org) : "border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"}
                        >
                          {org}
                          <span className={active ? "opacity-80" : "text-gray-500"}>{orgCounts.get(org)}</span>
                        </FilterChip>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Technology</h3>
                    <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                      <span>Match</span>
                      <div className="inline-flex rounded-lg border border-gray-600 overflow-hidden" role="group" aria-label="Technology match mode">
                        {[["all", "All"], ["any", "Any"]].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={techMatch === value}
                            onClick={() => setTechMatch(value)}
                            className={`px-2.5 py-1 font-medium transition-colors ${
                              techMatch === value ? "bg-purple-500 text-white" : "text-gray-300 hover:text-white"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {techOptions.map((tech) => {
                      const active = selectedTechs.includes(tech);
                      const color = getTechColor(tech);
                      return (
                        <FilterChip
                          key={tech}
                          active={active}
                          onClick={() => toggleParam("tech", tech)}
                          style={active ? { backgroundColor: color, borderColor: color, color: getTextColor(color) } : undefined}
                          className={active ? "" : "border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"}
                        >
                          {!active && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />}
                          {tech}
                          <span className={active ? "opacity-70" : "text-gray-500"}>{techCounts.get(tech)}</span>
                        </FilterChip>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {visibleProjects.length === 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-10 text-center">
              <p className="text-lg text-gray-300 mb-4">No projects match these filters.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="border border-white hover:bg-white hover:text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {visibleProjects.map((project) => (
              <div
                key={project.title}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 hover:border-purple-400 transition-all duration-300 overflow-hidden"
              >
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
                    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {project.category && (
                    <div className="absolute top-3 left-3">
                      <button
                        type="button"
                        onClick={() => filterFromCard("org", project.category)}
                        title={`Filter by ${project.category}`}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border hover:brightness-110 ${getCategoryStyles(project.category)} ${
                          selectedOrgs.includes(project.category) ? "ring-2 ring-white/80" : ""
                        }`}
                      >
                        {project.category}
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {project.title}
                  </h3>
                  {project.date && (
                    <p className="text-sm text-gray-400 mb-3">{formatDate(project.date)}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => {
                      const hasError = !techColorMap[tech];
                      const color = getTechColor(tech);
                      const active = selectedTechs.includes(tech);
                      return (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => filterFromCard("tech", tech)}
                          className={`px-3 py-1 rounded-full text-xs font-medium hover:brightness-110 ${hasError ? 'animate-pulse border-2 border-red-500' : ''} ${active ? 'ring-2 ring-white/80' : ''}`}
                          style={{ backgroundColor: color, color: getTextColor(color) }}
                          title={hasError ? `ERROR: Technology "${tech}" not found in color mapping!` : `Filter by ${tech}`}
                        >
                          {hasError ? `⚠ ${tech}` : tech}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-gray-300 text-base leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {project.links && project.links.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-700/50">
                      {project.links.map((lnk, idx) => (
                        <a
                          key={idx}
                          href={lnk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 font-semibold transition-colors inline-flex items-center gap-1.5 text-sm"
                        >
                          {lnk.text}
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Masonry>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Projects;
