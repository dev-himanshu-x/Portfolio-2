"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { EYEBROW } from "@/components/ui";
import type { Project } from "@/content/projects";
import { BigLeaf, FanLeaf } from "@/scenes/primitives/jungleShapes";
import { Palm } from "@/scenes/primitives/shapes";
import { LeafBreeze } from "./LeafBreeze";

/**
 * Selected work over dark jungle ink. Cards are thin-lined, transparent HUD
 * frames — the art stays visible through them. Reveal-on-scroll is class
 * toggled (IntersectionObserver) with CSS doing the motion, which is immune
 * to ticker stalls and respects prefers-reduced-motion for free.
 */
const PAGE = 8;

const REVEAL =
  "motion-safe:opacity-0 motion-safe:group-data-[in]/work:animate-[work-rise_0.7s_cubic-bezier(0.22,1,0.36,1)_calc(var(--i,0)*0.09s)_backwards] motion-safe:group-data-[in]/work:opacity-100";
const CARD_LINK =
  "inline-flex items-center gap-[0.4rem] text-[0.86rem] text-paper no-underline transition-colors duration-[250ms] ease-[ease] hover:text-lava [&:last-child:not(:first-child)]:text-[rgba(247,245,240,0.6)] [&>svg]:size-[1.1em]";

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function Flora({ end }: { end?: boolean }) {
  const leaf = "#25602f";
  return (
    <svg
      className={`pointer-events-none absolute left-0 h-[min(100%,640px)] w-full opacity-[0.55] ${end ? "bottom-0 -scale-y-100" : "top-0"}`}
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <FanLeaf x={-30} y={80} scale={1.6} fill={leaf} a0={-50} a1={70} />
      <BigLeaf
        x={-60}
        y={520}
        scale={1.4}
        rot={-16}
        fill={leaf}
        vein="#14241B"
      />
      <Palm x={90} y={1080} scale={1.05} fill={leaf} />
      <FanLeaf x={1630} y={140} scale={1.7} fill={leaf} a0={110} a1={230} />
      <BigLeaf
        x={1660}
        y={640}
        scale={1.5}
        rot={196}
        fill={leaf}
        vein="#14241B"
      />
      <Palm x={1520} y={1100} scale={1.1} fill={leaf} flip />
    </svg>
  );
}

export function ProjectsSection({
  projects,
  children,
}: {
  projects: Project[];
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.7) {
        el.setAttribute("data-in", "");
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <section
      className="group/work relative overflow-hidden bg-ink-green px-[clamp(1.4rem,5vw,4rem)] pt-[clamp(4rem,10vh,7rem)] pb-[clamp(5rem,12vh,8rem)] text-paper"
      id="work"
      ref={ref}
    >
      <Flora />
      <Flora end />
      <LeafBreeze />

      <div className="relative mx-auto max-w-[1280px]">
        <div>
          <p
            className={`${EYEBROW} mb-[0.4rem] text-lava ${REVEAL}`}
            style={{ ["--i" as string]: 0 }}
          >
            PLATE 03 — PROJECTS
          </p>
          <h2
            className={`mt-0 mb-[1.4rem] font-outline text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] font-normal ${REVEAL}`}
            style={{ ["--i" as string]: 1 }}
          >
            FEATURED{" "}
            <em className="text-transparent not-italic [-webkit-text-stroke:2px_var(--color-paper)]">
              WORKS
            </em>
          </h2>
          <p
            className={`mt-0 mb-[1.6rem] max-w-[34rem] text-[1.05rem] leading-[1.55] text-[rgba(247,245,240,0.7)] ${REVEAL}`}
            style={{ ["--i" as string]: 2 }}
          >
            Live previews and source code for what I have built.
          </p>
        </div>
        <div className="mb-[clamp(2rem,5vh,3.5rem)] h-px origin-left bg-[rgba(247,245,240,0.3)] transition-transform delay-150 duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-safe:scale-x-0 motion-safe:group-data-[in]/work:scale-x-100" />

        <div className="grid grid-cols-1 gap-x-[clamp(1.2rem,2.2vw,1.8rem)] gap-y-[clamp(3.4rem,7vw,5rem)] min-[700px]:grid-cols-2 min-[1040px]:grid-cols-3">
          {projects.slice(0, shown).map((p, i) => (
            <article
              key={p.title}
              className={`group/card flex flex-col rounded-[13px] bg-[rgba(247,245,240,0.03)] p-[clamp(1.2rem,2vw,1.7rem)] text-paper shadow-[0_0_0_1px_rgba(247,245,240,0.16)] transition-[box-shadow,background] duration-300 hover:bg-[rgba(247,245,240,0.06)] hover:shadow-[0_0_0_1px_var(--color-lava)] ${REVEAL}`}
              style={{ ["--i" as string]: (i % PAGE) + 2 }}
            >
              <p className="mt-0 mb-[1.6rem] flex items-center justify-between font-mono text-[0.68rem] tracking-[0.2em] text-[rgba(247,245,240,0.5)]">
                <span className="text-lava">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{p.source ? "OPEN SOURCE" : "LIVE"}</span>
              </p>
              <h3 className="mt-0 mb-[0.5rem] font-display text-[1.5rem] leading-[1.15] font-bold">
                {p.title}
              </h3>
              {p.tech.length > 0 && (
                <p className="mt-0 mb-[0.6rem] text-[0.78rem] leading-[1.5] text-[rgba(247,245,240,0.55)]">
                  {p.tech.join(" / ")}
                </p>
              )}
              {p.blurb && (
                <p className="mt-0 mb-[0.9rem] line-clamp-3 text-[0.84rem] leading-[1.55] text-[rgba(247,245,240,0.8)]">
                  {p.blurb}
                </p>
              )}
              <p className="mt-auto mb-0 flex flex-wrap gap-x-[1.2rem] gap-y-2 pt-[0.2rem]">
                {p.live && (
                  <a
                    className={CARD_LINK}
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalIcon /> Live Preview
                  </a>
                )}
                {p.source && (
                  <a
                    className={CARD_LINK}
                    href={p.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GithubIcon /> Source
                  </a>
                )}
              </p>
            </article>
          ))}
        </div>

        {projects.length > PAGE && (
          <div className="mt-[clamp(2rem,5vh,3.2rem)] flex flex-col items-center gap-[0.9rem]">
            <p className="m-0 font-mono text-[0.64rem] tracking-[0.2em] text-[rgba(247,245,240,0.65)]">
              {Math.min(shown, projects.length)} / {projects.length}
            </p>
            <button
              type="button"
              className="cursor-pointer border border-[rgba(247,245,240,0.45)] bg-transparent px-[1.8rem] py-[0.85rem] font-mono text-[0.72rem] tracking-[0.22em] text-paper transition-[background,color,border-color] duration-300 ease-[ease] hover:border-paper hover:bg-paper hover:text-ink-green"
              onClick={() =>
                setShown((n) =>
                  n < projects.length
                    ? Math.min(n + PAGE, projects.length)
                    : PAGE,
                )
              }
            >
              {shown < projects.length ? "SHOW MORE" : "SHOW LESS"}
            </button>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
