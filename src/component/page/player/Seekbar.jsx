import { forwardRef } from "react";

function fmt(seconds) {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const Seekbar = forwardRef(function Seekbar(
  { progress, buffered, isSeeking, seekPreview, seekHoverPos, seekHoverTime, onMouseDown, onMouseMove, onMouseLeave, onKeyDown },
  ref
) {
  const fillPct = isSeeking && seekPreview != null ? seekPreview * 100 : progress;

  return (
    // eslint-disable-next-line react-doctor/no-static-element-interactions -- Seekbar wrapper: catches mouse events for timeline seeking
    <div
      className="vp__seek"
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
    >
      <div className="vp__seek-track">
        <div className="vp__seek-buffer" style={{ width: `${buffered}%` }} />
        <div className="vp__seek-fill" style={{ width: `${fillPct}%` }} />
        <div className="vp__seek-thumb" style={{ left: `${fillPct}%` }} />
        {seekHoverTime != null && !isSeeking && (
          <div className="vp__seek-tip" style={{ left: `${seekHoverPos}%` }}>{fmt(seekHoverTime)}</div>
        )}
      </div>
    </div>
  );
});

export default Seekbar;
