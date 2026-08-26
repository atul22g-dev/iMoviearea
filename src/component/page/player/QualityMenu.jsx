import { memo } from "react";

function getQualityTier(height) {
  if (height >= 1080) return { tier: "Full HD", color: "#34d399", bgColor: "rgba(52,211,153,0.15)" };
  if (height >= 720) return { tier: "HD", color: "#818cf8", bgColor: "rgba(129,140,248,0.15)" };
  if (height >= 480) return { tier: "SD", color: "#fbbf24", bgColor: "rgba(251,191,36,0.15)" };
  return { tier: "Low", color: "#94a3b8", bgColor: "rgba(148,163,184,0.15)" };
}

const QualityMenu = memo(function QualityMenu({ qualities, currentQuality, show, onToggle, onSelect }) {
  const currentTier = currentQuality ? getQualityTier(currentQuality.height) : null;

  if (qualities.length === 0) return null;

  return (
    <div className="vp__speed-wrap">
      <button
        className={`vp__btn vp__btn--label vp__quality-trigger ${show ? "vp__quality-trigger--active" : ""}`}
        onClick={onToggle}
        title="Quality"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span className="vp__quality-badge" style={{ color: currentTier?.color || "#fff", background: currentTier?.bgColor || "rgba(255,255,255,0.1)" }}>
          {currentQuality?.label || "Auto"}
        </span>
      </button>

      {show && (
        <div className="vp__quality-popup" onClick={(e) => e.stopPropagation()}>
          <div className="vp__quality-popup__header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Quality</span>
          </div>
          <div className="vp__quality-popup__list">
            {qualities.map((q) => {
              const isActive = currentQuality?.label === q.label;
              const tier = getQualityTier(q.height);
              return (
                <button
                  key={q.label}
                  className={`vp__quality-option ${isActive ? "vp__quality-option--active" : ""}`}
                  onClick={() => onSelect(q)}
                >
                  <div className="vp__quality-option__left">
                    <div className="vp__quality-option__indicator" style={{ borderColor: isActive ? tier.color : "rgba(255,255,255,0.15)", background: isActive ? tier.color : "transparent" }}>
                      {isActive && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div className="vp__quality-option__info">
                      <span className="vp__quality-option__label">{q.label}</span>
                    </div>
                  </div>
                  {isActive && (
                    <span className="vp__quality-option__current" style={{ color: tier.color }}>Now</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

export default QualityMenu;
