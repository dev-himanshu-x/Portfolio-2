"use client";

import { useEffect, useRef } from "react";

/**
 * Sets `data-in` on the element once its top crosses `threshold` of the
 * viewport height. CSS does the motion, so it never stalls with a ticker.
 */
export function useRevealOnScroll<T extends HTMLElement>(threshold = 0.7) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const off = () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * threshold) {
        el.setAttribute("data-in", "");
        off();
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return off;
  }, [threshold]);

  return ref;
}
