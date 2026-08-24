import React from "react";
import { TITLES } from "../../data/constants.js";
import "./SupportedTitles.css";

export default function SupportedTitles() {
  return (
    <section className="titles-section">
      <div className="titles-label mono-label">Supported Titles</div>
      <div className="titles-row">
        {TITLES.map((title) => (
          <span key={title} className="title-item">
            {title}
          </span>
        ))}
      </div>
    </section>
  );
}
