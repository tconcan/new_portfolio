import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

/**
 * Looping, muted card video. Shows the poster image until the card is near the
 * screen, then loads and plays; pauses again when scrolled away. Users who ask
 * for reduced motion just see the poster.
 */
export default function LazyVideo({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [activated, setActivated] = useState(false); // once loaded, keep the source
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setActivated(true);
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
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
