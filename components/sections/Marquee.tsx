import { SKILLS } from "@/content/skills";

/** Ink divider strip with an endless display-type marquee. */
export function Marquee() {
  const run = [...SKILLS, ...SKILLS];
  return (
    <div
      className="overflow-hidden border-t border-[rgba(247,245,240,0.14)] bg-ink-green py-[1.1rem] text-paper"
      aria-hidden="true"
    >
      <div className="flex w-max motion-safe:animate-[marquee_90s_linear_infinite]">
        {[0, 1].map((half) => (
          <span key={half} className="flex flex-none">
            {run.map((t, i) => (
              <span
                key={i}
                className="pr-[1.4rem] font-display text-[clamp(1.1rem,2.4vw,1.7rem)] font-bold tracking-[0.06em] whitespace-nowrap"
              >
                {t} <em className="pl-[1.4rem] text-lava not-italic">·</em>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
