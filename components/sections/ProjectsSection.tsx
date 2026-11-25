"use client";

import type { LucideIcon } from "lucide-react";
import { type ComponentType, type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalIcon, GithubIcon } from "@/components/ui/icons";
import { OutlineText, Stroke } from "@/components/ui/outline-text";
import type { Project } from "@/content/projects";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { EYEBROW, revealIndex } from "@/lib/styles";
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
function ProjectLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: LucideIcon | ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <Button
      asChild
      variant="link"
      className="h-auto gap-[0.4rem] p-0 text-[0.86rem] font-normal text-paper no-underline hover:text-lava hover:no-underline [&:last-child:not(:first-child)]:text-muted-foreground [&>svg]:size-[1.1em]"
    >
      <a href={href} target="_blank" rel="noreferrer">
        <Icon /> {children}
      </a>
    </Button>
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
  const ref = useRevealOnScroll<HTMLElement>();
  const [shown, setShown] = useState(PAGE);

  return (
    <section
      className="group/work relative overflow-hidden bg-ink-green px-gutter-lg pt-[clamp(4rem,10vh,7rem)] pb-[clamp(5rem,12vh,8rem)] text-paper"
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
            style={revealIndex(0)}
          >
            PLATE 03 — PROJECTS
          </p>
          <OutlineText
            className={`mt-0 mb-[1.4rem] ${REVEAL}`}
            style={revealIndex(1)}
          >
            FEATURED <Stroke color="var(--color-paper)">WORKS</Stroke>
          </OutlineText>
          <p
            className={`mt-0 mb-[1.6rem] max-w-[34rem] text-[1.05rem] leading-[1.55] text-[rgba(247,245,240,0.7)] ${REVEAL}`}
            style={revealIndex(2)}
          >
            Live previews and source code for what I have built.
          </p>
        </div>
        <div className="mb-[clamp(2rem,5vh,3.5rem)] h-px origin-left bg-[rgba(247,245,240,0.3)] transition-transform delay-150 duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-safe:scale-x-0 motion-safe:group-data-[in]/work:scale-x-100" />

        <div className="grid grid-cols-1 gap-x-[clamp(1.2rem,2.2vw,1.8rem)] gap-y-[clamp(3.4rem,7vw,5rem)] min-[700px]:grid-cols-2 min-[1040px]:grid-cols-3">
          {projects.slice(0, shown).map((p, i) => (
            <Card
              key={p.title}
              className={`group/card gap-0 rounded-[13px] border-0 bg-[rgba(247,245,240,0.03)] p-[clamp(1.2rem,2vw,1.7rem)] text-paper shadow-[0_0_0_1px_rgba(247,245,240,0.16)] transition-[box-shadow,background] duration-300 hover:bg-[rgba(247,245,240,0.06)] hover:shadow-[0_0_0_1px_var(--color-lava)] ${REVEAL}`}
              style={revealIndex((i % PAGE) + 2)}
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
                  <ProjectLink href={p.live} icon={ExternalIcon}>
                    Live Preview
                  </ProjectLink>
                )}
                {p.source && (
                  <ProjectLink href={p.source} icon={GithubIcon}>
                    Source
                  </ProjectLink>
                )}
              </p>
            </Card>
          ))}
        </div>

        {projects.length > PAGE && (
          <div className="mt-[clamp(2rem,5vh,3.2rem)] flex flex-col items-center gap-[0.9rem]">
            <p className="m-0 font-mono text-[0.64rem] tracking-[0.2em] text-[rgba(247,245,240,0.65)]">
              {Math.min(shown, projects.length)} / {projects.length}
            </p>
            <Button
              variant="outline"
              className="h-auto cursor-pointer rounded-none border-[rgba(247,245,240,0.45)] bg-transparent px-[1.8rem] py-[0.85rem] font-mono text-[0.72rem] font-normal tracking-[0.22em] text-paper shadow-none hover:border-paper hover:bg-paper hover:text-ink-green"
              onClick={() =>
                setShown((n) =>
                  n < projects.length
                    ? Math.min(n + PAGE, projects.length)
                    : PAGE,
                )
              }
            >
              {shown < projects.length ? "SHOW MORE" : "SHOW LESS"}
            </Button>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
