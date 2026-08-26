import { useState, useEffect } from "react";

/* ── Helpers ── */

function getWistiaHash(url) {
  if (!url) return null;
  const m =
    url.match(/wistia\.net\/embed\/iframe\/([a-z0-9]+)/i) ||
    url.match(/wistia\.com\/medias\/([a-z0-9]+)/i) ||
    url.match(/wistia\.net\/iframe\/([a-z0-9]+)/i);
  return m ? m[1] : null;
}

async function fetchWistiaQualities(watchUrl, signal) {
  const hash = getWistiaHash(watchUrl);
  if (!hash) return null;
  try {
    const res = await fetch(`https://fast.wistia.net/embed/iframe/${hash}`, { signal });
    if (!res.ok) return null;
    const html = await res.text();
    const initMatch = html.match(
      /W\.iframeInit\((\{.*?\})\s*,\s*\{[^}]*\}\)/s
    );
    if (!initMatch) return null;
    const data = JSON.parse(initMatch[1]);
    if (!data.assets || data.assets.length === 0) return null;
    return data.assets
      .reduce((acc, a) => {
        if (a.container === "mp4" && a.url) {
          acc.push({
            label: a.display_name || `${a.height}p`,
            height: a.height || 0,
            url: a.url,
            size: a.fileSize || 0,
          });
        }
        return acc;
      }, [])
      .sort((a, b) => b.height - a.height);
  } catch {
    return null;
  }
}

function isDirectVideoUrl(url) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

function fmtBytes(b) {
  if (!b || b <= 0) return "—";
  if (b >= 1e9) return (b / 1e9).toFixed(1) + " GB";
  if (b >= 1e6) return Math.round(b / 1e6) + " MB";
  return Math.round(b / 1e3) + " KB";
}

function qualityColor(height) {
  if (height >= 1080)
    return {
      bg: "rgba(52,211,153,0.1)",
      border: "rgba(52,211,153,0.3)",
      text: "#34d399",
      gradient: "linear-gradient(135deg, #34d399, #059669)",
    };
  if (height >= 720)
    return {
      bg: "rgba(129,140,248,0.1)",
      border: "rgba(129,140,248,0.3)",
      text: "#818cf8",
      gradient: "linear-gradient(135deg, #818cf8, #6366f1)",
    };
  if (height >= 480)
    return {
      bg: "rgba(251,191,36,0.1)",
      border: "rgba(251,191,36,0.3)",
      text: "#fbbf24",
      gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    };
  return {
    bg: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.2)",
    text: "#94a3b8",
    gradient: "linear-gradient(135deg, #94a3b8, #64748b)",
  };
}

function qualityTag(height) {
  if (height >= 1080) return "Full HD";
  if (height >= 720) return "HD";
  if (height >= 480) return "SD";
  return "Low";
}

/* ══════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════ */

const Download = ({ movie }) => {
  const { Quality, Format, Name, WatchUrl, Title } = movie || {};
  const [qualities, setQualities] = useState([]);
  const [fetchingQualities, setFetchingQualities] = useState(false);

  // eslint-disable-next-line react-doctor/no-fetch-in-effect -- One-shot fetch with AbortController cleanup; no data-fetching library in this small project
  useEffect(() => {
    if (!WatchUrl) return;

    if (isDirectVideoUrl(WatchUrl)) {
      const qLabel = Quality || WatchUrl.match(/(\d+p)/i)?.[1] || "Original";
      setQualities([{ label: qLabel, height: 0, url: WatchUrl, size: 0 }]);
      return;
    }

    const controller = new AbortController();
    setFetchingQualities(true);
    fetchWistiaQualities(WatchUrl, controller.signal)
      .then((q) => {
        const fallback = [
          { label: Quality || "Original", height: 0, url: WatchUrl, size: 0 },
        ];
        setQualities(q && q.length > 0 ? q : fallback);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setQualities([
          { label: Quality || "Original", height: 0, url: WatchUrl, size: 0 },
        ]);
      })
      .finally(() => {
        setFetchingQualities(false);
      });

    return () => controller.abort();
  }, [WatchUrl, Quality]);

  /* Build the /api/download URL for each quality */
  const buildDownloadUrl = (q) => {
    const movieName = Title || Name || "video";
    return `/api/download?url=${encodeURIComponent(q.url)}&name=${encodeURIComponent(movieName + " " + q.label)}`;
  };

  return (
    <div className="dl-section">
      {/* Header */}
      <div className="dl-header dl-header--modern">
        <div className="dl-header__left">
          <div className="dl-header__icon-wrap">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div className="dl-header__text">
            <h3 className="dl-header__title">{Name}</h3>
            <div className="dl-header__meta">
              {Format && (
                <span className="dl-pill dl-pill--format">{Format}</span>
              )}
              {Quality && (
                <span className="dl-pill dl-pill--quality">{Quality}</span>
              )}
              {qualities.length > 0 && (
                <span className="dl-pill dl-pill--count">
                  {qualities.length} qualities
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section Label */}
      <div className="dl-section-label">
        <span className="dl-section-label__text">
          {fetchingQualities
            ? "Fetching available qualities…"
            : "Choose quality to download"}
        </span>
      </div>

      {/* Quality Cards */}
      <div className="dl-qual-grid dl-qual-grid--modern">
        {qualities.map((q) => {
          const key = q.label;
          const qc = qualityColor(q.height);
          const downloadUrl = buildDownloadUrl(q);

          return (
            <div className="dl-qcard dl-qcard--v2" key={key}>
              <div className="dl-qcard__inner">
                <div className="dl-qcard__top">
                  <div
                    className="dl-qcard__quality"
                    style={{ background: qc.bg, borderColor: qc.border }}
                  >
                    <span
                      className="dl-qcard__quality-label"
                      style={{ color: qc.text }}
                    >
                      {q.label}
                    </span>
                    <span
                      className="dl-qcard__quality-tag"
                      style={{ color: qc.text, opacity: 0.7 }}
                    >
                      {qualityTag(q.height)}
                    </span>
                  </div>

                  {q.size > 0 && (
                    <span className="dl-qcard__filesize">{fmtBytes(q.size)}</span>
                  )}
                </div>

                <div className="dl-qcard__actions">
                  <a
                    href={downloadUrl}
                    className="dl-qcard__btn dl-qcard__btn--download"
                    style={{ background: qc.gradient, textDecoration: "none" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download {q.label}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dl-note">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Files are served from CDN. Higher quality = larger file size.</span>
      </div>
    </div>
  );
};

export default Download;
