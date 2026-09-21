import { Compare, H2, P, Takeaway } from "@/app/components/article";

/**
 * The same 16px icon in two buttons.
 *
 * The dashed ring is the part that takes the tap, drawn only so it can be
 * seen. In a real interface it is invisible, which is exactly why the small
 * one survives review and then fails on a phone.
 */
function IconButton({ size }: { size: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="border-line-strong grid place-items-center rounded-lg border border-dashed"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="text-text size-4"
        >
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <span className="text-text-dim text-xs">{size}px</span>
    </div>
  );
}

export function HitTargetsBody() {
  return (
    <>
      <P>
        A tap target is not the icon. It is the area that answers to being
        touched, and with a mouse those two can be the same thing, because a
        cursor is one pixel with a visible tip. A finger is neither. It covers
        about a centimeter of glass and it hides the thing it is aiming at.
      </P>

      <P>
        So the number that matters is the size of the area rather than the size
        of the glyph. A 16px close icon can stay 16px forever. What has to grow
        is the box around it. Apple puts the floor at 44pt and Google at 48dp,
        so 44px is the number to design to and anything under it is a decision
        rather than an oversight.
      </P>

      <Takeaway>
        Keep the icon small and grow the target to at least 44px. They are two
        different measurements, and only one of them is visible.
      </Takeaway>

      <Compare
        hint={null}
        wrong={{
          caption: "24px box. Around a third of a fingertip.",
          children: <IconButton size={24} />,
        }}
        right={{
          caption: "44px box, the same 16px icon.",
          children: <IconButton size={44} />,
        }}
      />

      <P>
        The icon is identical in both, and that is the part worth holding onto.
        This is almost never a visual decision being traded away. It is padding
        nobody thought to add.
      </P>

      <H2>Two ways to get there</H2>

      <P>
        Padding, when the button can afford the space. A min-width and
        min-height of 44px with the icon centered inside is the whole fix, and
        it keeps the target and the visible control as one box.
      </P>

      <P>
        A pseudo element, when the layout cannot spare it. An absolutely
        positioned before element with a negative inset extends the target past
        the button without changing what the button occupies, so a dense toolbar
        keeps its spacing and still takes a thumb.
      </P>

      <H2>Gaps count too</H2>

      <P>
        Two 44px targets pressed against each other still make a bad row,
        because the boundary between them has no tolerance at all. Leave a few
        pixels of dead space, so a tap that lands slightly wrong does nothing
        instead of doing the wrong thing. Delete sitting flush against save is
        the version of this that costs somebody real work.
      </P>

      <H2>The desktop version of the same mistake</H2>

      <P>
        A target that is only as big as its text is hard to hit with a mouse as
        well, just less obviously. The usual shape is a row that highlights on
        hover but only responds to a click on the label in the middle of it. If
        it looks like one control, all of it should be one control.
      </P>
    </>
  );
}
