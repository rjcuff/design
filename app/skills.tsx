/**
 * The skills pack, as it is sold on the page.
 *
 * A .tsx file rather than .ts because the descriptions hold markup: the
 * phrase worth reading in each one is marked, so the section can be skimmed
 * in three passes without the copy being cut down to bullets.
 */
export const featuredSkills = [
  {
    id: "motion-system",
    name: "motion system",
    description: (
      <>
        <mark>four questions settle every animation</mark> before a line of it
        is written: whether the thing is entering, whether it is already on
        screen, whether it is a hover, and how often someone triggers it. the
        fourth outranks the other three, because{" "}
        <mark>a 200ms transition on a control used all day is a tax</mark>{" "}
        charged all day.
      </>
    ),
  },
  {
    id: "animation-performance",
    name: "animation performance",
    description: (
      <>
        why a frame drops, in terms of what the browser is actually doing.
        layout, paint and composite, what a compositor layer costs, and the{" "}
        <mark>css variable that quietly invalidates a whole subtree</mark> on
        every frame. the real test is not transform or opacity, it is{" "}
        <mark>does this touch layout, and if it paints, how many pixels</mark>.
      </>
    ),
  },
  {
    id: "clip-path",
    name: "clip path",
    description: (
      <>
        the primitive behind a comparison slider, a tab indicator whose label
        inverts as the pill crosses it, and a hold to confirm button.{" "}
        <mark>
          hides part of an element with no wrapper and no layout change
        </mark>
        , which is why it beats animating a width and why it beats the overflow
        hidden box everyone reaches for first.
      </>
    ),
  },
] as const;

export const pack = {
  name: "ease-out",
  /** Total skills in the pack, not just the featured three. */
  packSize: 17,
  price: "$149",
  /**
   * Stripe checkout destination. Set NEXT_PUBLIC_CHECKOUT_URL to a Stripe
   * payment link, or leave it unset and the button renders as unavailable
   * rather than as a link that goes nowhere.
   */
  checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_URL ?? null,
} as const;
