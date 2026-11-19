import activity from "@/content/generated/activity.json";
import { LINKS } from "@/content/site";

const LEVEL = [
  "bg-[rgba(247,245,240,0.08)]",
  "bg-[rgba(193,48,10,0.3)]",
  "bg-[rgba(193,48,10,0.6)]",
  "bg-ember",
  "bg-lava",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const github = LINKS.find((l) => l.label === "GITHUB")?.href;

const weeks = Math.ceil(activity.days.length / 7);
const monthLabels = activity.days
  .map((d, i) => ({
    month: Number(d.date.slice(5, 7)) - 1,
    col: Math.floor(i / 7),
  }))
  .filter((m, i, all) => i === 0 || m.month !== all[i - 1].month)
  .filter((m) => m.col < weeks - 1);

/** GitHub contribution calendar, redrawn in the site palette from content/generated/activity.json. */
export function ActivitySection() {
  return (
    <div
      className="mt-[clamp(4rem,10vh,7rem)] border-t border-[rgba(247,245,240,0.2)] pt-[clamp(2.5rem,7vh,4.5rem)] text-paper"
      id="activity"
    >
      <div className="mb-[clamp(1.4rem,4vh,2.4rem)] flex items-baseline justify-between gap-4">
        <h2 className="m-0 font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none font-normal">
          Contributions
        </h2>
        <a
          className="font-mono text-[0.64rem] tracking-[0.2em] text-[rgba(247,245,240,0.6)] no-underline transition-colors duration-[250ms] hover:text-lava"
          href={github}
          target="_blank"
          rel="noreferrer"
        >
          GITHUB ↗
        </a>
      </div>

      <div className="overflow-x-auto rounded-[20px] bg-[#1a2e22] p-[clamp(1.2rem,3vw,2.2rem)] shadow-[0_0_0_1px_rgba(247,245,240,0.14)]">
        <div className="min-w-[760px]">
          <div
            className="relative mb-[0.7rem] h-[1.1rem] text-[0.85rem] text-[rgba(247,245,240,0.6)]"
            aria-hidden="true"
          >
            {monthLabels.map((m) => (
              <span
                key={`${m.month}-${m.col}`}
                className="absolute"
                style={{ left: `${(m.col / weeks) * 100}%` }}
              >
                {MONTHS[m.month]}
              </span>
            ))}
          </div>
          <div
            className="grid grid-flow-col grid-rows-7 gap-[5px]"
            style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}
            role="img"
            aria-label={`${activity.total} contributions on GitHub in the last year`}
          >
            {activity.days.map((d) => (
              <span
                key={d.date}
                title={`${d.count} on ${d.date}`}
                className={`aspect-square rounded-[4px] ${LEVEL[d.level]}`}
              />
            ))}
          </div>
          <div className="mt-[1.1rem] flex flex-wrap items-center justify-between gap-4 text-[0.85rem] text-[rgba(247,245,240,0.6)]">
            <span>{activity.total} contributions in the last year</span>
            <span className="flex items-center gap-[5px]" aria-hidden="true">
              <span className="mr-2">Less</span>
              {LEVEL.map((c) => (
                <i key={c} className={`size-[12px] rounded-[3px] ${c}`} />
              ))}
              <span className="ml-2">More</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
