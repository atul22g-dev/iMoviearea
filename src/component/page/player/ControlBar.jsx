import { memo } from "react";
import QualityMenu from "./QualityMenu";

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function fmt(seconds) {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ── SVG Icons ── */
const I = {
  Play: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="7,4 20,12 7,20" />
    </svg>
  ),
  Pause: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="3" width="5" height="18" rx="1" />
      <rect x="14" y="3" width="5" height="18" rx="1" />
    </svg>
  ),
  Prev: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" y1="19" x2="5" y2="5" />
    </svg>
  ),
  Next: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  ),
  VolumeHigh: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  VolumeLow: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  VolumeMute: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ),
  PiP: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <rect x="11" y="9" width="9" height="7" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  Fullscreen: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  ),
  ExitFullscreen: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  ),
};

const ControlBar = memo(function ControlBar({
  status, currentTime, duration, volume, muted, speed, isFullscreen,
  qualities, currentQuality, showSpeedMenu, showQualityMenu,
  onTogglePlay, onSkipPrev, onSkipNext, onToggleMute, onChangeVolume,
  onChangeSpeed, onToggleSpeedMenu, onToggleQualityMenu, onSelectQuality,
  onTogglePiP, onToggleFullscreen,
}) {
  const effectiveVolume = muted ? 0 : volume;
  const VolIcon = muted || volume === 0 ? I.VolumeMute : volume < 0.5 ? I.VolumeLow : I.VolumeHigh;

  return (
    <div className="vp__bar">
      <div className="vp__bar-left">
        <button className="vp__btn" onClick={onTogglePlay} title={status === "playing" ? "Pause (K)" : "Play (K)"}>
          {status === "playing" ? <I.Pause /> : <I.Play />}
        </button>
        <button className="vp__btn" onClick={onSkipPrev} title="Previous (J)"><I.Prev /></button>
        <button className="vp__btn" onClick={onSkipNext} title="Next (L)"><I.Next /></button>

        {/* Volume */}
        <div className="vp__vol">
          <button className="vp__btn" onClick={onToggleMute} title={muted ? "Unmute (M)" : "Mute (M)"}>
            <VolIcon />
          </button>
          <div className="vp__vol-slider">
            <input
              type="range"
              className="vp__vol-range"
              min="0" max="1" step="0.01"
              value={effectiveVolume}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              aria-label="Volume"
            />
          </div>
        </div>

        {/* Time */}
        <span className="vp__time">
          <span className="vp__time-cur">{fmt(currentTime)}</span>
          <span className="vp__time-sep">/</span>
          <span className="vp__time-dur">{fmt(duration)}</span>
        </span>
      </div>

      <div className="vp__bar-right">
        {/* Speed */}
        <div className="vp__speed-wrap">
          <button className="vp__btn vp__btn--label" onClick={onToggleSpeedMenu} title="Speed">
            <span className="vp__speed-text">{speed === 1 ? "1x" : `${speed}x`}</span>
          </button>
          {showSpeedMenu && (
            <div className="vp__speed-menu">
              {SPEEDS.map((r) => (
                <button key={r} className={`vp__speed-opt ${speed === r ? "vp__speed-opt--on" : ""}`} onClick={() => onChangeSpeed(r)}>
                  {r === 1 ? "Normal" : `${r}×`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quality */}
        <QualityMenu
          qualities={qualities}
          currentQuality={currentQuality}
          show={showQualityMenu}
          onToggle={onToggleQualityMenu}
          onSelect={onSelectQuality}
        />

        <button className="vp__btn" onClick={onTogglePiP} title="Picture-in-Picture"><I.PiP /></button>
        <button className="vp__btn" onClick={onToggleFullscreen} title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}>
          {isFullscreen ? <I.ExitFullscreen /> : <I.Fullscreen />}
        </button>
      </div>
    </div>
  );
});

export default ControlBar;
