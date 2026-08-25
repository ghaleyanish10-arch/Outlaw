import { ChevronRight } from "lucide-react";

/**
 * Slim ticker banner announcing the current headline live match.
 */
export default function LiveTicker({ onWatch }) {
  return (
    <div className="ticker">
      <div className="ticker-left">
        <span className="dot-live" />
        <span className="ticker-live-label">LIVE NOW</span>
        <span className="ticker-sep">·</span>
        <span className="ticker-text">
          VALORANT CHAMPIONSHIP: TEAM ALPHA <b>2</b> : <b>1</b> TEAM NOVA
        </span>
      </div>
      <button className="link-btn" onClick={onWatch}>
        WATCH LIVE <ChevronRight size={14} />
      </button>
    </div>
  );
}
