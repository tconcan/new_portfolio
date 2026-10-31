export interface OrganizationLogo {
  name: string;
  image: string;
  url: string;
}

export interface Involvement {
  name: string;
  role: string;
  logo: string;
  /** Optional second image shown under the logo on desktop. */
  image?: string;
  description: string;
  dates: string;
  highlights: readonly string[];
}

// Scrolling logo strip
export const ORGANIZATION_LOGOS: readonly OrganizationLogo[] = [
  { name: "Rocket", image: "/involvement/rocket.webp", url: "https://www.needhamma.gov/" },
  { name: "Hearth", image: "/involvement/hearth.webp", url: "https://hearthpizzeria.com/" },
  { name: "Purdue", image: "/involvement/purdue.webp", url: "https://www.purdue.edu" },
  { name: "SNU", image: "/involvement/snu.webp", url: "https://www.sigmanu.org/" },
  { name: "ASC", image: "/involvement/asc.webp", url: "https://www.purdue.edu/asc/" },
  { name: "HKN", image: "/involvement/hkn.webp", url: "https://hkn.ieee.org/" },
  { name: "es@p", image: "/involvement/esap1.webp", url: "https://embedded-purdue.github.io/" },
  { name: "USAF", image: "/involvement/usaf.webp", url: "https://www.airforce.com/" },
  { name: "Roma Tom", image: "/involvement/romatom.webp", url: "https://romatom.com/" },
];

// Detailed cards
export const INVOLVEMENTS: readonly Involvement[] = [
  {
    name: "Academic Success Center",
    role: "Supplemental Instruction Leader",
    logo: "/involvement/asc.webp",
    description:
      "Led twice-weekly group tutoring sessions and exam reviews for introductory electrical engineering courses, developing collaborative learning strategies and strong facilitation skills.",
    dates: "August 2024 - December 2025",
    highlights: ["Team Leader", "Communication Skills", "ECE 2k2", "ECE 270"],
  },
  {
    name: "Embedded Systems @ Purdue",
    role: "Co-Founder & President",
    logo: "/involvement/esap1.webp",
    image: "/involvement/esap2.webp",
    description:
      "Built a student-led community of 100+ members who are interested embedded systems, organized workshops and speaker events, and led technical projects.",
    dates: "January 2025 - May 2026",
    highlights: ["Leadership", "Technical Projects", "Professional Workshops"],
  },
  {
    name: "Purdue University",
    role: "Bachelor of Science in Computer Engineering",
    logo: "/involvement/purdue.webp",
    description:
      "At Purdue I've been able to explore my interests in computer engineering through coursework, research, and involvement in various student organizations.",
    dates: "August 2022 - May 2026",
    highlights: ["3.98 GPA", "Computer Systems", "Software Engineering", "Microelectronics + Semiconductors"],
  },
  {
    name: "United States Air Force",
    role: "Second Lieutenant",
    logo: "/involvement/usaf.webp",
    description:
      "After graduation, I will be commissioning as a Second Lieutenant in the United States Air Force through OTS. I will be serving as a Computer Systems Developmental Engineer (62EC).",
    dates: "January 2027",
    highlights: ["62EC"],
  },
];

/** Card shown first in the carousel (Purdue University). */
export const INITIAL_INVOLVEMENT_INDEX = 2;
