import { useState } from "react";
import NavBar from "./components/layout/NavBar.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomeView from "./components/home/HomeView.jsx";
import TournamentsView from "./components/tournaments/TournamentsView.jsx";
import LiveView from "./components/live/LiveView.jsx";
import CommunityView from "./components/community/CommunityView.jsx";
import "./styles/global.css";

/**
 * Top-level app shell. Owns the (very lightweight, view-swap based) routing
 * state and the cross-view state that needs to survive navigation:
 * a pending tournament/match to deep-link into, and the set of tournament
 * ids the user has registered for.
 */
export default function ApexArena() {
  const [view, setView] = useState("home");
  const [pendingTournament, setPendingTournament] = useState(null);
  const [pendingMatch, setPendingMatch] = useState(null);
  const [registered, setRegistered] = useState(new Set());

  function nav(nextView) {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openTournament(tournament) {
    setPendingTournament(tournament);
    setView("tournaments");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleRegister(id) {
    setRegistered((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="app">
      <NavBar view={view} nav={nav} />

      {view === "home" && <HomeView nav={nav} openTournament={openTournament} />}
      {view === "tournaments" && (
        <TournamentsView
          nav={nav}
          initialTournament={pendingTournament}
          registered={registered}
          toggleRegister={toggleRegister}
        />
      )}
      {view === "live" && <LiveView nav={nav} initialMatch={pendingMatch} />}
      {view === "community" && <CommunityView nav={nav} />}

      <Footer />
    </div>
  );
}
