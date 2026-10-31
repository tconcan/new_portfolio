export const CONTACT_EMAIL = "thomascon04@gmail.com";
export const OWNER_NAME = "Tom Concannon";
export const COPYRIGHT_NAME = "Thomas Concannon";

export type SocialIcon = "romatom" | "linkedin" | "github";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

// Shown in the navbar: as icons on desktop, as labelled rows in the mobile menu.
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "Roma Tom", href: "https://romatom.com/", icon: "romatom" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/thomascon/", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com/tconcan", icon: "github" },
];

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
] as const;
