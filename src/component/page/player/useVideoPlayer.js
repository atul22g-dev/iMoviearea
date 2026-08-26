import { useState, useCallback, useEffect, useRef } from "react";

/* ── Helpers ── */

function getWistiaHash(url) {
  if (!url) return null;
  const m = url.match(/wistia\.net\/embed\/iframe\/([a-z0-9]+)/i)
    || url.match(/wistia\.com\/medias\/([a-z0-9]+)/i)
    || url.match(/wistia\.net\/iframe\/([a-z0-9]+)/i);
  return m ? m[1] : null;
}

async function fetchWistiaQualities(watchUrl, signal) {
  const hash = getWistiaHash(watchUrl);
  if (!hash) return null;

  try {
    const embedUrl = `https://fast.wistia.net/embed/iframe/${hash}`;
    const res = await fetch(embedUrl, { signal });
    if (!res.ok) return null;
    const html = await res.text();

    const initMatch = html.match(/W\.iframeInit\((\{.*?\})\s*,\s*\{[^}]*\}\)/s);
    if (!initMatch) return null;

    const data = JSON.parse(initMatch[1]);
    if (!data.assets || data.assets.length === 0) return null;

    const qualities = data.assets.reduce((acc, a) => {
      if (a.container === "mp4" && a.url) {
        acc.push({
          label: a.display_name || `${a.height}p`,
          height: a.height || 0,
          width: a.width || 0,
          url: a.url,
          bitrate: a.bitrate || 0,
        });
      }
      return acc;
    }, []).sort((a, b) => b.height - a.height);

    return qualities.length > 0 ? qualities : null;
  } catch (e) {
    console.warn("Failed to fetch Wistia qualities:", e);
    return null;
  }
}

/* ══════════════════════════════════════════════
   useVideoPlayer — all state, refs, effects, and callbacks
   ══════════════════════════════════════════════ */

export default function useVideoPlayer({ src, poster, onEnded }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const seekRef = useRef(null);
  const hideTimer = useRef(null);
  const lastTapRef = useRef(0);

  const [status, setStatus] = useState("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const prevVolumeRef = useRef(0.8);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [seekHoverPos, setSeekHoverPos] = useState(null);
  const [seekHoverTime, setSeekHoverTime] = useState(null);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreview, setSeekPreview] = useState(null);
  const [gestureIcon, setGestureIcon] = useState(null);
  const [doubleTap, setDoubleTap] = useState(null);

  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(null);
  const [videoSrc, setVideoSrc] = useState(src);

  /* ── Close menus on outside click ── */
  useEffect(() => {
    if (!showQualityMenu && !showSpeedMenu) return;
    const handler = (e) => {
      if (!e.target.closest(".vp__speed-wrap")) {
        setShowQualityMenu(false);
        setShowSpeedMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showQualityMenu, showSpeedMenu]);

  /* ── Fetch Wistia qualities on mount ── */
  // eslint-disable-next-line react-doctor/no-fetch-in-effect -- One-shot fetch with AbortController cleanup; no data-fetching library in this small project
  useEffect(() => {
    if (!src) return;
    setStatus("loading");

    const controller = new AbortController();
    const hash = getWistiaHash(src);
    if (hash) {
      fetchWistiaQualities(src, controller.signal)
        .then((q) => {
          if (q && q.length > 0) {
            setQualities(q);
            setCurrentQuality(q[0]);
            setVideoSrc(q[0].url);
          } else {
            setVideoSrc(`https://fast.wistia.net/embed/iframe/${hash}`);
          }
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setVideoSrc(`https://fast.wistia.net/embed/iframe/${hash}`);
        });
    } else {
      setVideoSrc(src);
    }
    return () => controller.abort();
  }, [src]);

  /* ── Controls auto-hide ── */
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    if (videoRef.current && !videoRef.current.paused) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 3500);
    }
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimer.current);
  }, [status, resetHideTimer]);

  /* ── Fullscreen listener ── */
  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  /* ── Gesture helper ── */
  const showGesture = useCallback((type) => {
    setGestureIcon(type);
    setTimeout(() => setGestureIcon(null), 600);
  }, []);

  /* ── Controls ── */
  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) { vid.play().catch(() => {}); showGesture("play"); }
    else { vid.pause(); showGesture("pause"); }
  }, [showGesture]);

  const toggleMute = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (muted) { vid.muted = false; vid.volume = prevVolumeRef.current || 0.8; setVolume(prevVolumeRef.current || 0.8); setMuted(false); }
    else { prevVolumeRef.current = volume; vid.muted = true; setMuted(true); }
  }, [muted, volume]);

  const changeVolume = useCallback((val) => {
    const vid = videoRef.current;
    const c = Math.max(0, Math.min(1, val));
    if (vid) { vid.volume = c; vid.muted = c === 0; }
    setVolume(c); setMuted(c === 0);
  }, []);

  const changeSpeed = useCallback((rate) => {
    const vid = videoRef.current;
    if (vid) vid.playbackRate = rate;
    setSpeed(rate); setShowSpeedMenu(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  }, []);

  const togglePiP = useCallback(async () => {
    const vid = videoRef.current;
    if (!vid) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else if (vid.requestPictureInPicture) await vid.requestPictureInPicture();
    } catch {}
  }, []);

  const skipPrev = useCallback(() => {
    const vid = videoRef.current;
    if (vid) { vid.currentTime = Math.max(0, vid.currentTime - 30); showGesture("rewind"); }
  }, [showGesture]);

  const skipNext = useCallback(() => {
    const vid = videoRef.current;
    if (vid) { vid.currentTime = Math.min(vid.duration || 0, vid.currentTime + 30); showGesture("forward"); }
  }, [showGesture]);

  /* ── Quality change ── */
  const changeQuality = useCallback((quality) => {
    const vid = videoRef.current;
    const currentTimeSaved = vid ? vid.currentTime : 0;
    const wasPlaying = vid ? !vid.paused : false;

    setCurrentQuality(quality);
    setVideoSrc(quality.url);
    setShowQualityMenu(false);

    const onCanPlay = () => {
      const v = videoRef.current;
      if (v) {
        v.currentTime = currentTimeSaved;
        if (wasPlaying) v.play().catch(() => {});
      }
      v?.removeEventListener("canplay", onCanPlay);
    };
    vid?.addEventListener("canplay", onCanPlay);
  }, []);

  /* ── Video events ── */
  const onTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || isSeeking) return;
    setCurrentTime(vid.currentTime);
    if (vid.buffered.length > 0) setBuffered((vid.buffered.end(vid.buffered.length - 1) / vid.duration) * 100);
  }, [isSeeking]);

  const onPlay = useCallback(() => { setStatus("playing"); resetHideTimer(); }, [resetHideTimer]);
  const onPause = useCallback(() => { setStatus("paused"); setControlsVisible(true); clearTimeout(hideTimer.current); }, []);
  const onLoadedMetadata = useCallback(() => {
    const vid = videoRef.current;
    if (vid) {
      setDuration(vid.duration);
      vid.volume = muted ? 0 : volume;
      setStatus("ready");
    }
  }, [volume, muted]);
  const onEnded2 = useCallback(() => { setStatus("paused"); setControlsVisible(true); if (onEnded) onEnded(); }, [onEnded]);
  const onError = useCallback(() => setStatus("error"), []);

  /* ── Seeking ── */
  const handleSeekStart = useCallback((e) => {
    if (!seekRef.current || !videoRef.current) return;
    setIsSeeking(true);
    const rect = seekRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setSeekPreview(pct);
    setCurrentTime(pct * (videoRef.current.duration || 0));
  }, []);

  const handleSeekMove = useCallback((e) => {
    if (!seekRef.current || !videoRef.current) return;
    const rect = seekRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setSeekHoverPos(pct * 100);
    setSeekHoverTime(pct * (videoRef.current.duration || 0));
    if (isSeeking) { setSeekPreview(pct); setCurrentTime(pct * (videoRef.current.duration || 0)); }
  }, [isSeeking]);

  const handleSeekEnd = useCallback((e) => {
    if (!seekRef.current || !videoRef.current || !isSeeking) return;
    const rect = seekRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pct * (videoRef.current.duration || 0);
    setIsSeeking(false); setSeekPreview(null); setSeekHoverPos(null); setSeekHoverTime(null);
  }, [isSeeking]);

  useEffect(() => {
    if (isSeeking) {
      const onMove = (e) => handleSeekMove(e);
      const onUp = (e) => handleSeekEnd(e);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    }
  }, [isSeeking, handleSeekMove, handleSeekEnd]);

  /* ── Touch / screen click ── */
  const handleTouchEnd = useCallback((e) => {
    const now = Date.now();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.changedTouches?.[0]?.clientX ?? e.clientX;
    const side = x < rect.left + rect.width / 2 ? "left" : "right";
    if (now - lastTapRef.current < 300) {
      const vid = videoRef.current;
      if (vid) vid.currentTime = side === "left" ? Math.max(0, vid.currentTime - 10) : Math.min(vid.duration || 0, vid.currentTime + 10);
      setDoubleTap(side); setTimeout(() => setDoubleTap(null), 500);
    } else {
      if (status === "ready" || status === "playing" || status === "paused") togglePlay();
    }
    lastTapRef.current = now;
  }, [status, togglePlay]);

  const handleScreenClick = useCallback(() => {
    if (status === "loading" || status === "idle" || status === "error") return;
    togglePlay();
  }, [status, togglePlay]);

  /* ── Keyboard ── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const vid = videoRef.current;
      if (!vid) return;
      switch (e.key) {
        case " ": case "k": e.preventDefault(); vid.paused ? vid.play() : vid.pause(); break;
        case "f": e.preventDefault(); toggleFullscreen(); break;
        case "m": e.preventDefault(); toggleMute(); break;
        case "j": case "ArrowLeft":
          e.preventDefault(); vid.currentTime = Math.max(0, vid.currentTime - (e.key === "j" ? 10 : 5)); showGesture("rewind"); break;
        case "l": case "ArrowRight":
          e.preventDefault(); vid.currentTime = Math.min(vid.duration || 0, vid.currentTime + (e.key === "l" ? 10 : 5)); showGesture("forward"); break;
        case "ArrowUp": e.preventDefault(); changeVolume(Math.min(1, (muted ? 0 : volume) + 0.1)); break;
        case "ArrowDown": e.preventDefault(); changeVolume(Math.max(0, (muted ? 0 : volume) - 0.1)); break;
        default: break;
      }
      resetHideTimer();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [volume, muted, resetHideTimer, toggleFullscreen, toggleMute, changeVolume, showGesture]);

  /* ── Derived ── */
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const showCtrl = controlsVisible || status !== "playing";

  return {
    // Refs
    videoRef, containerRef, seekRef,
    // State
    status, currentTime, duration, buffered, volume, muted, speed,
    isFullscreen, controlsVisible, seekHoverPos, seekHoverTime,
    showSpeedMenu, showQualityMenu, isSeeking, seekPreview,
    gestureIcon, doubleTap, qualities, currentQuality, videoSrc,
    progress, showCtrl,
    // Handlers
    resetHideTimer, togglePlay, toggleMute, changeVolume, changeSpeed,
    toggleFullscreen, togglePiP, skipPrev, skipNext, changeQuality,
    onTimeUpdate, onPlay, onPause, onLoadedMetadata, onEnded: onEnded2, onError,
    handleSeekStart, handleSeekMove, handleSeekEnd,
    handleTouchEnd, handleScreenClick,
    setShowSpeedMenu, setShowQualityMenu,
  };
}
