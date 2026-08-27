"use client";

import { useEffect, useRef, type RefObject } from "react";

const MIN_FILL = 5;
const MAX_FILL = 95;

/**
 * Tracks the pointer's height inside an element and writes it back as the
 * `--fill` custom property, a 0-100 percentage measured from the bottom edge.
 * Pointer at the bottom is 0, at the top is 100, so CSS can read it as a fill
 * level without doing any math of its own.
 *
 * The fill follows the pointer between `MIN_FILL` and `MAX_FILL`. Past the top
 * of that range, and once the pointer leaves, it drops back to `restingFill`
 * and the element is marked
 * `data-fill="resting"` so CSS can ease that return more slowly than the
 * frame-by-frame tracking.
 */
export function usePointerFill<T extends HTMLElement>(
  restingFill = 30,
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    let frame: number | null = null;

    const write = (fill: number, state: "tracking" | "resting") => {
      element.style.setProperty("--fill", `${fill.toFixed(2)}%`);
      element.dataset.fill = state;
    };

    const rest = () => {
      write(restingFill, "resting");
    };

    const onPointerMove = (event: PointerEvent) => {
      if (frame !== null) return;

      // One write per frame, since pointermove fires faster than paint.
      frame = requestAnimationFrame(() => {
        frame = null;

        const rect = element.getBoundingClientRect();

        if (rect.height === 0) {
          return;
        }

        const fill = ((rect.bottom - event.clientY) / rect.height) * 100;

        if (fill > MAX_FILL) {
          rest();
          return;
        }

        write(Math.max(fill, MIN_FILL), "tracking");
      });
    };

    const onPointerLeave = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }

      rest();
    };

    rest();

    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerleave", onPointerLeave);

    return () => {
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [restingFill]);

  return ref;
}
