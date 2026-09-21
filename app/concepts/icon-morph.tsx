"use client";

import { Compare, H2, P, Takeaway } from "@/app/components/article";
import { Hoverable } from "@/app/components/hoverable";

const BAR = "absolute h-0.5 w-5 rounded-full bg-text will-change-transform";

/** Shared by every morph here. Both ends are on screen, so both want easing. */
const MORPH = "transform 250ms cubic-bezier(0.65, 0, 0.35, 1)";

/**
 * Two whole icons stacked, one fading out while the other fades in.
 *
 * Halfway through, both are on screen at half opacity. Nothing moves, so the
 * eye has nothing to follow between the two states.
 */
function Crossfade({
  from,
  to,
  label,
}: {
  from: React.ReactNode;
  to: React.ReactNode;
  label: string;
}) {
  return (
    <Hoverable label={label}>
      {(on) => (
        <div className="relative grid size-10 place-items-center">
          <div
            className="absolute inset-0 grid place-items-center transition-opacity duration-250 will-change-[opacity]"
            style={{ opacity: on ? 0 : 1 }}
          >
            {from}
          </div>
          <div
            className="absolute inset-0 grid place-items-center transition-opacity duration-250 will-change-[opacity]"
            style={{ opacity: on ? 1 : 0 }}
          >
            {to}
          </div>
        </div>
      )}
    </Hoverable>
  );
}

function MenuIcon() {
  return (
    <div className="relative grid size-5 place-items-center">
      <span className={BAR} style={{ transform: "translateY(-6px)" }} />
      <span className={BAR} />
      <span className={BAR} style={{ transform: "translateY(6px)" }} />
    </div>
  );
}

function CloseIcon() {
  return (
    <div className="relative grid size-5 place-items-center">
      <span className={BAR} style={{ transform: "rotate(45deg)" }} />
      <span className={BAR} style={{ transform: "rotate(-45deg)" }} />
    </div>
  );
}

/**
 * Three bars the whole time. The outer two travel to the center and rotate
 * into the cross. The middle one fades, because three into two means one has
 * to go.
 */
function MenuMorph() {
  const transition = `${MORPH}, opacity 125ms linear`;

  return (
    <Hoverable label="Play the menu morph">
      {(on) => (
        <div className="relative grid size-10 place-items-center">
          <div className="relative grid size-5 place-items-center">
            <span
              className={BAR}
              style={{
                transition,
                transform: on ? "rotate(45deg)" : "translateY(-6px)",
              }}
            />
            <span className={BAR} style={{ transition, opacity: on ? 0 : 1 }} />
            <span
              className={BAR}
              style={{
                transition,
                transform: on ? "rotate(-45deg)" : "translateY(6px)",
              }}
            />
          </div>
        </div>
      )}
    </Hoverable>
  );
}

function PlusIcon() {
  return (
    <div className="relative grid size-5 place-items-center">
      <span className={BAR} />
      <span className={BAR} style={{ transform: "rotate(90deg)" }} />
    </div>
  );
}

/** A plus is already a cross. It only has to turn 45 degrees. */
function PlusMorph() {
  return (
    <Hoverable label="Play the plus morph">
      {(on) => (
        <div className="relative grid size-10 place-items-center">
          <div
            className="relative grid size-5 place-items-center will-change-transform"
            style={{
              transition: MORPH,
              transform: on ? "rotate(45deg)" : "rotate(0deg)",
            }}
          >
            <span className={BAR} />
            <span className={BAR} style={{ transform: "rotate(90deg)" }} />
          </div>
        </div>
      )}
    </Hoverable>
  );
}

function Chevron({ up }: { up?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5">
      <path
        d={up ? "M5 12.5 10 7.5l5 5" : "M5 7.5l5 5 5-5"}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-text"
      />
    </svg>
  );
}

/**
 * The same chevron, turned over. Redrawing it as a second icon is wasted.
 *
 * Worth saying that this works because it is one control changing state. Two
 * different actions that differ only by a rotation, an upload and a download
 * sitting side by side, need a second signal to tell them apart.
 */
function ChevronMorph() {
  return (
    <Hoverable label="Play the chevron morph">
      {(on) => (
        <div className="grid size-10 place-items-center">
          <div
            className="text-text will-change-transform"
            style={{
              transition: MORPH,
              transform: on ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <Chevron />
          </div>
        </div>
      )}
    </Hoverable>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="text-text size-5">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth={1.5} />
      <path
        d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.3 4.3l1 1M14.7 14.7l1 1M15.7 4.3l-1 1M5.3 14.7l-1 1"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="text-text size-5">
      <path
        d="M16.5 12A7 7 0 0 1 8 3.5a7 7 0 1 0 8.5 8.5Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Rotating a sun into a moon. Nothing lines up, so the movement is noise. */
function SunMoonSpin() {
  return (
    <Hoverable label="Play the rotating swap">
      {(on) => (
        <div className="relative grid size-10 place-items-center">
          <div
            className="absolute will-change-transform"
            style={{
              transition: `${MORPH}, opacity 250ms linear`,
              transform: on ? "rotate(90deg) scale(0.5)" : "none",
              opacity: on ? 0 : 1,
            }}
          >
            <SunIcon />
          </div>
          <div
            className="absolute will-change-transform"
            style={{
              transition: `${MORPH}, opacity 250ms linear`,
              transform: on ? "none" : "rotate(-90deg) scale(0.5)",
              opacity: on ? 1 : 0,
            }}
          >
            <MoonIcon />
          </div>
        </div>
      )}
    </Hoverable>
  );
}

export function IconMorphBody() {
  return (
    <>
      <P>
        A menu button and a close button are made of the same parts. A crossfade
        throws that away. It dissolves one picture and prints another, and in
        the middle you see both at half strength. That frame is a smear rather
        than a shape, so the swap reads as a glitch.
      </P>

      <Takeaway>
        If two icons share their parts, move the parts. Crossfade only when they
        share nothing.
      </Takeaway>

      <Compare
        wrong={{
          caption: "Two icons, 250ms crossfade",
          children: (
            <Crossfade
              from={<MenuIcon />}
              to={<CloseIcon />}
              label="Play the crossfade"
            />
          ),
        }}
        right={{
          caption: "Three bars, 250ms transform",
          children: <MenuMorph />,
        }}
      />

      <P>
        On the right, the outer bars slide in and rotate into the cross. The
        middle one fades, because three into two means one has to go. You can
        follow any single bar the whole way, which is what makes it read as one
        object changing instead of two pictures swapping.
      </P>

      <P>
        Two details do most of the work. The fade runs at half the length of the
        movement, so the middle bar is gone before the others finish rotating.
        And the curve is ease-in-out, one of the few places it is right, because
        the bars start and stop on screen and both ends want softening.
      </P>

      <H2>Sometimes it is one rotation</H2>

      <P>
        A plus and a cross are the same two strokes at different angles. There
        is nothing to morph and nothing to fade. Turn the whole thing 45 degrees
        and you are done.
      </P>

      <Compare
        wrong={{
          caption: "Two icons, 250ms crossfade",
          children: (
            <Crossfade
              from={<PlusIcon />}
              to={<CloseIcon />}
              label="Play the plus crossfade"
            />
          ),
        }}
        right={{
          caption: "One icon, rotated 45 degrees",
          children: <PlusMorph />,
        }}
      />

      <P>
        The same applies to a chevron in an accordion or a dropdown. It is one
        icon turned over, not two icons. Rotating it also tells you which way
        the panel went, which a crossfade cannot do.
      </P>

      <Compare
        wrong={{
          caption: "Down and up as separate icons",
          children: (
            <Crossfade
              from={<Chevron />}
              to={<Chevron up />}
              label="Play the chevron crossfade"
            />
          ),
        }}
        right={{
          caption: "One chevron, rotated 180 degrees",
          children: <ChevronMorph />,
        }}
      />

      <H2>When the crossfade is right</H2>

      <P>
        A sun and a moon share nothing. No stroke in one becomes a stroke in the
        other, so there is no path between them to animate. Spinning and scaling
        them past each other looks like effort, but it is movement with no
        meaning behind it, and it takes longer than just swapping.
      </P>

      <Compare
        wrong={{
          caption: "Rotate and scale, 250ms",
          children: <SunMoonSpin />,
        }}
        right={{
          caption: "Crossfade, 250ms",
          children: (
            <Crossfade
              from={<SunIcon />}
              to={<MoonIcon />}
              label="Play the sun and moon crossfade"
            />
          ),
        }}
      />

      <P>
        So the question is not which easing or how long. It is whether the two
        states share any parts at all. A hamburger and a cross do. A plus and a
        cross are the same icon twice. A sun and a moon are genuinely two
        pictures, and there a crossfade is the correct answer.
      </P>
    </>
  );
}
