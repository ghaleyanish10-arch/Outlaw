import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import TournamentCard from "../home/TournamentCard.jsx";
import TournamentDetail from "./TournamentDetail.jsx";
import { TOURNAMENTS } from "../../data/tournaments.js";

const FILTERS = ["ALL", "REGIONAL", "GLOBAL", "AMATEUR"];

/**
 * Browsable, filterable list of all tournaments. Renders the detail view
 * in-place once a tournament is selected.
 *
 * @param {(view: string) => void} nav
 * @param {object|null} initialTournament - preselected tournament (e.g. from Home)
 * @param {Set<string>} registered - ids of tournaments the user has registered for
 * @param {(id: string) => void} toggleRegister
 */
export default function TournamentsView({ nav, initialTournament, registered, toggleRegister }) {
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initialTournament || null);

  const filteredTournaments = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return TOURNAMENTS.filter((t) => {
      const matchesFilter = filter === "ALL" || t.tag === filter;
      const matchesQuery = (t.title + t.game).toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  if (selected) {
    return (
      <TournamentDetail
        t={selected}
        onBack={() => setSelected(null)}
        registered={registered.has(selected.id)}
        onRegister={() => toggleRegister(selected.id)}
      />
    );
  }

  return (
    <section className="section page-head-section">
      <button className="back-link" onClick={() => nav("home")}>
        <ArrowLeft size={14} /> BACK TO HOME
      </button>
      <div className="page-head">
        <h1 className="h2 big">TOURNAMENTS</h1>
        <p className="lede muted">Browse every bracket running this season and lock in your seat.</p>
      </div>

      <div className="toolbar">
        <div className="filter-row">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`chip ${filter === f ? "chip-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="search-box">
          <Search size={15} />
          <input
            placeholder="Search tournaments or games…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredTournaments.length === 0 ? (
        <div className="empty-state">No tournaments match that search. Try another filter.</div>
      ) : (
        <div className="grid grid-3">
          {filteredTournaments.map((t) => (
            <TournamentCard key={t.id} t={t} onOpen={() => setSelected(t)} />
          ))}
        </div>
      )}
    </section>
  );
}
