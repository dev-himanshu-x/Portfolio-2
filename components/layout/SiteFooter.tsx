import Image from "next/image";
import { OutlineText } from "@/components/ui/outline-text";
import { LINKS, SITE } from "@/content/site";
import { EYEBROW } from "@/lib/styles";
import { FooterGrass } from "./FooterGrass";

/** Contact footer — calm centred call-to-action over a paper-cut meadow. */
export function SiteFooter() {
  return (
    <footer
      className="relative overflow-hidden bg-paper px-6 pt-[clamp(5rem,14vh,9rem)] pb-[clamp(10rem,24vw,18rem)] text-center"
      id="contact"
    >
      <p className={`${EYEBROW} mb-[0.4rem] text-ink-soft`}>
        PLATE 04 — CORRESPONDENCE
      </p>
      <OutlineText
        as="p"
        className="mx-0 mt-[0.8rem] mb-[2.4rem] inline-block text-transparent no-underline transition-[color,-webkit-text-stroke-color] duration-[350ms] ease-[ease] [-webkit-text-stroke:2px_var(--color-ink)] hover:text-lava hover:[-webkit-text-stroke-color:var(--color-ember)]"
      >
        GET IN TOUCH
      </OutlineText>
      <div className="flex flex-wrap justify-center gap-x-[2.4rem] gap-y-4 font-mono text-[0.72rem] tracking-[0.2em]">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="border-b border-transparent text-ink-soft no-underline transition-[border-color,color] duration-300 ease-[ease] hover:border-current hover:text-ember"
          >
            {l.label}
          </a>
        ))}
      </div>
      <p className="mt-[clamp(2.5rem,7vh,4.5rem)] font-mono text-[0.62rem] tracking-[0.2em] text-ink-soft">
        MADE WITH ❤️ BY {SITE.name.toUpperCase()}
      </p>
      <div
        className="group/lizard pointer-events-auto absolute right-[clamp(1rem,6vw,7rem)] -bottom-px z-[1] h-auto w-[clamp(9rem,21vw,22rem)] cursor-pointer"
        aria-hidden="true"
      >
        <Image
          className="pointer-events-none block h-auto w-full select-none"
          src="/images/footer-lizard-body.webp"
          alt=""
          width={720}
          height={760}
        />
        <Image
          className="pointer-events-none absolute top-0 left-0 h-auto w-full origin-[21.66%_16.75%] select-none will-change-transform motion-safe:animate-[lizard-tongue-flick_4.2s_cubic-bezier(0.25,1,0.5,1)_infinite] motion-safe:group-hover/lizard:animate-[lizard-tongue-strike_0.75s_cubic-bezier(0.34,1.56,0.64,1)_infinite]"
          src="/images/footer-lizard-tongue.webp"
          alt=""
          width={720}
          height={760}
        />
      </div>
      <FooterGrass />
    </footer>
  );
}
