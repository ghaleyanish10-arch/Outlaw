import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="logo footer-logo">
        <span className="logo-dot" />
        ARENA<span className="logo-accent">X</span>
      </div>
      <span className="footer-text">© 2024 ArenaX. All rights reserved.</span>
    </footer>
  );
}
