import React, { useEffect, useState } from "react";
import { Play, ArrowRight } from "lucide-react";
import ScoreCard from "./ScoreCard.jsx";
import "./Hero.css";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="beam b1" />
      <div className="beam b2" />
      <div className="beam b3" />

      <div className={`hero-content ${loaded ? "is-loaded" : ""}`}>
        <span className="badge">
          <span className="dot" />
          Season 2024 Now Live
        </span>

        <h1 className="hero-title display">
          THE NEXT
          <br />
          GENERATION OF
          <br />
          ESPORTS
          <br />
          <span className="accent">STARTS HERE.</span>
        </h1>

        <p className="hero-sub">Compete. Watch. Rise.</p>

        <div className="btn-row">
          <button className="btn btn-primary cut-sm">
            Explore Tournaments <ArrowRight size={15} />
          </button>
          <button className="btn btn-ghost cut-sm">
            <Play size={13} fill="currentColor" /> Watch Live
          </button>
        </div>
      </div>

      <ScoreCard loaded={loaded} />
    </section>
  );
}
