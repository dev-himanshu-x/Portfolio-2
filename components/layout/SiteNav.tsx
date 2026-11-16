"use client";

import { useEffect, useState } from "react";
import { scrollToY } from "@/components/providers/SmoothScroll";
import { SITE } from "@/content/site";

const NAV_BASE =
  "fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-6 px-[clamp(1.25rem,3vw,2.2rem)] py-[1.1rem] font-mono text-[0.72rem] tracking-[0.16em] transition-[background-color] duration-300 ease-[ease]";
const NAV_OVER_ART = "pointer-events-none text-white mix-blend-difference";
const NAV_SOLID =
  "pointer-events-auto border-b border-[rgba(247,245,240,0.12)] bg-[rgba(20,36,27,0.94)] text-paper backdrop-blur-[10px] [@media(hover:none),(max-width:640px)]:backdrop-filter-none";
const NAV_ITEM = "pointer-events-auto m-0 text-inherit no-underline";
const NAV_LINK = `${NAV_ITEM} relative cursor-pointer border-0 bg-transparent p-0 tracking-[inherit] [font:inherit] after:absolute after:-bottom-[5px] after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-[350ms] after:ease-[cubic-bezier(0.65,0,0.35,1)] after:content-[''] hover:after:origin-left hover:after:scale-x-100`;
const FRAME_CORNERS = [
  "top-3 left-3 border-r-0 border-b-0",
  "top-3 right-3 border-b-0 border-l-0",
  "bottom-3 left-3 border-t-0 border-r-0",
  "right-3 bottom-3 border-t-0 border-l-0",
];

/**
 * Fixed HUD chrome: top nav + corner frame brackets. Rendered in
 * mix-blend-mode: difference so it reads over cream sky and black smoke alike
 * without ever boxing out the artwork beneath. Once the hero has scrolled away
 * it turns into a solid bar so page content never runs under the links.
 */
export function SiteNav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) =>
      setSolid(!entry.isIntersecting),
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header className={`${NAV_BASE} ${solid ? NAV_SOLID : NAV_OVER_ART}`}>
        <a
          className={`${NAV_ITEM} font-display text-[0.95rem] font-extrabold tracking-[0.08em]`}
          href="#top"
        >
          {SITE.firstName}
          <span className="ml-[0.2em] align-super font-mono text-[0.62rem] font-normal opacity-75">
            ©{SITE.year}
          </span>
        </a>
        <nav className="flex gap-8 max-[640px]:hidden">
          <button
            type="button"
            className={NAV_LINK}
            onClick={() => {
              const track = document.getElementById("top");
              if (!track) return;
              const run = track.offsetHeight - window.innerHeight;
              scrollToY(track.offsetTop + run * 0.95);
            }}
          >
            WORK
          </button>
          <a className={NAV_LINK} href="#work">
            PROJECTS
          </a>
          <a className={NAV_LINK} href="#contact">
            CONTACT
          </a>
        </nav>
        <p className={`${NAV_ITEM} flex items-center gap-2`}>
          {SITE.role.toUpperCase()}
        </p>
      </header>

      <div className="contents max-[640px]:hidden" aria-hidden="true">
        {FRAME_CORNERS.map((pos) => (
          <i
            key={pos}
            className={`pointer-events-none fixed z-[55] size-[18px] border-[1.5px] border-[rgba(255,255,255,0.85)] mix-blend-difference ${pos}`}
          />
        ))}
      </div>
    </>
  );
}
