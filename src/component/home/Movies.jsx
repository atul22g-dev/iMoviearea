import { memo, useMemo } from "react";
import { useGlobalContext } from "../../Helpers/context";
import { NavLink } from "react-router-dom";

/* ── Skeleton ── */
const SkeletonCard = memo(() => (
  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-white/[0.035] border border-white/[0.06] pointer-events-none">
    <div className="w-full aspect-[2/3] bg-gradient-to-r from-white/[0.03] via-white/[0.07] to-white/[0.03] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
    <div className="h-10 sm:h-12 bg-gradient-to-r from-white/[0.03] via-white/[0.07] to-white/[0.03] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite_0.1s]" />
  </div>
));
SkeletonCard.displayName = "SkeletonCard";

/* ── Featured Card ── */
const FeaturedCard = memo(({ movie }) => {
  if (!movie) return null;
  const { Name, Poster, Key, Quality, Language, Release, IMDB, Desc } = movie;
  const shortName = Name.length > 40 ? `${Name.substring(0, 40)}…` : Name;

  return (
    <NavLink to={`/Page?Key=${Key}`} className="group relative grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6 lg:gap-12 items-center min-h-auto lg:min-h-[36rem] rounded-2xl lg:rounded-3xl overflow-hidden border border-white/[0.06] no-underline transition-transform duration-400 hover:border-white/[0.12] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_50px_rgba(129,140,248,0.06)] hover:-translate-y-1">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img src={Poster} alt="" className="w-full h-full object-cover blur-[30px] brightness-[0.3] saturate-[1.4] scale-[1.2]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#08080c]/90 via-[#08080c]/70 to-[#08080c]/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-12 flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[0.85rem] sm:text-[1rem] font-semibold tracking-wide uppercase bg-[#818cf8]/20 text-[#818cf8] border border-[#818cf8]/30 backdrop-blur-sm">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              Featured
            </span>
            {Quality && <span className="inline-flex items-center px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[0.85rem] sm:text-[1rem] font-semibold tracking-wide uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 backdrop-blur-sm">{Quality}</span>}
            {Language && <span className="inline-flex items-center px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[0.85rem] sm:text-[1rem] font-semibold tracking-wide uppercase bg-white/[0.08] text-slate-400 border border-white/[0.06] backdrop-blur-sm">{Language}</span>}
          </div>

          <h2 className="text-[1.8rem] sm:text-[2.2rem] lg:text-[2.8rem] font-extrabold text-slate-100 tracking-tight leading-tight m-0">{shortName}</h2>

          {Desc && <p className="text-[1.15rem] sm:text-[1.25rem] lg:text-[1.35rem] text-slate-400 leading-relaxed m-0 max-w-2xl line-clamp-3">{Desc.substring(0, 120)}…</p>}

          <div className="flex items-center gap-3 sm:gap-5">
            {IMDB && (
              <span className="flex items-center gap-1 sm:gap-1.5 text-[1.15rem] sm:text-[1.3rem] font-bold text-amber-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                {IMDB}
              </span>
            )}
            {Release && <span className="text-[1.1rem] sm:text-[1.2rem] text-slate-500 font-medium">{Release}</span>}
          </div>

          <div className="mt-1">
            <span className="inline-flex items-center gap-2 sm:gap-2.5 px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 bg-gradient-to-r from-[#818cf8] to-[#a78bfa] text-white text-[1.1rem] sm:text-[1.2rem] lg:text-[1.3rem] font-semibold rounded-full transition-transform duration-250 shadow-[0_4px_16px_rgba(129,140,248,0.3)] group-hover:scale-105 group-hover:shadow-[0_6px_24px_rgba(129,140,248,0.4)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 19,12 8,19" /></svg>
              Watch Now
            </span>
          </div>
        </div>

        {/* Poster (hidden on mobile) */}
        <div className="relative z-10 p-6 lg:p-8 pr-8 lg:pr-10 hidden lg:block">
          <img src={Poster} alt={Name} className="w-full aspect-[2/3] object-cover rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-transform duration-400 group-hover:scale-[1.03] group-hover:-translate-y-1" />
        </div>
    </NavLink>
  );
});
FeaturedCard.displayName = "FeaturedCard";

/* ── Movie Card ── */
const MovieCard = memo(({ Name, Poster, Key, Quality, Language, Release, IMDB, index }) => {
  const shortName = Name.length > 22 ? `${Name.substring(0, 22)}…` : Name;

  return (
    <NavLink
      to={`/Page?Key=${Key}`}
      className="block no-underline animate-[cardReveal_0.5s_cubic-bezier(0.4,0,0.2,1)_both]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-white/[0.035] border border-white/[0.06] cursor-pointer transition-transform duration-350 hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.01] hover:border-white/[0.12] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_40px_rgba(129,140,248,0.08)]">
        <div className="relative flex flex-col">
          {/* Image */}
          <img src={Poster} alt={Name} loading="lazy" decoding="async" className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-[1.06]" />

          {/* Top Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex gap-1 sm:gap-1.5 z-[3]">
            {Quality && <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[0.7rem] sm:text-[0.85rem] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-[10px]">{Quality}</span>}
            {Language && <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[0.7rem] sm:text-[0.85rem] font-bold tracking-wider uppercase bg-[#818cf8]/20 text-[#818cf8] border border-[#818cf8]/30 backdrop-blur-[10px]">{Language}</span>}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center bg-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:bg-black/55">
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              {IMDB && (
                <div className="flex items-center gap-1 text-[1.1rem] sm:text-[1.3rem] font-bold text-amber-400">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  {IMDB}
                </div>
              )}
              {Release && <span className="text-[0.95rem] sm:text-[1.1rem] text-white/60 font-medium">{Release}</span>}
            </div>
            <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/[0.12] border-2 border-white/20 flex items-center justify-center text-white backdrop-blur-lg transition-transform duration-250 group-hover:bg-[#818cf8]/40 group-hover:border-[#818cf8]/50 group-hover:scale-110 pl-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 19,12 8,19" /></svg>
            </span>
          </div>

          {/* Bottom */}
          <div className="absolute bottom-0 left-0 right-0 pt-12 sm:pt-16 px-3 sm:px-4 pb-3 sm:pb-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[2] flex items-end justify-between gap-2">
            <h2 className="text-[1rem] sm:text-[1.1rem] lg:text-[1.2rem] font-semibold text-white tracking-tight leading-snug m-0">{shortName}</h2>
            {Release && <span className="text-[0.85rem] sm:text-[0.95rem] lg:text-[1rem] font-medium text-white/50 whitespace-nowrap shrink-0">{Release}</span>}
          </div>
        </div>
      </div>
    </NavLink>
  );
});
MovieCard.displayName = "MovieCard";

/* ── Movies Grid ── */
const Movies = ({ searchQuery = "", countOnly = false, featured = false }) => {
  const { Amovies } = useGlobalContext();

  const filteredMovies = useMemo(() => {
    if (!Amovies || Amovies.length === 0) return [];
    if (!searchQuery.trim()) return Amovies;
    const q = searchQuery.toUpperCase();
    return Amovies.filter((m) => m.Name && m.Name.toUpperCase().includes(q));
  }, [Amovies, searchQuery]);

  if (countOnly) {
    return <span>{filteredMovies.length} movies</span>;
  }

  if (featured) {
    if (!Amovies || Amovies.length === 0) return null;
    return (
      <section className="mb-8 sm:mb-12">
        <FeaturedCard movie={Amovies[0]} />
      </section>
    );
  }

  if (!Amovies || Amovies.length === 0) {
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={`skel-${i}`} />
        ))}
      </>
    );
  }

  if (filteredMovies.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 sm:py-32 px-6 sm:px-8 text-center">
        <div className="w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4 sm:mb-6 text-slate-500">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </div>
        <p className="text-[1.4rem] sm:text-[1.6rem] font-bold text-slate-100 mb-1">No movies found</p>
        <p className="text-[1.2rem] sm:text-[1.4rem] text-slate-500">Try a different search term</p>
      </div>
    );
  }

  return filteredMovies.map((m, i) => (
    <MovieCard
      key={m.Key}
      Name={m.Name}
      Poster={m.Poster}
      Key={m.Key}
      Quality={m.Quality}
      Language={m.Language}
      Release={m.Release}
      IMDB={m.IMDB}
      index={i}
    />
  ));
};

export default memo(Movies);
