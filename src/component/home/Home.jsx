import { useState, useCallback, memo } from "react";
import Movies from "./Movies";
import Search from "./Search";
import Footer from "../Footer";
import Header from "../Header";
import BackToTop from "../BackToTop";
import { useScroll } from "../../Helpers/useScroll";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { scrolled, showTop, scrollToTop } = useScroll();

  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  return (
    <>
      <Header scrolled={scrolled} variant="home" />

      {/* Hero */}
      <section className="relative min-h-[45vh] sm:min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden pt-24 sm:pt-32 lg:pt-40 pb-10 sm:pb-16 lg:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-120 sm:w-160 lg:w-200 h-120 sm:h-160 lg:h-200 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.15),transparent_70%)] blur-[80px] top-[-15%] right-[-10%] animate-[orbFloat_12s_ease-in-out_infinite]" />
          <div className="absolute w-100 sm:w-lg lg:w-160 h-100 sm:h-128 lg:h-160 rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.1),transparent_70%)] blur-[80px] bottom-[-10%] left-[-5%] animate-[orbFloat_12s_ease-in-out_infinite_-4s]" />
          <div className="absolute w-80 sm:w-100 lg:w-120 h-80 sm:h-100 lg:h-120 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.08),transparent_70%)] blur-[80px] top-[40%] left-[30%] animate-[orbFloat_12s_ease-in-out_infinite_-8s]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-1.5 sm:py-2 bg-accent/10 border border-accent/20 rounded-full text-[1rem] sm:text-[1.2rem] font-semibold text-accent mb-5 sm:mb-8 animate-[fadeInUp_0.6s_ease]">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-[pulse_2s_ease_infinite]" />
            Free Streaming & Downloads
          </div>
          <h2 className="text-[2.6rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[5.2rem] font-black text-slate-100 tracking-tight leading-[1.1] mb-4 sm:mb-6 animate-[fadeInUp_0.6s_ease_0.1s_both]">
            Discover <span className="bg-linear-to-r from-accent via-purple-400 to-[#f472b6] bg-clip-text text-transparent">Amazing</span> Movies
          </h2>
          <p className="text-[1.3rem] sm:text-[1.5rem] lg:text-[1.7rem] text-slate-400 leading-relaxed max-w-2xl mb-8 sm:mb-12 animate-[fadeInUp_0.6s_ease_0.2s_both]">
            Watch and download movies in HD quality. Browse our curated collection and find your next favorite film.
          </p>
          <div className="flex gap-4 sm:gap-6 lg:gap-8 animate-[fadeInUp_0.6s_ease_0.3s_both] flex-wrap">
            {[
              { icon: "🎬", label: "Quality", value: "HD" },
              { icon: "⚡", label: "No cost", value: "Free" },
              { icon: "🌍", label: "Languages", value: "Hindi" },
            ].map((s) => (
              <div key={s.value} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/3 border border-white/6 rounded-xl backdrop-blur-lg">
                <span className="text-[1.4rem] sm:text-[1.6rem] lg:text-[1.8rem]">{s.icon}</span>
                <div>
                  <span className="block text-[1.1rem] sm:text-[1.2rem] lg:text-[1.3rem] font-bold text-slate-100">{s.value}</span>
                  <span className="block text-[0.85rem] sm:text-[0.9rem] lg:text-[1rem] text-slate-500">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[140rem] mx-auto px-3 sm:px-6">
        <Search onSearch={handleSearch} />
        {!searchQuery && <Movies featured />}
        <section className="pb-12 sm:pb-16" id="movies-section">
          <div className="flex items-center justify-between mb-6 sm:mb-8 px-0.5 gap-2">
            <h3 className="flex items-center gap-2 sm:gap-2.5 text-[1.4rem] sm:text-[1.6rem] lg:text-[1.8rem] font-bold text-slate-100 tracking-tight m-0">
              <span className="text-[1.3rem] sm:text-[1.5rem] lg:text-[1.6rem]">🎬</span>
              {searchQuery ? `Results for "${searchQuery}"` : "All Movies"}
            </h3>
            <span className="text-[1rem] sm:text-[1.1rem] lg:text-[1.2rem] font-medium text-slate-500 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white/3 border border-white/6 rounded-full whitespace-nowrap">
              <Movies searchQuery={searchQuery} countOnly />
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            <Movies searchQuery={searchQuery} />
          </div>
        </section>
        <Footer />
      </div>

      <BackToTop visible={showTop} onClick={scrollToTop} />
    </>
  );
};

export default memo(Home);
