import React from "react";
import Reveal from "../Reveal.jsx";
import "./CTA.css";

export default function CTA() {
  return (
    <section className="cta-section">
      <Reveal>
        <h2 className="cta-title display">Ready To Compete?</h2>
        <p className="cta-sub">
          Join thousands of players and teams competing daily. Your legacy starts here.
        </p>
        <button className="btn btn-primary cut-sm">Join The Community</button>
      </Reveal>
    </section>
  );
}
