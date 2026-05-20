import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav ref={menuRef} className="bg-gray-900/80 text-white fixed w-full top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 flex justify-between items-center h-14 sm:h-16">
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
          <h1 className="nav-glow text-lg sm:text-xl md:text-2xl font-bold">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 md:gap-4" onClick={closeMenu}>
              <img src="/navbar/logo.webp" alt="Logo" className="h-6 sm:h-7 md:h-8"/>
              <span className="hidden sm:inline">Tom Concannon</span>
            </Link>
          </h1>
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className={`nav-glow ${location.pathname === '/' ? 'opacity-100' : ''}`}>Home</Link>
            <Link to="/projects" className={`nav-glow ${location.pathname === '/projects' ? 'opacity-100' : ''}`}>Projects</Link>
            {/* <Link to="/gallery" className="nav-glow">Gallery</Link> */}
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          {/* Social Icons */}
          <a 
            href="https://www.linkedin.com/in/thomascon/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-glow cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>

          <a 
            href="https://github.com/tconcan" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-glow cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-3 py-4 space-y-3">
            <Link
              to="/"
              className={`block nav-glow py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-base ${location.pathname === '/' ? 'opacity-100' : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/projects"
              className={`block nav-glow py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-base ${location.pathname === '/projects' ? 'opacity-100' : ''}`}
              onClick={closeMenu}
            >
              Projects
            </Link>
            {/* <a
              href="#gallery"
              className="block nav-glow py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-base"
              onClick={closeMenu}
            >
              Gallery
            </a> */}
          </div>
        </div>
      )}
    </nav>
  );
}
  
export default Navbar;