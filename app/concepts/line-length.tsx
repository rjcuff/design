import { CompareStacked, H2, P, Takeaway } from "@/app/components/article";

/**
 * The same paragraph twice, once with no limit on its width and once capped.
 *
 * Static rather than interactive. The problem is a shape you read, not a
 * movement you play, and a hover would just put the two states behind an
 * action nobody needs to take.
 */
const SAMPLE =
  "The measure is the number of characters on a line, and it is the single thing that decides whether a block of text gets read or skipped. Too long and the eye loses the start of the next line on the way back. Too short and it breaks the sentence into pieces before you have finished it.";

export function LineLengthBody() {
  return (
    <>
      <P>
        Nobody sets a line length. It gets set for you by whatever container the
        text landed in, and on a wide screen that container is usually the
        window. The result reads as hard work without looking like anything is
        wrong, which is why it survives review.
      </P>

      <P>
        The cost is at the end of each line. Coming back to the start of the
        next one is a jump the eye makes without looking, and it lands by
        distance. Past about eighty characters it stops landing reliably, you
        re-read a line you have already read, and the paragraph starts to feel
        like effort.
      </P>

      <Takeaway>
        Cap the measure at 60 to 75 characters. The unit is characters, so use
        ch and let the font size do the arithmetic.
      </Takeaway>

      <CompareStacked
        wrong={{
          caption: "No limit. Around 110 characters on a wide screen.",
          children: (
            <p className="text-text-muted text-sm leading-6">{SAMPLE}</p>
          ),
        }}
        right={{
          caption: "max-width: 65ch. The line ends where the eye expects it.",
          children: (
            <p className="text-text-muted max-w-[65ch] text-sm leading-6">
              {SAMPLE}
            </p>
          ),
        }}
      />

      <H2>Why ch and not pixels</H2>

      <P>
        A pixel width is only correct for one font at one size. Change either
        and the measure changes with it, silently. The ch unit is the width of a
        zero in the current font, so a cap written in ch stays the same number
        of characters through a type change, a size change, or someone bumping
        the root font size in their browser.
      </P>

      <P>
        It is an approximation, because a zero is not the average character
        width in most faces. It is close enough that the difference never shows
        up, and it is the only unit that tracks the thing you actually care
        about.
      </P>

      <H2>Where it goes</H2>

      <P>
        On the text, not on a wrapper. A wrapper capped at 65ch also caps the
        images, the code blocks and the tables inside it, and those usually want
        the full width. Put the limit on the paragraph and let everything else
        decide for itself.
      </P>

      <P>
        Short text is exempt. A heading, a label, a caption and a button all sit
        well under the limit already, and capping them does nothing except add a
        rule someone has to read later.
      </P>
    </>
  );
}
