"use client";

import { type PointerEvent, type ReactNode, useState } from "react";

/**
 * A demo that plays when you point at it.
 *
 * Looping demos are the wrong shape for a comparison. They start at whatever
 * point in the cycle you happen to arrive at, they pull the eye while you are
 * reading the paragraph next to them, and they never let you see the start of
 * the movement, which is the part being argued about.
 *
 * A button rather than a div, because hover is not available to everyone.
 * Focus plays it for a keyboard, and a tap plays it on a phone.
 *
 * The motion here is the subject of the page rather than decoration, and it
 * only runs when someone asks for it, so it is deliberately not disabled
 * under prefers-reduced-motion. Turning it off would leave two identical
 * still frames and nothing to compare. Everything decorative on this site
 * does respect the setting.
 */
export function Hoverable({
  label,
  children,
}: {
  label: string;
  children: (active: boolean) => ReactNode;
}) {
  const [active, setActive] = useState(false);

  /**
   * Touch fires pointerenter on tap and then click straight after, so
   * tracking both would turn the demo on and immediately back off, and a tap
   * would appear to do nothing. Pointer tracking is for a real pointer, and
   * touch is left to the click handler below.
   */
  function onPointer(event: PointerEvent<HTMLButtonElement>, next: boolean) {
    if (event.pointerType !== "mouse") return;
    setActive(next);
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onPointerEnter={(event) => onPointer(event, true)}
      onPointerLeave={(event) => onPointer(event, false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onClick={() => setActive((value) => !value)}
      className="flex w-full cursor-pointer items-center justify-center"
    >
      {children(active)}
    </button>
  );
}
