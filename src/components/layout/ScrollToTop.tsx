import { useEffect } from "react";
import { useLocation } from "react-router";

/** Start each page at the top when navigating (unless jumping to an #anchor). */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
