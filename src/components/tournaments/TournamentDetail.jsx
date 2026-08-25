import { ArrowLeft, Calendar, Users, Swords, Gamepad2, Check } from "lucide-react";
import HudCard from "../common/HudCard.jsx";
import Tag from "../common/Tag.jsx";

/**
 * Full detail panel for a single tournament, including registration CTA.
 *
 * @param {object} t - tournament record
 * @param {() => void} onBack
 * @param {boolean} registered - whether the current user is registered
 * @param {() => void} onRegister
 */
export default function TournamentDetail({ t, onBack, registered, onRegister }) {
  const isInviteOnly = t.status === "Invite only";

  return (
    <section className="section page-head-section">
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={14} /> BACK TO TOURNAMENTS
      </button>

      <HudCard className="detail-card">
        <div className="detail-head">
          <div>
            <Tag>{t.tag}</Tag>
            <h1 className="h2">{t.title}</h1>
            <p className="lede muted">{t.desc}</p>
          </div>
          <div className="detail-prize">
            <span className="eyebrow">PRIZE POOL</span>
            <span className="accent-text big-num">{t.prize.replace(" PRIZE POOL", "")}</span>
          </div>
        </div>

        <div className="detail-stats">
          <div className="stat">
            <Calendar size={16} />
            <span>{t.date}</span>
          </div>
          <div className="stat">
            <Users size={16} />
            <span>{t.teams} teams</span>
          </div>
          <div className="stat">
            <Swords size={16} />
            <span>{t.format}</span>
          </div>
          <div className="stat">
            <Gamepad2 size={16} />
            <span>{t.game}</span>
          </div>
        </div>

        <div className="detail-footer">
          <span className={`status-pill ${isInviteOnly ? "muted-pill" : ""}`}>{t.status}</span>
          <button
            className={`btn ${registered ? "btn-outline" : "btn-primary"}`}
            disabled={isInviteOnly && !registered}
            onClick={onRegister}
          >
            {registered ? (
              <>
                <Check size={14} /> REGISTERED
              </>
            ) : isInviteOnly ? (
              "INVITE ONLY"
            ) : (
              "REGISTER NOW"
            )}
          </button>
        </div>
      </HudCard>
    </section>
  );
}
