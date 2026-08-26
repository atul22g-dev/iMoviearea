import { memo } from "react";
import { NavLink } from "react-router-dom";
import { Grid, ArrowLeft } from "./Icons";

const Header = memo(({ scrolled, variant = "home" }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? "bg-[#08080c]/[0.88] backdrop-blur-[24px] saturate-[1.8] border-b border-white/[0.06] py-3 shadow-[0_1px_0_0_rgba(129,140,248,0.08)]" : "bg-transparent py-4"}`}>
      <div className="max-w-[140rem] mx-auto px-4 sm:px-6 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 sm:gap-4 no-underline">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#818cf8] via-[#c084fc] to-[#f472b6] flex items-center justify-center text-[1.4rem] sm:text-[1.6rem] lg:text-[1.8rem] shadow-[0_4px_20px_rgba(129,140,248,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform duration-300 hover:scale-[1.05] hover:-rotate-[2deg] hover:shadow-[0_6px_28px_rgba(129,140,248,0.45)]">🎬</div>
          <h1 className="text-[1.6rem] sm:text-[1.9rem] lg:text-[2.2rem] font-extrabold text-slate-100 tracking-tight m-0 whitespace-nowrap">i<span className="bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">Movies</span>Area</h1>
        </NavLink>

        {variant === "home" ? (
          <nav className="flex gap-1.5">
            <a href="#movies-section" className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[1.1rem] sm:text-[1.3rem] font-medium text-[#818cf8] bg-[#818cf8]/10 border border-[#818cf8]/20 transition-colors duration-200 hover:bg-white/[0.06] hover:text-slate-100">
              <Grid size={14} />
              <span className="hidden sm:inline">Browse</span>
            </a>
          </nav>
        ) : (
          <NavLink to="/" className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[1.1rem] sm:text-[1.3rem] font-medium text-slate-400 bg-white/[0.05] border border-white/[0.06] transition-colors duration-200 hover:bg-white/[0.1] hover:text-slate-100 hover:border-white/[0.12] hover:-translate-x-0.5">
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">All Movies</span>
            <span className="sm:hidden">Back</span>
          </NavLink>
        )}
      </div>
    </header>
  );
});
Header.displayName = "Header";

export default Header;
