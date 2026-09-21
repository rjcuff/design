"use client";

import { Compare, H2, P, Takeaway } from "@/app/components/article";
import { Hoverable } from "@/app/components/hoverable";

const EASE_OUT = "cubic-bezier(0.215, 0.61, 0.355, 1)";

/**
 * A button whose hover state changes three things. The background, a border
 * that was not there before, and a small lift.
 *
 * The wildcard version animates the border width along with everything else,
 * and because the box is border-box that pushes the label around while the
 * transition runs. Nobody asked for that. It came with the all.
 */
function Button({ wildcard }: { wildcard: boolean }) {
  return (
    <Hoverable label="Play the hover">
      {(hover) => (
        <div className="grid h-16 w-full place-items-center">
          <div
            className="text-text box-border flex h-10 w-32 items-center justify-center rounded-lg text-sm font-medium"
            style={{
              backgroundColor: hover
                ? "var(--surface-hover)"
                : "var(--surface)",
              border: hover
                ? "2px solid var(--line-strong)"
                : "0px solid var(--line-strong)",
              transform: hover ? "translateY(-2px)" : "translateY(0)",
              transition: wildcard
                ? `all 250ms ${EASE_OUT}`
                : `background-color 120ms ease, transform 150ms ${EASE_OUT}`,
            }}
          >
            Save
          </div>
        </div>
      )}
    </Hoverable>
  );
}

export function NameThePropertiesBody() {
  return (
    <>
      <P>
        Reaching for all as the transition property is not a shortcut for the
        properties you are animating. It is a subscription to every property on
        that element that is animatable now or becomes animatable later,
        including the ones someone else adds to the hover state six months from
        now.
      </P>

      <P>
        The failure is quiet. Nothing errors, nothing looks broken in review,
        and the component just develops a slight sogginess that gets blamed on
        the framework. What actually happened is that a border, a padding or a
        width joined the transition and started running a layout pass on every
        frame.
      </P>

      <Takeaway>
        List the properties you mean. Naming two of them is one extra line, and
        it is the line that stops the third one joining later.
      </Takeaway>

      <Compare
        wrong={{
          caption: "all 250ms. The border grows in and shoves the label.",
          children: <Button wildcard />,
        }}
        right={{
          caption: "Background and transform only. The border is instant.",
          children: <Button wildcard={false} />,
        }}
      />

      <P>
        Both buttons end up identical. The difference is that one of them
        decided on its own to animate a border from zero to two pixels, and
        since the box is border-box, the label gets squeezed for a quarter of a
        second every time you point at it.
      </P>

      <H2>One duration for everything is the other half</H2>

      <P>
        A wildcard also forces one duration and one curve on properties that
        want different ones. A color wants around 100ms on a plain ease, because
        it is a state change rather than a movement. A lift wants 150ms on an
        ease-out. Run the color at the timing of the movement and the button
        looks like it is thinking about it.
      </P>

      <P>
        Naming them gets you that for free, because the syntax is already
        per-property. Two declarations separated by a comma, each with its own
        duration and curve.
      </P>

      <H2>Where it bites hardest</H2>

      <P>
        Theme switching. Every element carrying a transition on its colors will
        animate at its own duration when the theme flips, so the page changes
        over in waves instead of at once. The fix is to turn transitions off for
        the moment of the switch rather than to tune them, and next-themes ships
        that as disableTransitionOnChange.
      </P>

      <P>
        The other one is a component that renders twice. Anything that mounts
        with placeholder styles and gets its real ones on a second pass has a
        style change, and a style change is all a transition needs. With named
        properties that is one harmless color fade. With a wildcard it is every
        property that happens to differ between the two renders.
      </P>

      <H2>The one case for all</H2>

      <P>
        A throwaway prototype where the point is to see the idea move. Even
        there it is worth knowing you are trading a specific bug later for
        thirty seconds now, and that the trade rarely stays in the prototype.
      </P>
    </>
  );
}
