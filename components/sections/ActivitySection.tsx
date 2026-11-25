"use client";

import { useState } from "react";
import activity from "@/content/generated/activity.json";
import { LINKS } from "@/content/site";

const LEVEL = [
  "bg-[#263d2f]",
  "bg-[#2f7a3b]",
  "bg-[#43a14e]",
  "bg-[#6fcf6b]",
  "bg-[#c4f58a]",
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

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function dayLabel(date: string, count: number) {
  const when = dateFormat.format(new Date(`${date}T00:00:00Z`));
  if (count === 0) return `No contributions on ${when}`;
  return `${count} ${count === 1 ? "contribution" : "contributions"} on ${when}`;
}

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
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(
    null,
  );

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
            onPointerOver={(e) => {
              const cell = e.target as HTMLElement;
              const text = cell.dataset.tip;
              if (!text) return;
              const r = cell.getBoundingClientRect();
              setTip({ text, x: r.left + r.width / 2, y: r.top });
            }}
            onPointerLeave={() => setTip(null)}
            aria-label={`${activity.total} contributions on GitHub in the last year`}
          >
            {activity.days.map((d) => (
              <span
                key={d.date}
                data-tip={dayLabel(d.date, d.count)}
                className={`aspect-square rounded-[4px] transition-transform duration-150 hover:z-10 hover:scale-150 ${LEVEL[d.level]}`}
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
      {tip && (
        <div
          className="pointer-events-none fixed z-[70] -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-md bg-paper px-3 py-1.5 text-[0.8rem] whitespace-nowrap text-ink shadow-lg"
          style={{
            left: Math.min(Math.max(tip.x, 90), window.innerWidth - 90),
            top: tip.y,
          }}
          role="tooltip"
        >
          {tip.text}
        </div>
      )}
    </div>
  );
}
