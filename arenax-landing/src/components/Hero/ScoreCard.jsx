import React, { useEffect, useState } from "react";
import { Trophy, Radio, ArrowUpRight } from "lucide-react";
import "./ScoreCard.css";

const FINAL_SCORE = { a: 2, b: 1 };

export default function ScoreCard({ loaded }) {
  const [score, setScore] = useState({ a: 0, b: 0 });

  // Animated count-up to the final score once the hero has loaded.
  useEffect(() => {
    if (!loaded) return;
    let frame = 0;
    const totalFrames = 20;

    const id = setInterval(() => {
      frame += 1;
      setScore({
        a: Math.min(FINAL_SCORE.a, Math.round((FINAL_SCORE.a * frame) / totalFrames)),
        b: Math.min(FINAL_SCORE.b, Math.round((FINAL_SCORE.b * frame) / totalFrames)),
      });
      if (frame >= totalFrames) clearInterval(id);
    }, 40);

    return () => clearInterval(id);
  }, [loaded]);

  return (
    <div className={`score-card cut ${loaded ? "is-loaded" : ""}`}>
      <div className="score-top">
        <span className="score-eyebrow mono-label">Valorant Championship</span>
        <span className="live-tag">
          <span className="dot" />
          Live
        </span>
      </div>

      <div className="score-title">Grand Final</div>

      <div className="teams-row">
        <div className="team">
          <div className="team-icon cut-sm">
            <Trophy size={20} color="var(--green)" />
          </div>
          <span className="team-name">Team Alpha</span>
        </div>

        <div className="score-num">
          <span className={score.a === FINAL_SCORE.a ? "win" : ""}>{score.a}</span>
          <span className="dash">–</span>
          <span>{score.b}</span>
        </div>

        <div className="team">
          <div className="team-icon cut-sm">
            <Radio size={18} color="var(--text-muted)" />
          </div>
          <span className="team-name">Team Nova</span>
        </div>
      </div>

      <button className="enter-btn">
        Enter Stream <ArrowUpRight size={15} />
      </button>
    </div>
  );
}
