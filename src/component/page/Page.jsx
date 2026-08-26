import { useEffect, useState } from "react";
import { useGlobalContext } from "../../Helpers/context";
import { useLocation } from "react-router-dom";
import Download from "./Download";
import VideoPlayer from "./VideoPlayer";
import Footer from "../Footer";
import Header from "../Header";
import BackToTop from "../BackToTop";
import { useScroll } from "../../Helpers/useScroll";
import { ArrowLeft, Play, Download as DownloadIcon, Image, Expand, Star, X } from "../Icons";

/* ── Screenshot Lightbox ── */
function ScreenshotLightbox({ src, alt, index, total, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="lb" onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
      {/* Backdrop button — clicking it closes the lightbox */}
      <button className="lb__backdrop" onClick={onClose} aria-label="Close lightbox" />
      {/* Content wrapper — stops click propagation so inner clicks don't close */}
      <div className="lb__content">
        <div className="lb__header">
          <span className="lb__count">{index + 1} / {total}</span>
          <button className="lb__close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        {total > 1 && (
          <>
            <button className="lb__nav lb__nav--prev" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous"><ArrowLeft size={24} /></button>
            <button className="lb__nav lb__nav--next" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></button>
          </>
        )}
        <div className="lb__img-wrap">
          <img src={src} alt={alt} className="lb__img" />
        </div>
      </div>
    </div>
  );
}

const Page = () => {
  const query = new URLSearchParams(useLocation().search).get("Key");
  const { getSingleProjects, Smovies } = useGlobalContext();
  const { scrolled, showTop, scrollToTop } = useScroll();

  const [imgLoaded, setImgLoaded] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    getSingleProjects(query);
  }, [query, getSingleProjects]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [query]);

  if (!Smovies || !Smovies.Name) {
    return (
      <>
        <Header scrolled={scrolled} variant="detail" />
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-6 sm:gap-8 text-slate-500 text-[1.3rem] sm:text-[1.6rem] px-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 border-[2.5px] border-white/6 border-t-accent rounded-full animate-[spin_0.7s_linear_infinite]" />
          <p>Loading movie details...</p>
        </div>
      </>
    );
  }

  const {
    Title, Desc, Poster, Screenshots1, Screenshots2, Screenshots3, Screenshots4,
    Language, Quality, Movie_story, Format, Size, Name, Release, Genres, IMDB, Country, WatchUrl,
  } = Smovies;

  document.title = Name;

  const genresList = Genres ? Genres.split(",").map((g) => g.trim()) : [];
  const screenshots = [Screenshots1, Screenshots2, Screenshots3, Screenshots4].filter(Boolean);

  const handlePrev = () => setLightboxIdx((p) => (p > 0 ? p - 1 : screenshots.length - 1));
  const handleNext = () => setLightboxIdx((p) => (p < screenshots.length - 1 ? p + 1 : 0));

  return (
    <>
      <Header scrolled={scrolled} variant="detail" />

      <section className="min-h-screen bg-primary">
        {/* Hero Banner */}
        <div className="relative min-h-auto sm:min-h-[70vh] lg:min-h-[80vh] flex flex-col overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={Poster} alt="" className="w-full h-full object-cover blur-[50px] brightness-[0.25] saturate-[1.5] scale-[1.3]" />
            <div className="absolute inset-0 bg-linear-to-b from-primary/50 via-primary/80 to-primary" />
          </div>

          <div className="relative z-10 w-full mx-auto px-3 py-6 sm:p-6 flex-1 flex flex-col pt-20 sm:pt-32 lg:pt-44">
            <div className="max-w-[120rem] mx-auto grid grid-cols-1 md:grid-cols-[22rem_1fr] lg:grid-cols-[28rem_1fr] gap-4 sm:gap-8 lg:gap-16 items-start flex-1 pb-6 sm:pb-16">
              {/* Poster */}
              <div className="relative rounded-xl sm:rounded-4xl overflow-hidden aspect-2/3 max-w-56 sm:max-w-72 md:max-w-80 mx-auto md:mx-0">
                <img src={Poster} alt={Name} className={`w-full h-full object-cover rounded-xl sm:rounded-4xl transition-all duration-500 ${imgLoaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-97"}`} onLoad={() => setImgLoaded(true)} />
                <div className="absolute inset-0 rounded-xl sm:rounded-4xl shadow-[0_0_80px_rgba(129,140,248,0.12),0_24px_60px_rgba(0,0,0,0.6)] pointer-events-none" />
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-2.5 sm:gap-4 lg:gap-5 pt-1 sm:pt-4 text-center md:text-left md:items-start items-center">
                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2.5 justify-center md:justify-start">
                  {Quality && <span className="badge badge--quality">{Quality}</span>}
                  {Language && <span className="badge badge--lang">{Language}</span>}
                  {Format && <span className="badge badge--format">{Format}</span>}
                </div>

                <h1 className="text-[2rem] sm:text-[2.6rem] lg:text-[3.6rem] font-extrabold text-slate-100 tracking-tight leading-[1.1] m-0">{Name}</h1>
                {Title && Title !== Name && <p className="text-[1.2rem] sm:text-[1.4rem] lg:text-[1.5rem] text-slate-500 font-normal m-0">{Title}</p>}

                {/* Stats */}
                <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 justify-center md:justify-start">
                  {IMDB && <div className="flex items-center gap-1.5 sm:gap-2"><Star size={14} /><span className="text-[1.2rem] sm:text-[1.3rem] lg:text-[1.4rem] font-semibold text-slate-100">{IMDB}</span><span className="text-[1rem] sm:text-[1.1rem] lg:text-[1.2rem] text-slate-500">/ 10</span></div>}
                  {Release && <div className="flex items-center gap-1.5 sm:gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg><span className="text-[1.2rem] sm:text-[1.3rem] lg:text-[1.4rem] font-semibold text-slate-100">{Release}</span></div>}
                  {Country && <div className="flex items-center gap-1.5 sm:gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg><span className="text-[1.2rem] sm:text-[1.3rem] lg:text-[1.4rem] font-semibold text-slate-100">{Country}</span></div>}
                  {Size != null && Size !== '' && <div className="flex items-center gap-1.5 sm:gap-2"><DownloadIcon size={14} /><span className="text-[1.2rem] sm:text-[1.3rem] lg:text-[1.4rem] font-semibold text-slate-100">{Size}</span></div>}
                </div>

                {/* Genres */}
                {genresList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center md:justify-start">
                    {genresList.map((g) => <span key={g} className="genre-tag">{g}</span>)}
                  </div>
                )}

                {Desc && <p className="text-[1.2rem] sm:text-[1.3rem] lg:text-[1.4rem] text-slate-400 leading-relaxed m-0 max-w-[70rem]">{Desc}</p>}

                {/* Actions */}
                <div className="flex flex-wrap gap-2.5 sm:gap-3 lg:gap-4 mt-1 sm:mt-2 justify-center md:justify-start">
                  <a href="#player-section" className="action-btn action-btn--primary text-[1.1rem] sm:text-[1.2rem] lg:text-[1.35rem] px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3"><Play size={16} /> Watch Now</a>
                  <a href="#download-section" className="action-btn action-btn--secondary text-[1.1rem] sm:text-[1.2rem] lg:text-[1.35rem] px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3"><DownloadIcon size={16} /> Download</a>
                  {screenshots.length > 0 && (
                    <button className="action-btn action-btn--ghost text-[1rem] sm:text-[1.1rem] lg:text-[1.3rem] px-4 sm:px-5 py-2 sm:py-2.5" onClick={() => setLightboxIdx(0)}><Image size={16} /> Screenshots</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player */}
        <div className="bg-primary px-2 sm:px-4 lg:px-6" id="player-section">
          <div className="max-w-[140rem] mx-auto">
            <div className="flex gap-6 lg:gap-8 items-start">
              <div className="flex-1 min-w-0">
                <div className="rounded-lg sm:rounded-[1.2rem] overflow-hidden bg-black shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                  <VideoPlayer src={WatchUrl} poster={Poster} title={Name} />
                </div>

                {/* Screenshot Strip */}
                {screenshots.length > 0 && (
                  <div className="mt-3 sm:mt-4">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-[0.9rem] sm:text-[1rem] lg:text-[1.1rem] font-semibold text-slate-500 uppercase tracking-widest">Screenshots</span>
                      <span className="text-[0.85rem] sm:text-[0.9rem] lg:text-[1rem] text-slate-500 opacity-50">Click to expand</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 lg:gap-2.5">
                      {screenshots.map((src, i) => (
                        <button key={src} className={`relative rounded-md sm:rounded-lg overflow-hidden border cursor-pointer transition-transform duration-200 bg-transparent p-0 opacity-60 hover:border-white/12 hover:opacity-100 hover:-translate-y-0.5 ${lightboxIdx === i ? "border-accent shadow-[0_0_0_2px_rgba(129,140,248,0.25)] opacity-100" : "border-white/6"}`} onClick={() => setLightboxIdx(i)}>
                          <img src={src} alt={`${Name} screenshot ${i + 1}`} loading="lazy" className="w-full aspect-video object-cover block border-0 m-0" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity duration-200 hover:bg-black/30 hover:opacity-100 text-white"><Expand size={14} /></div>
                          <span className="absolute bottom-0.5 right-1 sm:bottom-1 sm:right-1.5 text-[0.8rem] sm:text-[0.9rem] text-white/35 bg-black/50 rounded px-1 sm:px-1.5 py-0.5 font-mono">{i + 1}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Download */}
        <div id="download-section" className="bg-primary px-3 sm:px-6 lg:px-10 py-6 sm:py-12 lg:py-16">
          <div className="max-w-[100rem] mx-auto">
            <Download movie={Smovies} />
          </div>
        </div>

        {/* Lightbox */}
        {lightboxIdx !== null && screenshots[lightboxIdx] && (
          <ScreenshotLightbox
            src={screenshots[lightboxIdx]}
            alt={`${Name} screenshot ${lightboxIdx + 1}`}
            index={lightboxIdx}
            total={screenshots.length}
            onClose={() => setLightboxIdx(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </section>

      <div className="max-w-[140rem] mx-auto px-3 sm:px-6"><Footer /></div>
      <BackToTop visible={showTop} onClick={scrollToTop} />
    </>
  );
};

export default Page;
