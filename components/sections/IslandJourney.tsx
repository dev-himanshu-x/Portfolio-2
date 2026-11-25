"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type CSSProperties, useEffect, useRef } from "react";
import { BakedScene } from "@/components/parallax/BakedScene";
import { NightSky } from "@/components/parallax/NightSky";
import { PaperParallax } from "@/components/parallax/PaperParallax";
import { EXPERIENCE } from "@/content/experience";
import { isCoarsePointer, prefersReducedMotion } from "@/lib/media";
import { EYEBROW } from "@/lib/styles";
import { volcanoScene } from "@/scenes/volcanoScene";
import { waterfallScene } from "@/scenes/waterfallScene";
import { CURTAIN_HEIGHT, CURTAIN_TRAVEL, LavaCurtain } from "./LavaCurtain";

const TAG_CORNERS = [
  "top-0 left-0 border-r-0 border-b-0",
  "top-0 right-0 border-b-0 border-l-0",
  "bottom-0 left-0 border-t-0 border-r-0",
  "right-0 bottom-0 border-t-0 border-l-0",
];

const HUD_TAG =
  "absolute bottom-[clamp(1.6rem,6vh,3.4rem)] left-gutter z-[5] m-0 max-w-[calc(100%-2*var(--spacing-gutter))] px-[1.1rem] py-[0.9rem] pointer-events-none [@media(hover:none),(max-width:640px)]:backdrop-filter-none";
const HUD_TAG_LIGHT = `${HUD_TAG} bg-[rgba(247,245,240,0.9)] text-ink backdrop-blur-[6px] [@media(hover:none),(max-width:640px)]:bg-[rgba(247,245,240,0.95)]`;
const HUD_TAG_DARK = `${HUD_TAG} border border-[rgba(247,245,240,0.16)] bg-[rgba(23,16,52,0.55)] text-paper backdrop-blur-[8px] [@media(hover:none),(max-width:640px)]:bg-[rgba(23,16,52,0.8)]`;

function HudTag({
  dark,
  plate,
  title,
  meta,
}: {
  dark?: boolean;
  plate: string;
  title: string;
  meta: string;
}) {
  return (
    <figure className={dark ? HUD_TAG_DARK : HUD_TAG_LIGHT} data-hud-tag>
      {TAG_CORNERS.map((pos) => (
        <i
          key={pos}
          className={`absolute size-3 border-[1.5px] ${dark ? "border-[rgba(247,245,240,0.85)]" : "border-ink"} ${pos}`}
        />
      ))}
      <p className={`${EYEBROW} mb-[0.4rem]`}>{plate}</p>
      <h2 className="mt-0 mb-[0.45rem] font-display text-[clamp(1.5rem,3.4vw,2.4rem)] leading-none font-extrabold">
        {title}
      </h2>
      <p className="m-0 font-mono text-[0.66rem] tracking-[0.2em] max-[640px]:tracking-[0.12em]">
        {meta}
      </p>
    </figure>
  );
}

const STAGE =
  "absolute inset-0 size-full will-change-[transform,opacity] max-md:relative max-md:inset-auto max-md:h-svh max-md:min-h-[34rem] max-md:will-change-auto";

const ROLE_DOT =
  "before:absolute before:top-1/2 before:left-0 before:-mt-2 before:box-border before:size-4 before:rounded-full before:border-2 before:border-[rgba(247,245,240,0.65)] before:bg-[#1b1340] before:transition-[background,border-color,box-shadow] before:duration-300 before:ease-[ease] before:content-[''] before:[transform:scale(var(--dot,1))] hover:before:border-white hover:before:bg-white hover:before:shadow-[0_0_12px_3px_rgba(255,255,255,0.7)]";
const ROLE_LINE =
  "not-last:after:absolute not-last:after:top-[calc(50%+8px)] not-last:after:left-[7px] not-last:after:h-[calc(100%-16px)] not-last:after:w-px not-last:after:origin-top not-last:after:bg-[rgba(247,245,240,0.3)] not-last:after:content-[''] not-last:after:[transform:scaleY(var(--line,1))]";
const ROLE_SHINE =
  "group-has-[[data-role]:hover]/work:not-last:after:bg-[linear-gradient(180deg,rgba(255,255,255,0.3),#fff,rgba(255,255,255,0.3))] group-has-[[data-role]:hover]/work:not-last:after:[background-size:100%_300%] group-has-[[data-role]:hover]/work:not-last:after:shadow-[0_0_8px_1px_rgba(255,255,255,0.7)] motion-safe:group-has-[[data-role]:hover]/work:not-last:after:animate-[connector-shine_1.2s_linear_infinite]";
const ROLE_DIM =
  "[@media(hover:hover)]:[&>*]:transition-opacity [@media(hover:hover)]:[&>*]:duration-300 [@media(hover:hover)]:group-has-[[data-role]:hover]/work:not-hover:[&>*]:opacity-40";
const ROLE = `pointer-events-auto relative grid grid-cols-[1fr_auto] items-center gap-[clamp(1rem,4vw,2.25rem)] max-[640px]:grid-cols-1 max-[640px]:gap-1 py-[1.1rem] pr-0 pl-[2.2rem] ${ROLE_DOT} ${ROLE_LINE} ${ROLE_SHINE} ${ROLE_DIM}`;

const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  x: ((i * 37 + 11) % 92) + 4,
  size: 3 + (i % 3),
}));

/**
 * The portfolio's opening act: the volcano hero carries the outlined name
 * (blend-mode HUD type — visible, never hiding the art). Held in place by a CSS
 * sticky stage, scrolling dives into the crater, a sheet of lava pours down
 * over the screen, and draining off the bottom it reveals the grove, whose
 * layers fan apart by depth — one scrubbed GSAP ScrollTrigger timeline.
 */
export function IslandJourney() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const volcanoRef = useRef<HTMLDivElement>(null);
  const waterfallRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<SVGSVGElement>(null);
  const embersRef = useRef<HTMLDivElement>(null);
  const craterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduce = prefersReducedMotion();

    // the mobile URL bar collapsing resizes the viewport; without this every
    // swipe re-measures the scroll layout and stutters
    ScrollTrigger.config({ ignoreMobileResize: true });

    const touch = isCoarsePointer();
    ScrollTrigger.clearScrollMemory("manual");

    const root = document.documentElement;
    let saved = 0;
    try {
      saved = Number(sessionStorage.getItem("scrollY")) || 0;
    } catch {}

    let queued = false;
    const remember = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        try {
          sessionStorage.setItem("scrollY", String(window.scrollY));
        } catch {}
      });
    };
    window.addEventListener("scroll", remember, { passive: true });

    let startIntro: (() => void) | undefined;

    const mm = gsap.matchMedia();

    // phones: no pinned timeline, just two stacked pages (layout is CSS-only)
    mm.add("(max-width: 767px)", () => {
      root.classList.remove("intro", "booting");
    });

    mm.add("(min-width: 768px)", () => {
      const wfLayers = gsap.utils.toArray<HTMLElement>(
        ".wf-layer",
        waterfallRef.current!,
      );

      // hidden (not just transparent): a painted layer holds a full-screen
      // GPU surface, and the grove's eight on top of the volcano's ten
      // exhaust GPU memory, so tiles of the visible scene get dropped
      gsap.set(waterfallRef.current, {
        autoAlpha: 0,
        scale: 1.12,
        yPercent: 9,
      });

      // played from JS: a CSS animation restarts whenever its element is
      // re-inserted into the DOM, which replayed the name several times
      const nameParts = Array.from(titleRef.current!.children);
      if (reduce || (saved > 0 && root.classList.contains("booting"))) {
        gsap.set(nameParts, { clearProps: "all" });
        root.classList.remove("intro");
      } else {
        gsap.set(nameParts, { autoAlpha: 0, yPercent: 90 });
        root.classList.remove("intro");
        const intro = gsap.to(nameParts, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.13,
          delay: 0.25,
          paused: true,
        });
        if (root.classList.contains("loading")) {
          startIntro = () => intro.play();
          window.addEventListener("site-ready", startIntro, { once: true });
        } else {
          intro.play();
        }
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: touch ? 0.4 : true,
        },
      });

      const volcanoLayers = gsap.utils.toArray<HTMLElement>(
        ".pp-layer",
        volcanoRef.current!,
      );
      const foreground = volcanoLayers.filter(
        (el) => parseFloat(el.dataset.depth || "0") >= 0.7,
      );

      // 1 — the name lifts away and the camera dives into the crater
      tl.to(
        titleRef.current,
        { yPercent: -50, autoAlpha: 0, duration: 0.2, ease: "power2.inOut" },
        0,
      );
      tl.to(
        volcanoRef.current?.querySelector("[data-hud-tag]") ?? null,
        { autoAlpha: 0, duration: 0.1 },
        0,
      );
      tl.to(
        volcanoRef.current,
        { scale: 2.8, duration: 0.5, ease: "power2.in" },
        0,
      );
      // 0.02, not 0: a fully transparent layer drops its cached tiles and has
      // to repaint when scrolling back
      tl.to(
        foreground,
        { opacity: 0.02, duration: 0.3, ease: "power1.in" },
        0.04,
      );
      tl.to(
        craterRef.current,
        { opacity: 1, duration: 0.25, ease: "power1.in" },
        0.25,
      );

      // 2 — lava pours down over the screen; the grove is swapped in while it
      // is fully opaque, then the flow drains off the bottom to reveal it
      tl.to(
        curtainRef.current,
        { yPercent: CURTAIN_TRAVEL, duration: 0.62, ease: "power1.inOut" },
        0.38,
      );
      // raised over the volcano instead of hiding it: a hidden layer drops its
      // cached tiles and scrolling back repaints the whole scene in view
      tl.fromTo(
        waterfallRef.current,
        { zIndex: 1 },
        { zIndex: 3, duration: 0.001 },
        0.62,
      );
      tl.to(waterfallRef.current, { autoAlpha: 1, duration: 0.05 }, 0.62);
      tl.to(
        waterfallRef.current,
        { scale: 1, yPercent: 0, duration: 0.45, ease: "power2.out" },
        0.6,
      );
      tl.fromTo(
        waterfallRef.current?.querySelector("[data-hud-tag]") ?? null,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out" },
        0.9,
      );

      // WORK builds one role at a time: dot pops, connector draws down to the next
      tl.fromTo(
        waterfallRef.current?.querySelector("[data-work-eyebrow]") ?? null,
        { autoAlpha: 0, x: -20 },
        { autoAlpha: 1, x: 0, duration: 0.06, ease: "power2.out" },
        0.86,
      );
      gsap.utils
        .toArray<HTMLElement>("[data-role]", waterfallRef.current!)
        .forEach((el, i) => {
          tl.fromTo(
            el,
            { autoAlpha: 0, x: -28, "--dot": 0, "--line": 0 },
            {
              autoAlpha: 1,
              x: 0,
              "--dot": 1,
              "--line": 1,
              duration: 0.08,
              ease: "power2.out",
            },
            0.88 + i * 0.06,
          );
        });

      // embers lift off the trailing edge of the draining lava and fade out
      const edgeEase = gsap.parseEase("power1.inOut");
      const edgeAt = (t: number) => {
        const p = edgeEase(Math.min(1, Math.max(0, (t - 0.38) / 0.62)));
        return ((p * CURTAIN_TRAVEL) / 100) * CURTAIN_HEIGHT - CURTAIN_HEIGHT;
      };
      gsap.utils
        .toArray<HTMLElement>("[data-ember]", embersRef.current!)
        .forEach((el, i) => {
          const t = 0.77 + i * 0.0145;
          const rise = 110 + ((i * 53) % 90);
          const drift = ((i * 29) % 60) - 30;
          gsap.set(el, { top: `${edgeAt(t) * 100}%` });
          tl.fromTo(
            el,
            { opacity: 0, y: 0, x: 0, scale: 1 },
            { opacity: 1, y: -rise * 0.4, duration: 0.04, ease: "power1.out" },
            t,
          );
          tl.to(
            el,
            {
              opacity: 0,
              y: -rise,
              x: drift,
              scale: 0.4,
              duration: 0.12,
              ease: "power1.in",
            },
            t + 0.04,
          );
        });

      // per-layer parallax: deeper layers rise further
      wfLayers.forEach((el) => {
        const d = parseFloat(el.dataset.depth || "0");
        tl.fromTo(
          el,
          { yPercent: 9 + d * 15 },
          { yPercent: -d * 26, duration: 0.5 },
          0.6,
        );
      });

      // dwell so the grove can be read before the page scrolls on
      tl.to({}, { duration: 0.1 }, 1.04);

      const st = tl.scrollTrigger;
      if (st && saved > 0 && root.classList.contains("booting")) {
        ScrollTrigger.refresh();
        window.scrollTo(0, saved);
        ScrollTrigger.update();
        tl.progress(st.progress);
      }
    });

    const reveal = requestAnimationFrame(() =>
      root.classList.remove("booting"),
    );

    return () => {
      cancelAnimationFrame(reveal);
      window.removeEventListener("scroll", remember);
      if (startIntro) window.removeEventListener("site-ready", startIntro);
      root.classList.remove("booting");
      mm.revert();
    };
  }, []);

  return (
    <div
      className="h-[calc(100svh+var(--journey-run)*1svh)] [--journey-run:210] max-md:h-auto"
      id="top"
      ref={trackRef}
    >
      <section
        className="sticky top-0 h-dvh w-full overflow-hidden bg-[#171034] max-md:static max-md:flex max-md:h-auto max-md:flex-col max-md:overflow-visible"
        ref={stageRef}
      >
        {/* beneath: the grove */}
        <div
          className={`${STAGE} z-[1] opacity-0 max-md:order-2 max-md:opacity-100`}
          id="experience"
          ref={waterfallRef}
        >
          <BakedScene
            className="absolute inset-0"
            layers={waterfallScene}
            layerClassName="wf-layer"
          />
          <NightSky />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[44%] bg-[linear-gradient(to_top,#070412_0%,#070412_60%,rgba(7,4,18,0)_100%)]"
            aria-hidden="true"
          />
          <div className="group/work pointer-events-none absolute top-[clamp(8.5rem,28vh,16rem)] left-gutter z-[5] w-[min(36rem,calc(100vw-2*var(--spacing-gutter)))] text-paper">
            <p className={`${EYEBROW} mb-[0.9rem] text-lava`} data-work-eyebrow>
              WORK
            </p>
            {EXPERIENCE.map((r) => (
              <div className={ROLE} data-role key={r.company}>
                <div>
                  <p className="m-0 font-display text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.1] font-bold">
                    {r.company}
                  </p>
                  <p className="mt-1 mb-0 text-[0.95rem] text-[rgba(247,245,240,0.65)]">
                    {r.role}
                  </p>
                </div>
                <p className="m-0 text-right text-[0.9rem] text-[rgba(247,245,240,0.6)] max-[640px]:text-left max-[640px]:text-[0.82rem]">
                  {r.period}
                </p>
              </div>
            ))}
          </div>
          <HudTag
            dark
            plate="PLATE 02 — WORK"
            title="Starfall Canopy"
            meta="STARS · COMET · FIREFLIES"
          />
        </div>

        <LavaCurtain ref={curtainRef} />
        <div
          className="pointer-events-none absolute inset-0 z-[4] max-md:hidden"
          ref={embersRef}
          aria-hidden="true"
        >
          {EMBERS.map((e) => (
            <span
              className="absolute size-[var(--s)] rounded-full bg-[radial-gradient(circle,#ffd66b_0%,#f26419_70%)] opacity-0 shadow-[0_0_8px_2px_rgba(242,100,25,0.7)]"
              data-ember
              key={e.x}
              style={{ left: `${e.x}%`, "--s": `${e.size}px` } as CSSProperties}
            />
          ))}
        </div>

        {/* on top: the volcano hero */}
        <div
          className={`${STAGE} z-[2] origin-[50%_43%] bg-[#f3ece1] max-md:order-1`}
          ref={volcanoRef}
        >
          <PaperParallax className="absolute inset-0" layers={volcanoScene} />
          <div
            className="pointer-events-none absolute top-[43%] left-1/2 z-[4] max-md:hidden -mt-[23vmin] -ml-[23vmin] size-[46vmin] rounded-full bg-[radial-gradient(circle,rgba(255,214,107,0.95)_0%,rgba(242,100,25,0.7)_35%,rgba(193,48,10,0)_70%)] opacity-0"
            ref={craterRef}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute top-[clamp(4.2rem,11vh,7rem)] left-gutter z-[5] text-white mix-blend-difference [.intro_&>*]:opacity-0"
            ref={titleRef}
          >
            <p className="m-0 font-mono text-[0.72rem] tracking-[0.3em] max-[640px]:text-[0.6rem] max-[640px]:tracking-[0.16em]">
              PORTFOLIO — FULL STACK DEVELOPER
            </p>
            <h1 className="mx-0 mt-[0.35rem] mb-[0.55rem] font-outline text-[clamp(3.4rem,11vw,9.5rem)] leading-[0.92] font-normal tracking-[0.01em] text-transparent [-webkit-text-stroke:2px_#fff]">
              HIMANSHU
              <br />
              JAISWAL
            </h1>
          </div>

          <HudTag
            plate="PLATE 01 — ERUPTION"
            title="Ashfall Isle"
            meta="STACKED SVG · CURSOR / TILT DEPTH"
          />
        </div>
      </section>
    </div>
  );
}
