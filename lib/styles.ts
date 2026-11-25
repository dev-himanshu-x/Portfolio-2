import type { CSSProperties } from "react";

export const EYEBROW = "mt-0 font-mono text-[0.68rem] tracking-[0.26em]";

/** Staggered reveal index consumed by `animation-delay: calc(var(--i) * ...)`. */
export const revealIndex = (i: number) => ({ "--i": i }) as CSSProperties;
