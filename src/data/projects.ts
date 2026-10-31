// Projects shown on /projects. Technologies and categories are checked against
// the color maps at compile time, so a typo or a missing color is a type error.

// Tag color per technology (hex background; text color is picked for contrast)
export const TECH_COLORS = {
  // Languages & Hardware Design
  "Embedded C": "#2980b9", // Blue
  "SystemVerilog": "#7B1FA2", // Deep Purple
  "RISC-V": "#283272", // RISC-V Navy
  "Python": "#3572A5", // Python Blue
  "R": "#198CE7", // R Blue
  "JavaScript": "#F1E05A", // JS Yellow
  "HTML": "#E34C26", // HTML Orange
  "CSS": "#563D7C", // CSS Purple

  // Hardware / Microcontrollers
  "STM32": "#002A54", // ST Dark Blue
  "ESP32": "#E7352C", // Espressif Red
  "Arduino": "#00979D", // Arduino Teal
  "FPGA": "#C2410C", // Burnt Orange

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
} as const satisfies Record<string, `#${string}`>;

// Badge style per organization/category (Tailwind classes). Also the order the
// organization filters are listed in.
export const CATEGORY_STYLES = {
  "Milwaukee Tool": "bg-red-600/90 text-white border-red-500",
  "Purdue": "bg-amber-600/90 text-white border-amber-500",
  "es@p": "bg-indigo-600/90 text-white border-indigo-500",
  "Rogers Imaging": "bg-emerald-600/90 text-white border-emerald-500",
  "Personal Project": "bg-slate-600/90 text-white border-slate-500",
  "Hackathon": "bg-yellow-600/90 text-white border-yellow-500",
} as const satisfies Record<string, string>;

export type Technology = keyof typeof TECH_COLORS;
export type Category = keyof typeof CATEGORY_STYLES;

export interface ProjectLink {
  text: string;
  url: string;
}

export interface Project {
  title: string;
  category: Category;
  /** Year and month the project was completed ("YYYY-MM"); drives the time sort. */
  date: `${number}-${number}`;
  description: string;
  technologies: readonly Technology[];
  /** Card image; for animated projects this is the video's poster frame. */
  image?: string;
  /** Looping muted MP4 shown instead of the image when on screen. */
  video?: string;
  links: readonly ProjectLink[];
}

export const PROJECTS: readonly Project[] = [
  {
    title: "Dual-Core RISC-V Processor",
    category: "Purdue",
    date: "2025-12",
    description: "Over a semester, my partner and I designed a RISC-V processor in SystemVerilog and grew it from a single-cycle core into a dual-core system: a five-stage pipeline with forwarding and hazard detection, instruction and 2-way set-associative data caches, and a snooping bus with MSI cache coherence and LR/SC atomics. Verified in simulation and synthesized for a Xilinx Spartan-7 FPGA.",
    technologies: ["SystemVerilog", "RISC-V", "FPGA"],
    image: "/projects/riscv_pipeline.webp",
    links: []
  },
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
