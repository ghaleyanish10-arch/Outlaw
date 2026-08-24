import React from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "../Reveal.jsx";
import TournamentCard from "./TournamentCard.jsx";
import { TOURNAMENTS } from "../../data/constants.js";
import "./Tournaments.css";

export default function Tournaments() {
  return (
    <section className="section">
      <Reveal className="section-head">
        <h2 className="section-title display">Upcoming Tournaments</h2>
        <a href="#" className="view-all">
          View All <ArrowRight size={14} />
        </a>
      </Reveal>

      <div className="card-grid">
        {TOURNAMENTS.map((tournament, i) => (
          <Reveal key={tournament.title} delay={i * 90}>
            <TournamentCard tournament={tournament} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
