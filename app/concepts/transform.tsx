"use client";

import { Compare, H2, P, Takeaway } from "@/app/components/article";
import { Hoverable } from "@/app/components/hoverable";

const EASE_OUT = "cubic-bezier(0.215, 0.61, 0.355, 1)";
const MS = 260;

/**
 * A notification arriving over a paragraph, done the two ways.
 *
 * Both sides sit at the same rest state, which is the paragraph and no
 * notification, so the only thing being compared is what happens on the way
 * in. The paragraph is the tell. The height version shoves it down the whole
 * distance, a pixel at a time, because every frame is a new layout.
 */
function Notice({ mode }: { mode: "height" | "transform" }) {
  const copy =
    "Your changes are saved to the draft. Publishing is a separate step.";

  return (
    <Hoverable label="Play the notification">
      {(open) => (
        <div className="relative h-24 w-full max-w-[13rem] overflow-hidden text-left">
          {mode === "height" ? (
            <div
              className="overflow-hidden"
              style={{
                height: open ? 36 : 0,
                transition: `height ${MS}ms ${EASE_OUT}`,
              }}
            >
              <div className="border-line bg-surface-hover text-text flex h-9 items-center rounded-md border px-3 text-xs">
                Saved
              </div>
            </div>
          ) : null}

          <p className="text-text-dim text-xs leading-5">{copy}</p>

          {mode === "transform" ? (
            <div
              className="absolute inset-x-0 top-0 will-change-transform"
              style={{
                transform: open ? "translateY(0)" : "translateY(-100%)",
                transition: `transform ${MS}ms ${EASE_OUT}`,
              }}
            >
              <div className="border-line bg-surface-hover text-text flex h-9 items-center rounded-md border px-3 text-xs">
                Saved
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Hoverable>
  );
}

export function TransformBody() {
  return (
    <>
      <P>
        A browser builds a frame in stages. It works out where everything sits,
        paints the pixels, then hands the layers to the compositor to put on
        screen. Which property you animate decides how many of those stages it
        has to run, and it runs them again for every frame of the transition.
      </P>

      <P>
        Transform only touches that last stage. The element has already been
        measured and painted, and moving it is the compositor rearranging work
        it has in hand. Opacity is the other property that gets this treatment,
        for the same reason. Width, height, top, left, margin and padding all
        send it back to the first stage, sixty times a second, on the same
        thread as your JavaScript.
      </P>

      <Takeaway>
        If a movement can be written as a translate or a scale, write it that
        way. Anything else asks the browser to redo the page on every frame.
      </Takeaway>

      <Compare
        wrong={{
          caption: "Height, 0 to 36px. The paragraph is pushed the whole way.",
          children: <Notice mode="height" />,
        }}
        right={{
          caption: "translateY over the top. The paragraph never moves.",
          children: <Notice mode="transform" />,
        }}
      />

      <P>
        The cost is not only frame rate. Animating height means everything after
        the panel gets a new position on every frame, so the text under it
        slides rather than sitting still, and anything the person was reading
        moves while they read it. The transform version leaves the rest of the
        document alone because it never asks for a new layout.
      </P>

      <H2>What this looks like when it goes wrong</H2>

      <P>
        Rarely like a broken animation. On the machine it was built on it looks
        fine, because that machine has frames to spare. It shows up on a mid
        range phone, on a page that is already rendering a list, as motion that
        arrives in three steps instead of thirty, and by then it reads as the
        app being slow rather than as one transition being wrong.
      </P>

      <H2>When you need the size to change</H2>

      <P>
        Sometimes the layout genuinely has to move, and a scale is a lie. Text
        inside a scaled box gets stretched with it. Two ways out. Reserve the
        space and slide the content into it, which is the right hand demo above.
        Or accept the layout pass, keep it short, and keep it off any frame that
        is already doing work.
      </P>

      <P>
        Where a scale does work is anything without text in it that has to grow
        from a known ratio, a button press or an icon. A press is a scale to
        0.97 rather than a smaller padding, and it costs nothing.
      </P>

      <H2>Translate rather than top and left</H2>

      <P>
        The same movement written as top or left is the version most people
        reach for first, because it is the one the box model suggests. It
        produces a new layout on every frame for a result that is visually
        identical, and it cannot be interrupted cleanly, because the element is
        genuinely somewhere else rather than being drawn somewhere else.
      </P>

      <H2>will-change is not free</H2>

      <P>
        Promoting an element with will-change gives the compositor its own
        layer, which is what makes a transform cheap. A layer also costs memory,
        and a page that promotes every card has spent that memory everywhere and
        gained it nowhere.
      </P>

      <P>
        Put it on the element that actually moves, and only while it is likely
        to move. Left on permanently it is a hint the browser has to keep
        honoring for something that is not happening.
      </P>
    </>
  );
}
