import React from "react";
import { Trophy } from "lucide-react";
import "./TournamentCard.css";

export default function TournamentCard({ tournament }) {
  const { tag, title, desc, date, prize } = tournament;

  return (
    <div className="t-card cut">
      <div className="t-thumb">
        <span className="t-tag">{tag}</span>
        <div className="t-thumb-icon">
          <Trophy size={16} />
        </div>
      </div>

      <div className="t-body">
        <div className="t-title">{title}</div>
        <p className="t-desc">{desc}</p>
        <div className="t-meta">
          <span className="date">{date}</span>
          <span className="prize">{prize}</span>
        </div>
      </div>
    </div>
  );
}
