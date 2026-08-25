import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  ["home", "HOME"],
  ["tournaments", "TOURNAMENTS"],
  ["live", "LIVE"],
  ["community", "COMMUNITY"],
];

/**
 * App-wide sticky header. Collapses into a burger menu on small screens.
 *
 * @param {"home"|"tournaments"|"live"|"community"} view - currently active route
 * @param {(view: string) => void} nav - navigation callback
 */
export default function NavBar({ view, nav }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleNav(target) {
    nav(target);
    setIsMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button className="brand" onClick={() => nav("home")}>
          <span className="brand-mark">▲</span> APEX ARENA
        </button>

        <nav className="nav-links">
          {NAV_LINKS.map(([key, label]) => (
            <button
              key={key}
              className={`nav-link ${view === key ? "active" : ""}`}
              onClick={() => nav(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <button className="btn btn-primary btn-sm nav-cta" onClick={() => nav("community")}>
          JOIN
        </button>

        <button className="burger" aria-label="Menu" onClick={() => setIsMenuOpen((open) => !open)}>
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map(([key, label]) => (
            <button
              key={key}
              className={`nav-link ${view === key ? "active" : ""}`}
              onClick={() => handleNav(key)}
            >
              {label}
            </button>
          ))}
          <button className="btn btn-primary btn-sm" onClick={() => handleNav("community")}>
            JOIN
          </button>
        </div>
      )}
    </header>
  );
}
