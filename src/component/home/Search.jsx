import { memo, useCallback, useRef, useState, useEffect } from "react";

const Search = ({ onSearch }) => {
  const [value, setValue] = useState("");
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      setValue(val);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (onSearch) onSearch(val);
      }, 250);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setValue("");
    if (onSearch) onSearch("");
    inputRef.current?.focus();
  }, [onSearch]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <section className="py-6 sm:py-8 pb-8 sm:pb-12">
      <div className="relative max-w-2xl mx-auto">
        {/* Search Icon */}
        <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="#64748b" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search movies..."
          value={value}
          onChange={handleChange}
          autoComplete="off"
          spellCheck="false"
          aria-label="Search movies by name"
          className="w-full py-3 sm:py-4 pl-12 sm:pl-16 pr-10 sm:pr-12 bg-white/4 border border-white/6 rounded-full text-[1.2rem] sm:text-[1.35rem] lg:text-[1.45rem] text-slate-100 outline-none transition-[border-color,box-shadow,background-color] duration-300 backdrop-blur-xl placeholder:text-slate-500 focus:border-accent focus:shadow-[0_0_0_3px_rgba(129,140,248,0.25),0_4px_20px_rgba(0,0,0,0.2)] focus:bg-white/6"
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:bg-white/8 hover:text-slate-100 transition-colors duration-150"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

export default memo(Search);
