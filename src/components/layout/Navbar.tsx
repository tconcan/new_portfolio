import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { NAV_LINKS, OWNER_NAME, SOCIAL_LINKS, type SocialIcon } from "../../data/site";
import { CloseIcon, ExternalLinkIcon, GitHubIcon, LinkedInIcon, MenuIcon } from "../ui/icons";

function SocialIconGraphic({ icon, className }: { icon: SocialIcon; className: string }) {
  switch (icon) {
    case "romatom":
      return <img src="/navbar/romatom.webp" alt="" className={`${className} w-auto`} />;
    case "linkedin":
      return <LinkedInIcon className={className} />;
    case "github":
      return <GitHubIcon className={className} />;
  }
}

const MENU_ITEM = "flex items-center gap-3 nav-glow py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-base";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const closeMenu = () => setIsMenuOpen(false);

  // Close the mobile menu when clicking outside it
  useEffect(() => {
    if (!isMenuOpen) return;
    const onMouseDown = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isMenuOpen]);

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      className="bg-gray-900/80 text-white fixed w-full top-0 z-50 shadow"
      style={{ paddingLeft: "env(safe-area-inset-left, 0px)", paddingRight: "env(safe-area-inset-right, 0px)" }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 flex justify-between items-center h-14 sm:h-16">
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
          <div className="nav-glow text-lg sm:text-xl md:text-2xl font-bold">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 md:gap-4" onClick={closeMenu}>
              <img src="/navbar/logo.webp" alt="Logo" className="h-6 sm:h-7 md:h-8" />
              <span className="hidden sm:inline">{OWNER_NAME}</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={pathname === link.to ? "page" : undefined}
                className={`nav-glow ${pathname === link.to ? "opacity-100" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Social icons (desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-glow cursor-pointer"
              aria-label={link.label}
            >
              <SocialIconGraphic icon={link.icon} className="h-6 w-6" />
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-3 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={pathname === link.to ? "page" : undefined}
                className={`${MENU_ITEM} ${pathname === link.to ? "opacity-100" : ""}`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-700/70 my-2" />

            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={MENU_ITEM}
                onClick={closeMenu}
              >
                <span className="w-6 flex justify-center">
                  <SocialIconGraphic icon={link.icon} className="h-5 w-5" />
                </span>
                {link.label}
                <ExternalLinkIcon className="w-3.5 h-3.5 text-gray-500" />
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
