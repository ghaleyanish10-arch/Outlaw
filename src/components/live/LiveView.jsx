import { useState } from "react";
import { ArrowLeft, Play, Radio } from "lucide-react";
import HudCard from "../common/HudCard.jsx";
import { LIVE_MATCHES } from "../../data/matches.js";

/**
 * Live/upcoming matches view. Main panel shows the selected match's stream
 * placeholder, score, and stat strip; sidebar lists every match.
 *
 * @param {(view: string) => void} nav
 * @param {object|null} initialMatch - preselected match (defaults to the first)
 */
export default function LiveView({ nav, initialMatch }) {
  const [activeMatch, setActiveMatch] = useState(initialMatch || LIVE_MATCHES[0]);

  return (
    <section className="section page-head-section">
      <button className="back-link" onClick={() => nav("home")}>
        <ArrowLeft size={14} /> BACK TO HOME
      </button>
      <div className="page-head">
        <h1 className="h2 big">LIVE BROADCASTS</h1>
        <p className="lede muted">Pick a match to follow the score, stats, and stream.</p>
      </div>

      <div className="live-layout">
        <HudCard className="player-card">
          <div className="player-stage">
            {activeMatch.live ? (
              <>
                <span className="badge-live absolute">LIVE</span>
                <div className="play-pulse">
                  <Play size={28} fill="currentColor" />
                </div>
                <span className="viewers">{activeMatch.viewers} watching</span>
              </>
            ) : (
              <div className="starts-at">
                <Radio size={22} />
                <span>Starts at {activeMatch.startsAt}</span>
              </div>
            )}
          </div>

          <div className="score-head">
            <span className="score-title">
              {activeMatch.game} — {activeMatch.round}
            </span>
          </div>
          <div className="score-row">
            <div className="score-team">
              <div className="team-avatar">{activeMatch.teamA[0]}</div>
              <span>{activeMatch.teamA}</span>
            </div>
            <div className="score-num">
              <span className="accent-text">{activeMatch.scoreA}</span>
              <span className="score-dash">–</span>
              {activeMatch.scoreB}
            </div>
            <div className="score-team">
              <div className="team-avatar">{activeMatch.teamB[0]}</div>
              <span>{activeMatch.teamB}</span>
            </div>
          </div>

          <div className="stat-strip">
            {activeMatch.stats.map(([label, value]) => (
              <div key={label} className="stat-cell">
                <span className="eyebrow">{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </HudCard>

        <div className="live-sidebar">
          <span className="eyebrow">ALL MATCHES</span>
          {LIVE_MATCHES.map((match) => (
            <button
              key={match.id}
              className={`match-row ${activeMatch.id === match.id ? "match-row-active" : ""}`}
              onClick={() => setActiveMatch(match)}
            >
              <span className={`dot ${match.live ? "dot-live" : "dot-idle"}`} />
              <div className="match-row-copy">
                <span className="match-row-title">
                  {match.game} · {match.round}
                </span>
                <span className="match-row-sub">
                  {match.teamA} vs {match.teamB}
                </span>
              </div>
              <span className="match-row-tag">
                {match.live ? `${match.scoreA}-${match.scoreB}` : match.startsAt}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
