import { Compare, H2, P, Takeaway } from "@/app/components/article";

/**
 * Two cards, identical but for how the hairline is expressed.
 *
 * The wrong one is a hardcoded hex, so it stays wrong in both themes, which
 * is the failure being described. The right one uses the site's own border
 * token, which is alpha and therefore already correct in both.
 */
function Card({ border }: { border: string }) {
  return (
    <div
      className="bg-surface-hover flex h-24 w-full max-w-[12rem] flex-col justify-end rounded-xl p-4"
      style={{ border: `1px solid ${border}` }}
    >
      <span className="text-text text-sm font-medium">Card</span>
      <span className="text-text-muted text-xs">Subtitle</span>
    </div>
  );
}

export function BordersInAlphaBody() {
  return (
    <>
      <P>
        A hairline around a card is usually written as a hex value somebody
        picked once against one background. It works there and nowhere else.
        Move the card onto a darker surface and the line is suddenly brighter
        than the thing it is bounding. Move it onto a lighter one and it
        disappears.
      </P>

      <P>
        Written in alpha it stops being a color and becomes a relationship. A
        black at eight percent is a shadow of whatever is behind it, so it
        darkens a light surface and barely touches a dark one, which is what a
        real edge does.
      </P>

      <Takeaway>
        Express a hairline as black or white with alpha, not as a hex. It then
        works on every surface instead of the one it was picked on.
      </Takeaway>

      <Compare
        hint={null}
        wrong={{
          caption: "1px solid #2f2f2f. Sits on top of the surface.",
          children: <Card border="#2f2f2f" />,
        }}
        right={{
          caption: "White or black with alpha. Sits down into it.",
          children: <Card border="var(--line-strong)" />,
        }}
      />

      <P>
        The solid one reads as a drawn rectangle around a card. The alpha one
        reads as the edge of the card itself. Neither is brighter than the other
        in any measurable sense, and at a glance only one of them looks
        deliberate.
      </P>

      <H2>Which color to start from</H2>

      <P>
        On a dark surface, white at six to twelve percent. On a light one, black
        at six to ten. White on light and black on dark both go grey and muddy,
        because you are lightening something already light or darkening
        something already dark, and neither produces an edge.
      </P>

      <P>
        That gives one token per theme rather than one per surface, which is the
        actual saving here. A palette with a border color for cards, one for
        inputs and one for the sidebar is three values that will drift.
      </P>

      <H2>When a shadow is better</H2>

      <P>
        A border takes up a pixel of the box. A ring drawn as a shadow does not,
        so it never changes a layout by existing, and it can sit over a rounded
        corner without the corner having to agree with it.
      </P>

      <P>
        The tradeoff is that a shadow ring does not participate in layout at
        all, so two adjacent elements will not collapse their edges the way
        borders do. Use the border when the line is structural, and the ring
        when it is only there to describe a surface.
      </P>
    </>
  );
}
