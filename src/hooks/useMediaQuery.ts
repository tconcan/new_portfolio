import { useSyncExternalStore } from "react";

/** Live result of a CSS media query (updates on resize/rotation/settings). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
  );
}

/** Phone-sized screens: below Tailwind's `md` breakpoint (768px). */
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
