import { memo } from "react";
import { ChevronUp } from "./Icons";

const BackToTop = memo(({ visible, onClick }) => (
  <button
    onClick={onClick}
    aria-label="Back to top"
    className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999] w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#818cf8]/15 border border-[#818cf8]/30 text-[#818cf8] flex items-center justify-center cursor-pointer backdrop-blur-2xl transition-all duration-300 ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"} hover:bg-[#818cf8]/25 hover:border-[#818cf8]/45 hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(129,140,248,0.2)]`}
  >
    <ChevronUp size={18} />
  </button>
));
BackToTop.displayName = "BackToTop";

export default BackToTop;
