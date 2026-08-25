/**
 * Generic card shell with the corner-bracket "HUD" accent used across the app
 * (score card, tournament card, detail panels, forms…).
 */
export default function HudCard({ children, className = "", ...rest }) {
  return (
    <div className={`hud-card ${className}`} {...rest}>
      <span className="hud-corner tl" />
      <span className="hud-corner tr" />
      <span className="hud-corner bl" />
      <span className="hud-corner br" />
      {children}
    </div>
  );
}
