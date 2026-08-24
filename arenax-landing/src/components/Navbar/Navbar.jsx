import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../../data/constants.js";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="logo">
          <span className="logo-dot" />
          ARENA<span className="logo-accent">X</span>
        </div>

        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="nav-link">
              {link}
            </a>
          ))}
        </div>

        <button className="burger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-top">
            <button className="burger burger-visible" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={26} />
            </button>
          </div>
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" onClick={() => setMenuOpen(false)}>
              {link}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
