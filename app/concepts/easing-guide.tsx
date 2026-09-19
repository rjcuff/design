"use client";

import { Compare, H2, P, Takeaway } from "@/app/components/article";
import { Hoverable } from "@/app/components/hoverable";

const EASE_OUT = "cubic-bezier(0.215, 0.61, 0.355, 1)";
const EASE_IN = "cubic-bezier(0.55, 0.055, 0.675, 0.19)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

/** A dot travelling a fixed distance, so only the curve differs. */
function Travel({ easing, ms }: { easing: string; ms: number }) {
  return (
    <Hoverable label="Play the movement">
      {(out) => (
        <div className="relative h-8 w-full max-w-[11rem]">
          <div className="bg-line-strong absolute top-1/2 h-px w-full -translate-y-1/2" />
          <div
            className="bg-text absolute top-1/2 size-3 -translate-y-1/2 rounded-full"
            style={{
              transition: `transform ${ms}ms ${easing}`,
              transform: out
                ? "translateX(calc(11rem - 0.75rem))"
                : "translateX(0)",
            }}
          />
        </div>
      )}
    </Hoverable>
  );
}

/** A panel scaling in, the shape most entrances actually take. */
function Enter({ easing, ms }: { easing: string; ms: number }) {
  return (
    <Hoverable label="Play the entrance">
      {(shown) => (
        <div className="grid h-16 w-full place-items-center">
          <div
            className="border-line bg-surface-hover h-12 w-28 rounded-lg border"
            style={{
              transition: `transform ${ms}ms ${easing}, opacity ${ms}ms ${easing}`,
              transform: shown ? "scale(1)" : "scale(0.94)",
              opacity: shown ? 1 : 0,
            }}
          />
        </div>
      )}
    </Hoverable>
  );
}

/** A marker sliding between two tabs, already on screen at both ends. */
function Slide({ easing, ms }: { easing: string; ms: number }) {
  return (
    <Hoverable label="Play the slide">
      {(right) => (
        <div className="bg-surface-hover relative h-9 w-full max-w-[11rem] rounded-lg p-1">
          <div
            className="bg-canvas absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-md"
            style={{
              transition: `transform ${ms}ms ${easing}`,
              transform: right ? "translateX(100%)" : "translateX(0)",
            }}
          />
        </div>
      )}
    </Hoverable>
  );
}

export function EasingGuideBody() {
  return (
    <>
      <P>
        Every transition has a curve whether you picked one or not, and the
        default is the reason a lot of web motion feels slightly off without
        anyone being able to say why. The shortcut that covers most cases is to
        ask what the element is doing. Arriving or leaving wants ease-out.
        Moving across the screen wants ease-in-out. A hover or a color change
        wants the plain ease.
      </P>

      <Takeaway>
        Ease-out for anything the person just asked for. It moves immediately
        and settles late.
      </Takeaway>

      <Compare
        wrong={{
          caption: "Linear, 150ms",
          children: <Travel easing="linear" ms={150} />,
        }}
        right={{
          caption: "Ease-out, 150ms",
          children: <Travel easing={EASE_OUT} ms={150} />,
        }}
      />

      <P>
        Same distance, same 150ms. The linear dot starts at its final speed and
        stops dead, which nothing physical does, so it reads as mechanical. The
        ease-out dot is most of the way there when the linear one is halfway. It
        feels faster while finishing at the same moment.
      </P>

      <H2>Why not ease-in</H2>

      <P>
        Ease-in starts slow, and on anything responding to a click that is the
        worst thing a curve can do. The first few frames are what tell someone
        the interface heard them. A slow start reads as lag, and a quick finish
        does not undo it.
      </P>

      <Compare
        wrong={{
          caption: "Ease-in, 150ms",
          children: <Enter easing={EASE_IN} ms={150} />,
        }}
        right={{
          caption: "Ease-out, 150ms",
          children: <Enter easing={EASE_OUT} ms={150} />,
        }}
      />

      <P>
        Ease-in has one real use, which is an exit. Something on its way off
        screen can start slowly and accelerate away, because by the time it is
        moving quickly you have stopped caring about it. Exits can also run
        shorter than entrances. You already know what is leaving.
      </P>

      <H2>When ease-in-out is right</H2>

      <P>
        Ease-out is for things that arrive. Something already on screen that
        moves to a new position has a start and a stop you can both see, and
        softening only one end looks unfinished. A tab marker, a drawer sliding
        between two stops, an icon rotating in place.
      </P>

      <Compare
        wrong={{
          caption: "Ease-out, 150ms",
          children: <Slide easing={EASE_OUT} ms={150} />,
        }}
        right={{
          caption: "Ease-in-out, 150ms",
          children: <Slide easing={EASE_IN_OUT} ms={150} />,
        }}
      />

      <H2>How long</H2>

      <P>
        About 100 to 150ms for something small, 150 to 250ms for a tooltip or a
        dropdown, 200 to 300ms for a sheet. Past 300ms a person is waiting on
        the interface rather than watching it. Bigger things can take longer,
        because they travel further, not because they are more important.
      </P>

      <P>
        How often the thing happens overrides all of that. A 200ms transition on
        a control used a hundred times a day is a tax charged a hundred times,
        and the right duration for it is none. Duration and frequency are one
        decision, not two.
      </P>

      <H2>What to animate</H2>

      <P>
        Transform and opacity are cheap because the compositor can handle them
        without the browser recalculating layout or repainting. Width, height,
        top and left are none of those things. If a movement can be expressed as
        a translate or a scale, express it that way, and the curve you picked
        will actually be the curve on screen.
      </P>

      <P>
        Finally, none of this survives a reduced motion setting, and it should
        not. Wrap anything decorative in a prefers-reduced-motion query and let
        it arrive instantly. A curve is a nice touch. Being able to use the
        interface is not.
      </P>
    </>
  );
}
