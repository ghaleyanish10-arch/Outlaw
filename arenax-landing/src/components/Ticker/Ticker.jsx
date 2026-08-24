import React from "react";
import "./Ticker.css";

export default function Ticker() {
  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {/* content is duplicated so the marquee loop has no visible seam */}
        {[0, 1].map((copy) => (
          <React.Fragment key={copy}>
            <span className="ticker-item">
              <span className="live-dot" />
              Live Now
            </span>
            <span className="ticker-item">
              Valorant Championship: <strong>Team A 1 : 0 Team B</strong>
            </span>
            <span className="ticker-item">
              <a href="#">Watch Live →</a>
            </span>
            <span className="ticker-item">EU Masters registration closes in 3 days</span>
            <span className="ticker-item">World Invitational prize pool now $250,000</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
