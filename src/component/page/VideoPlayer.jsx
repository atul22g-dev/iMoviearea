import useVideoPlayer from "./player/useVideoPlayer";
import Seekbar from "./player/Seekbar";
import ControlBar from "./player/ControlBar";

/* ── Loading spinner icon ── */
const LoadingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" className="vp-spin">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="42" strokeDashoffset="11" strokeLinecap="round" />
  </svg>
);

/* ══════════════════════════════════════════════
   VIDEO PLAYER — thin wrapper over useVideoPlayer hook
   ══════════════════════════════════════════════ */

const VideoPlayer = ({ src, poster, title, onEnded }) => {
  const vp = useVideoPlayer({ src, poster, onEnded });

  if (!src) {
    return (
      <div className="vp vp--empty">
        <div className="vp__screen">
          <div className="vp__empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.15 }}>
              <rect x="2" y="2" width="20" height="20" rx="2.18" />
              <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
            <p>No video available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`vp ${vp.isFullscreen ? "vp--fs" : ""} ${vp.showCtrl ? "vp--show" : ""}`}
      ref={vp.containerRef}
      onMouseMove={vp.resetHideTimer}
      onMouseLeave={() => { if (vp.status === "playing" && !vp.showSpeedMenu && !vp.showQualityMenu) vp.resetHideTimer(); }}
      onTouchEnd={vp.handleTouchEnd}
    >
      {/* eslint-disable-next-line react-doctor/no-static-element-interactions -- Screen click handler: catches bubbled clicks for play/pause toggle */}
      <div className="vp__screen" onClick={vp.handleScreenClick} onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); vp.handleScreenClick(); } }}>
        {vp.status === "loading" && (
          <div className="vp__overlay vp__overlay--loading"><LoadingIcon /><span>Loading video…</span></div>
        )}

        {vp.status === "error" && (
          <div className="vp__overlay vp__overlay--error">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span>Failed to load video</span>
            {poster && <span className="vp__error-hint">Poster shown as fallback</span>}
          </div>
        )}

        {vp.status !== "playing" && vp.status !== "loading" && poster && (
          <img src={poster} alt="" className="vp__poster" />
        )}

        {vp.videoSrc && (
          <video
            ref={vp.videoRef}
            className="vp__video"
            src={vp.videoSrc}
            poster={poster || undefined}
            preload="metadata"
            playsInline
            onTimeUpdate={vp.onTimeUpdate}
            onPlay={vp.onPlay}
            onPause={vp.onPause}
            onLoadedMetadata={vp.onLoadedMetadata}
            onEnded={vp.onEnded}
            onError={vp.onError}
            onWaiting={() => vp.setStatus?.("loading")}
            onCanPlay={() => vp.setStatus?.((prev) => prev === "loading" ? "paused" : prev)}
          />
        )}

        {(vp.status === "ready" || vp.status === "paused") && (
          <div className="vp__play-overlay">
            <div className="vp__play-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="7,4 20,12 7,20" /></svg>
            </div>
          </div>
        )}

        {vp.gestureIcon && (
          <div className="vp__gesture">
            <div className="vp__gesture-bubble">
              {vp.gestureIcon === "play" && <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="7,4 20,12 7,20" /></svg>}
              {vp.gestureIcon === "pause" && <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="5" height="18" rx="1" /><rect x="14" y="3" width="5" height="18" rx="1" /></svg>}
              {vp.gestureIcon === "rewind" && <><span className="vp__gesture-skip">10</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg></>}
              {vp.gestureIcon === "forward" && <><span className="vp__gesture-skip">10</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg></>}
            </div>
          </div>
        )}

        {vp.doubleTap && (
          <div className={`vp__doubletap vp__doubletap--${vp.doubleTap}`}>
            <div className="vp__doubletap-bubble">{vp.doubleTap === "left" ? "−10s" : "+10s"}</div>
          </div>
        )}

        <div className="vp__bottom">
          <Seekbar
            ref={vp.seekRef}
            progress={vp.progress}
            buffered={vp.buffered}
            isSeeking={vp.isSeeking}
            seekPreview={vp.seekPreview}
            seekHoverPos={vp.seekHoverPos}
            seekHoverTime={vp.seekHoverTime}
            onMouseDown={vp.handleSeekStart}
            onMouseMove={vp.handleSeekMove}
            onMouseLeave={() => { vp.setSeekHoverPos?.(null); vp.setSeekHoverTime?.(null); }}
            onKeyDown={(e) => {
              const vid = vp.videoRef.current;
              if (!vid) return;
              if (e.key === "ArrowLeft") { e.preventDefault(); vid.currentTime = Math.max(0, vid.currentTime - 5); }
              if (e.key === "ArrowRight") { e.preventDefault(); vid.currentTime = Math.min(vid.duration || 0, vid.currentTime + 5); }
            }}
          />

          <ControlBar
            status={vp.status}
            currentTime={vp.currentTime}
            duration={vp.duration}
            volume={vp.volume}
            muted={vp.muted}
            speed={vp.speed}
            isFullscreen={vp.isFullscreen}
            qualities={vp.qualities}
            currentQuality={vp.currentQuality}
            showSpeedMenu={vp.showSpeedMenu}
            showQualityMenu={vp.showQualityMenu}
            onTogglePlay={vp.togglePlay}
            onSkipPrev={vp.skipPrev}
            onSkipNext={vp.skipNext}
            onToggleMute={vp.toggleMute}
            onChangeVolume={vp.changeVolume}
            onChangeSpeed={vp.changeSpeed}
            onToggleSpeedMenu={() => { vp.setShowSpeedMenu?.(!vp.showSpeedMenu); vp.setShowQualityMenu?.(false); }}
            onToggleQualityMenu={() => { vp.setShowQualityMenu?.(!vp.showQualityMenu); vp.setShowSpeedMenu?.(false); }}
            onSelectQuality={vp.changeQuality}
            onTogglePiP={vp.togglePiP}
            onToggleFullscreen={vp.toggleFullscreen}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
