import { Play, ChevronRight } from "lucide-react";
import HudCard from "../common/HudCard.jsx";
import LiveTicker from "../common/LiveTicker.jsx";
import TournamentCard from "./TournamentCard.jsx";
import { TOURNAMENTS } from "../../data/tournaments.js";
import { GAMES } from "../../data/games.js";

const FEATURED_COUNT = 3;

/**
 * Landing page: hero banner, headline live score, featured tournaments,
 * supported titles band, and a closing call-to-action.
 *
 * @param {(view: string) => void} nav
 * @param {(tournament: object) => void} openTournament
 */
export default function HomeView({ nav, openTournament }) {
  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-inner">
          <div className="hero-copy">
            <h1 className="display">
              THE NEXT
              <br />
              GENERATION OF
              <br />
              ESPORTS
              <br />
              <span className="accent-text">STARTS HERE.</span>
            </h1>
            <p className="lede">Compete. Watch. Rise.</p>
            <div className="btn-row">
              <button className="btn btn-primary" onClick={() => nav("tournaments")}>
                EXPLORE TOURNAMENTS
              </button>
              <button className="btn btn-outline" onClick={() => nav("live")}>
                <Play size={14} fill="currentColor" /> WATCH LIVE
              </button>
            </div>
          </div>

          <HudCard className="score-card">
            <div className="score-head">
              <span className="score-title">VALORANT CHAMPIONSHIP</span>
              <span className="badge-live">LIVE</span>
            </div>
            <div className="score-round">GRAND FINAL</div>
            <div className="score-row">
              <div className="score-team">
                <div className="team-avatar">A</div>
                <span>TEAM ALPHA</span>
              </div>
              <div className="score-num">
                <span className="accent-text">2</span>
                <span className="score-dash">–</span>1
              </div>
              <div className="score-team">
                <div className="team-avatar">N</div>
                <span>TEAM NOVA</span>
              </div>
            </div>
            <button className="btn btn-block" onClick={() => nav("live")}>
              ENTER STREAM
            </button>
          </HudCard>
        </div>
      </section>

      <LiveTicker onWatch={() => nav("live")} />

      <section className="section">
        <div className="section-head">
          <h2 className="h2">FEATURED TOURNAMENTS</h2>
          <button className="link-btn" onClick={() => nav("tournaments")}>
            VIEW ALL <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-3">
          {TOURNAMENTS.slice(0, FEATURED_COUNT).map((tournament) => (
            <TournamentCard
              key={tournament.id}
              t={tournament}
              onOpen={() => openTournament(tournament, "tournaments")}
            />
          ))}
        </div>
      </section>

      <section className="titles-band">
        <span className="eyebrow">SUPPORTED TITLES</span>
        <div className="titles-row">
          {GAMES.map((game) => (
            <span key={game} className="title-name">
              {game}
            </span>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <h2 className="h2 big">READY TO COMPETE?</h2>
        <p className="lede muted">
          Join thousands of players and teams competing daily. Your legacy starts here.
        </p>
        <button className="btn btn-primary" onClick={() => nav("community")}>
          JOIN THE COMMUNITY
        </button>
      </section>
    </>
  );
}
