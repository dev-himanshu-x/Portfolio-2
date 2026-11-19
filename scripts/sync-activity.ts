/// <reference types="bun" />
export {};
const USER = "dev-himanshu-x";

const html = await (
  await fetch(`https://github.com/users/${USER}/contributions`)
).text();

const total = Number(
  /([\d,]+)\s+contributions\s+in the last year/
    .exec(html)?.[1]
    .replace(/,/g, ""),
);

const counts = new Map<string, number>();
for (const m of html.matchAll(
  /<tool-tip[^>]*for="(contribution-day-component-\d+-\d+)"[^>]*>\s*([^<]*?)\s*<\/tool-tip>/g,
)) {
  counts.set(
    m[1],
    /^(\d+)/.exec(m[2])?.[1] ? Number(/^(\d+)/.exec(m[2])?.[1]) : 0,
  );
}

const days = [
  ...html.matchAll(
    /data-date="([\d-]+)"\s+id="(contribution-day-component-\d+-\d+)"\s+data-level="(\d)"/g,
  ),
]
  .map(([, date, id, level]) => ({
    date,
    level: Number(level),
    count: counts.get(id) ?? 0,
  }))
  .sort((a, b) => a.date.localeCompare(b.date));

if (!days.length || Number.isNaN(total))
  throw new Error("could not parse contributions");

await Bun.write(
  "content/generated/activity.json",
  `${JSON.stringify({ total, days }, null, 2)}\n`,
);
console.log(`wrote ${days.length} days, ${total} contributions`);
