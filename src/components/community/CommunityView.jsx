import { useState } from "react";
import { ArrowLeft, Check, Mail, Globe2 } from "lucide-react";
import HudCard from "../common/HudCard.jsx";
import { PERKS } from "../../data/perks.js";

const REGIONS = ["Europe", "North America", "Asia-Pacific", "South America", "MENA"];

/**
 * Community sign-up view: perks + stats on one side, a validated sign-up
 * form on the other. Swaps to a confirmation panel on successful submit.
 *
 * @param {(view: string) => void} nav
 */
export default function CommunityView({ nav }) {
  const [form, setForm] = useState({ name: "", email: "", region: "Europe" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Enter your display name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="section page-head-section">
        <HudCard className="confirm-card">
          <div className="confirm-icon">
            <Check size={26} />
          </div>
          <h1 className="h2">WELCOME TO THE ARENA, {form.name.toUpperCase()}</h1>
          <p className="lede muted">
            A confirmation has been sent to {form.email}. Your {form.region} region roster is ready.
          </p>
          <div className="btn-row center">
            <button className="btn btn-primary" onClick={() => nav("tournaments")}>
              BROWSE TOURNAMENTS
            </button>
            <button className="btn btn-outline" onClick={() => nav("home")}>
              BACK TO HOME
            </button>
          </div>
        </HudCard>
      </section>
    );
  }

  return (
    <section className="section page-head-section">
      <button className="back-link" onClick={() => nav("home")}>
        <ArrowLeft size={14} /> BACK TO HOME
      </button>
      <div className="page-head">
        <h1 className="h2 big">JOIN THE COMMUNITY</h1>
        <p className="lede muted">Create a free account to register teams, chat, and go live.</p>
      </div>

      <div className="community-layout">
        <div className="perks-col">
          <div className="stats-row">
            <div className="stat-block">
              <span className="accent-text big-num">12,400</span>
              <span className="eyebrow">MEMBERS</span>
            </div>
            <div className="stat-block">
              <span className="accent-text big-num">340</span>
              <span className="eyebrow">TEAMS</span>
            </div>
            <div className="stat-block">
              <span className="accent-text big-num">58</span>
              <span className="eyebrow">COUNTRIES</span>
            </div>
          </div>
          <div className="perks-grid">
            {PERKS.map((perk) => (
              <HudCard key={perk.title} className="perk-card">
                <perk.icon size={18} />
                <h3>{perk.title}</h3>
                <p className="muted">{perk.body}</p>
              </HudCard>
            ))}
          </div>
        </div>

        <HudCard className="form-card">
          <form onSubmit={handleSubmit}>
            <label className="field">
              <span>Display name</span>
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. shadowfrag"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>
            <label className="field">
              <span>Email</span>
              <input
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>
            <label className="field">
              <span>Region</span>
              <select value={form.region} onChange={(e) => updateField("region", e.target.value)}>
                {REGIONS.map((region) => (
                  <option key={region}>{region}</option>
                ))}
              </select>
            </label>
            <button className="btn btn-primary btn-block" type="submit">
              <Mail size={14} /> CREATE FREE ACCOUNT
            </button>
            <p className="fine-print">
              <Globe2 size={12} /> Available worldwide, no payment required.
            </p>
          </form>
        </HudCard>
      </div>
    </section>
  );
}
