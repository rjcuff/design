import { Compare, H2, P, Takeaway } from "@/app/components/article";

/**
 * A play button, centered the two ways.
 *
 * The triangle is the standard case because its mass sits along the flat left
 * edge and runs out at the point, so a bounding box that is centered puts most
 * of the ink on the left of the circle. The nudge is one pixel at this size,
 * small enough that the pair has to be seen side by side.
 */
function Play({ nudge }: { nudge: number }) {
  return (
    <div className="border-line bg-surface-hover grid size-14 place-items-center rounded-full border">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="text-text size-5">
        <path
          d="M8 5.5 18 12 8 18.5z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
          transform={`translate(${nudge} 0)`}
        />
      </svg>
    </div>
  );
}

export function OpticalAlignmentBody() {
  return (
    <>
      <P>
        Centering is done on bounding boxes, and a bounding box is a rectangle
        drawn around the widest and tallest parts of a shape. For a square that
        rectangle is the shape. For anything else it is a container holding an
        uneven amount of ink, and centering the container is not the same as
        centering what is inside it.
      </P>

      <P>
        A triangle is the case everybody meets first. All of its weight sits
        along the flat edge and thins out to nothing at the point, so a
        mathematically centered play icon carries most of its mass on the left
        of the circle and looks like it slipped.
      </P>

      <Takeaway>
        Center by eye, then keep the number. The offset is small, usually one or
        two pixels, and the only way to find it is to look at the pair.
      </Takeaway>

      <Compare
        hint={null}
        wrong={{
          caption: "Bounding box centered. Reads as sitting left.",
          children: <Play nudge={0} />,
        }}
        right={{
          caption: "Nudged one pixel right. Reads as centered.",
          children: <Play nudge={1} />,
        }}
      />

      <P>
        Neither triangle is in the middle by measurement, which is the point.
        The right hand one is measurably wrong and looks correct, and once the
        pair has been seen the other one is hard to unsee.
      </P>

      <H2>Where else it turns up</H2>

      <P>
        An icon beside a label, where the icon is a heavier shape than the text
        and wants a little more room than the gap value says. A button with a
        trailing chevron, where the chevron is mostly air and the right padding
        has to come in to compensate. A circular avatar in a row of square
        thumbnails, which has to run slightly larger to look the same size.
      </P>

      <P>
        Type has its own version of this. A flat letter and a round letter that
        end at the same coordinate do not look level, because the round one has
        to overshoot to read as level. A good typeface has already done that for
        you. Layout has not.
      </P>

      <H2>How much to move it</H2>

      <P>
        Less than you expect. One pixel at 16px, two at 24px, and at that point
        stop and look again rather than carrying on to a number that sounds
        tidier. A nudge that has to be large is usually telling you the shape is
        wrong rather than the alignment.
      </P>

      <H2>Leave the square alone</H2>

      <P>
        Symmetrical shapes need nothing, and nudging them is how a grid starts
        to drift. Squares, circles and anything with even weight on both sides
        are already where they should be. The nudge is for shapes whose ink is
        distributed unevenly, which in practice means triangles, chevrons and
        most glyphs.
      </P>
    </>
  );
}
