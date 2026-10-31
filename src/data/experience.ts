export interface Experience {
  company: string;
  role: string;
  location: string;
  dates: string;
  logo: string;
  /** Bullet points, most important first (the first two show on phones). */
  highlights: readonly string[];
}

export const EXPERIENCES: readonly Experience[] = [
  {
    company: "Milwaukee Tool",
    role: "Firmware Engineer",
    location: "Milwaukee, WI",
    dates: "May 2025 - August 2025",
    logo: "/experience/met.webp",
    highlights: [
      "Investigated wireless system latency and reliability to inform a replacement architecture",
      "Developed a drop-in RF solution integrated with proprietary code to improve responsiveness",
      "Validated the redesign with testing, achieving 27 times faster performance and higher reliability",
      "Rewrote an LED control API to enable configurable brightness and behavior profiles",
    ],
  },
  {
    company: "Rogers Imaging Corporation",
    role: "Software Engineer",
    location: "Natick, MA",
    dates: "May 2024 - August 2024",
    logo: "/experience/ric.webp",
    highlights: [
      "Refactored a predictive risk-analysis tool from R to Python, improving performance by ~30 times",
      "Added interactive 3D visualizations and enhanced analytics to better identify high-risk proteins linked to genetic disorders",
    ],
  },
];
