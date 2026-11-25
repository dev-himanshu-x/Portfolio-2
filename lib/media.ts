/** SSR-safe media-query check. */
export function matches(query: string) {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

export const prefersReducedMotion = () =>
  matches("(prefers-reduced-motion: reduce)");

export const isCoarsePointer = () => matches("(pointer: coarse)");
