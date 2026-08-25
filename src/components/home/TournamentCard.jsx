import { Gamepad2 } from "lucide-react";
import HudCard from "../common/HudCard.jsx";
import Tag from "../common/Tag.jsx";

/**
 * Compact preview card for a single tournament.
 *
 * @param {object} t - tournament record
 * @param {() => void} onOpen - opens the tournament detail view
 */
export default function TournamentCard({ t, onOpen }) {
  return (
    <HudCard className="t-card">
      <div className="t-thumb">
        <Tag>{t.tag}</Tag>
        <div className="t-thumb-glow" />
        <Gamepad2 className="t-thumb-icon" size={28} />
      </div>
      <div className="t-body">
        <h3 className="t-title">{t.title}</h3>
        <p className="t-desc">{t.desc}</p>
        <div className="t-meta">
          <span>{t.date}</span>
          <span className="accent-text">{t.prize}</span>
        </div>
        <button className="btn btn-outline btn-block btn-sm" onClick={onOpen}>
          VIEW DETAILS
        </button>
      </div>
    </HudCard>
  );
}
