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

// Function to get styles for a category badge
const getCategoryStyles = (category) => {
  return categoryColorMap[category] || "bg-gray-600/90 text-white border-gray-500";
};

function Projects() {
  // Breakpoint columns for masonry layout
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    768: 1
  };

  const projects = [
    {
      title: "Improved VACLINK™",
      category: "Milwaukee Tool",
      description: "During my internship with Milwaukee Tool, I worked on improving the VACLINK™ system, which allows users to wirelessly control their vacuums. My contributions included enhancing the communication protocol, optimizing the firmware for better performance, and implementing new features to improve user experience.",
      technologies: ["STM32", "Embedded C", "Radio", "Data Structures & Algorithms"],
      image: "/projects/vaclink.png",
      links: []
    },
    {
      title: "AI Hardware Accelerator",
      category: "Purdue",
      description: "Our project implements an ASIC for matrix multiplication acceleration using an 8x8 systolic array. A top-level controller, interfaced via AHB, manages I/O buffers and coordinates weight and data loading. The design is modular, fully synthesizable, and verified through simulation and synthesis reports.",
      technologies: ["SystemVerilog", "Artificial Intelligence"],
      image: "/projects/337.png",
      links: []
    },
    {
      title: "Mechanical Seven-Segment Display",
      category: "es@p",
      description: "Traditional seven-segment displays are too boring. This mechanical version offers a new twist on the commonly seen display, using a servo on each digit to display digits from 0 to 9.",
      technologies: ["Arduino", "ESP32"],
      image: "/projects/mssd.webp",
      links: []
    },
    {
      title: "PurduDraw",
      category: "es@p",
      description: "PurduDraw transforms any uploaded image into a continuous line drawing using custom image processing techniques, then brings it to life on a classic Etch A Sketch. Stepper motors, driven by an ESP32 microcontroller, precisely turn the knobs to recreate the drawing.",
      technologies: ["Arduino", "ESP32", "Python", "Data Structures & Algorithms"],
      image: "/projects/purdudraw.webp",
      links: []
    },
    {
      title: "Smart Lock",
      category: "Purdue",
      description: "Smart Lock provides a secure, efficient, and convenient solution for home protection. Doors can be locked using a customizable 4-digit PIN, securely stored in EEPROM, and unlocked by entering the PIN or tapping an RFID tag on the scanner.",
      technologies: ["Embedded C", "STM32"],
      image: "/projects/smartlock.webp",
      links: [
        { text: "YouTube", url: "https://youtu.be/C6wKMHrVE4o" }
      ]
    },
    {
      title: "Focal Split",
      category: "Purdue",
      description: "Focal Split is a handheld DfDD camera with onboard compute, capturing dual defocused images to estimate depth at 500 FLOPs/pixel. It runs on a Raspberry Pi 5, draws 4.9 W, and outputs 480x360 depth maps at 2.1FPS for 0.4-1.2m ranges. Accepted to CVPR 2025.",
      technologies: ["Python", "Computer Vision", "Artificial Intelligence"],
      image: "/projects/dfdd.webp",
      links: [
        { text: "CVPR 2025 Publication", url: "https://openaccess.thecvf.com/content/CVPR2025/html/Luo_Focal_Split_Untethered_Snapshot_Depth_from_Differential_Defocus_CVPR_2025_paper.html" }
      ]
    },
    {
      title: "Predictive diagnostic disease tool",
      category: "Rogers Imaging",
      description: "A program used for identifying responsive genes to pharmacological interventions, ranking disease-associated SNPs, and assessing disease risk using unbiased analytical methods to support precision medicine.",
      technologies: ["Python", "R", "Artificial Intelligence", "Data Structures & Algorithms"],
      image: "/projects/interactome.webp",
      links: []
    },
    {
      title: "Graph Playground",
      category: "Personal Project",
      description: "A force-directed graph simulation allowing users to alter physics in real time and visualize Dijkstra's algorithm and k-means clustering on their network.",
      technologies: ["JavaScript", "HTML", "CSS", "Object-Oriented", "Data Structures & Algorithms"],
      image: "/projects/graph.webp",
      links: [
        { text: "Try it out!", url: "/projects/Network/graph.html" },
        { text: "GitHub", url: "https://github.com/tconcan/Network" }
      ]
    },
    {
      title: "Particle Life",
      category: "Personal Project",
      description: "Particle Life is a computational art project that simulates interactions between particles based on randomized forces.",
      technologies: ["JavaScript", "HTML", "CSS", "Object-Oriented"],
      image: "/projects/life.webp",
      links: [
        { text: "Try it out!", url: "/projects/Network/life.html" },
        { text: "GitHub", url: "https://github.com/tconcan/Network" }
      ]
    },
    {
      title: "AD RayOptics",
      category: "Purdue",
      description: "AD Ray-Optics is a fast, stable framework for differentiable ray tracing in multi-layer optics, outperforming finite difference methods in gradient calculation, and is validated through lens and optics optimization experiments.",
      technologies: ["Python", "Jupyter", "Object-Oriented"],
      image: "/projects/ad_rayoptics.png",
      links: [
        { text: "GitHub", url: "https://github.com/guo-research-group/AD-Ray-Optics" }
      ]
    },
    {
      title: "IceBreak",
      category: "Hackathon",
      description: "IceBreak is a platform that combats college loneliness by using a proprietary algorithm to match students with compatible friends within social organizations and providing AI-generated conversation topics to foster meaningful connections and friendships.",
      technologies: ["Python", "Flask", "SQLite", "HTML", "CSS", "Artificial Intelligence"],
      image: "/projects/ice_break.png",
      links: [
        { text: "Devpost", url: "https://devpost.com/software/ice-break" }
      ]
    }
  ];

  return (
    <>
      <section className="py-20 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
            Projects
          </h2>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 hover:border-purple-400 transition-all duration-300 overflow-hidden"
              >
                <div className="relative w-full h-48 bg-gray-700 flex items-center justify-center overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {project.category && (
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryStyles(project.category)}`}>
                        {project.category}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, idx) => {
                      const hasError = !techColorMap[tech];
                      const color = getTechColor(tech);
                      return (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-xs text-white font-medium ${hasError ? 'animate-pulse border-2 border-red-500' : ''}`}
                          style={{ backgroundColor: color }}
                          title={hasError ? `ERROR: Technology "${tech}" not found in color mapping!` : ''}
                        >
                          {hasError ? `⚠ ${tech}` : tech}
                        </span>
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
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Projects;

