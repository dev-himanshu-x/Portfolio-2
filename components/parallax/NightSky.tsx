// Percent positions within the stage; delays de-sync the loops.
const TWINKLES: Array<[number, number, string]> = [
  [8, 18, "0s"],
  [15, 8, "0.7s"],
  [23, 24, "1.3s"],
  [33, 12, "0.4s"],
  [42, 6, "1.9s"],
  [52, 20, "0.9s"],
  [61, 10, "1.6s"],
  [70, 26, "0.2s"],
  [79, 7, "1.1s"],
  [87, 16, "0.6s"],
  [93, 28, "1.5s"],
  [47, 30, "2.1s"],
];

const FLIES: Array<[number, number, string]> = [
  [14, 76, "0s"],
  [27, 83, "1.4s"],
  [44, 79, "2.6s"],
  [62, 85, "0.8s"],
  [77, 78, "2s"],
  [88, 84, "3.2s"],
];

/**
 * Live night layer over the baked scene: twinkling stars, a looping shooting
 * star, and drifting fireflies. Tiny compositor-only CSS animations (opacity /
 * transform on dots), so it adds life without touching the baked bitmaps.
 */
export function NightSky() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
      aria-hidden="true"
    >
      {TWINKLES.map(([x, y, d], i) => (
        <span
          key={`t${i}`}
          className="absolute size-[3px] rounded-full bg-[#edeaf7] shadow-[0_0_6px_1px_rgba(237,234,247,0.7)] motion-safe:animate-[twinkle_2.6s_ease-in-out_infinite] motion-reduce:opacity-80"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: d }}
        />
      ))}
      {FLIES.map(([x, y, d], i) => (
        <span
          key={`f${i}`}
          className="absolute size-1 rounded-full bg-[#fbb13c] shadow-[0_0_8px_2px_rgba(251,177,60,0.6)] motion-safe:animate-[firefly_5.5s_ease-in-out_infinite_alternate] motion-reduce:opacity-80"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: d }}
        />
      ))}
      <span className="absolute top-[13%] left-0 h-[3px] w-[180px] rounded-[3px] bg-[linear-gradient(90deg,#fff_0%,rgba(237,234,247,0)_100%)] opacity-0 [filter:drop-shadow(0_0_6px_rgba(255,255,255,0.9))] before:absolute before:-top-[3.5px] before:-left-1 before:size-[10px] before:rounded-full before:bg-white before:shadow-[0_0_12px_4px_rgba(255,255,255,0.85)] before:content-[''] motion-safe:animate-[comet_9s_linear_infinite_2s]" />
    </div>
  );
}
