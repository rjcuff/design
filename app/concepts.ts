import type { ComponentType } from "react";

/**
 * Every concept on the site, grouped the way the sidebar shows them.
 *
 * An entry is either written or it is not. A written one carries a demo and
 * the long description; a soon one carries a single line saying what it will
 * cover, and renders dimmed everywhere it appears. Nothing is hidden, so the
 * shape of the whole thing is visible from the first visit.
 *
 * Add a concept by appending an entry here. Sidebar, index and cards all read
 * from this file, so there is nothing else to wire up.
 */

export type Concept = {
  /** Stable key, also the anchor id on the index page. */
  id: string;
  title: string;
  /**
   * Written entries: what building it taught me, about three short sentences.
   * Soon entries: one line on what it will cover.
   */
  description: string;
  /**
   * Rendered inside the card frame. Demos must be client components, since
   * the card that renders them is one. Leave off for a soon entry.
   *
   * The demos under app/showcase/demos are not wired to anything right now.
   * They go back on an entry by importing one and setting it here.
   */
  component?: ComponentType;
  /** Shows a replay control. For demos that play rather than sit in a state. */
  replay?: boolean;
  /** Not written yet. Dimmed in the sidebar, badged on the card. */
  soon?: boolean;
};

/** Which glyph the sidebar draws for a category. Only the wave animates. */
export type CategoryGlyph = "wave" | "type" | "swatch";

export type Category = {
  id: string;
  title: string;
  /** Color for this category's mark. */
  mark: string;
  glyph: CategoryGlyph;
  concepts: Concept[];
};

/** Where a concept lives. One place, so nothing builds this by hand. */
export function conceptHref(categoryId: string, conceptId: string) {
  return `/${categoryId}/${conceptId}`;
}

export function findConcept(categoryId: string, conceptId: string) {
  const category = categories.find((entry) => entry.id === categoryId);
  const concept = category?.concepts.find((entry) => entry.id === conceptId);
  return category && concept ? { category, concept } : null;
}

export const categories: Category[] = [
  {
    id: "motion",
    title: "Motion",
    mark: "var(--mark-motion)",
    glyph: "wave",
    concepts: [
      {
        id: "icon-morph",
        title: "Icon Morph",
        description:
          "One icon becoming another without a crossfade, by moving the parts they already share.",
      },
      {
        id: "easing-guide",
        title: "Easing Guide",
        description:
          "Which curve to reach for, how long to run it, and why ease-in is almost never the answer.",
      },
    ],
  },
  {
    id: "type",
    title: "Type",
    mark: "var(--mark-type)",
    glyph: "type",
    concepts: [
      {
        id: "line-length",
        title: "Line Length",
        description:
          "The measure decides whether a paragraph gets read, and it is set by the container nobody looked at.",
      },
      {
        id: "weight-over-size",
        title: "Weight Over Size",
        description:
          "Hierarchy without scaling everything up, and why a type scale runs out before the page does.",
        soon: true,
      },
      {
        id: "leading-by-size",
        title: "Leading By Size",
        description:
          "Line height is a ratio that has to tighten as the type grows, not one number for the whole page.",
        soon: true,
      },
      {
        id: "caps-need-air",
        title: "Caps Need Air",
        description:
          "Uppercase set at body tracking looks cramped, and the fix is the one property nobody touches.",
        soon: true,
      },
    ],
  },
  {
    id: "color",
    title: "Color",
    mark: "var(--mark-color)",
    glyph: "swatch",
    concepts: [
      {
        id: "borders-in-alpha",
        title: "Borders In Alpha",
        description:
          "A solid hairline sits on top of a surface. The same line in alpha sits down into it.",
      },
      {
        id: "grey-has-a-hue",
        title: "Grey Has A Hue",
        description:
          "A pure grey reads as a placeholder next to anything colored. Bias it and it looks chosen.",
        soon: true,
      },
      {
        id: "disabled-is-a-token",
        title: "Disabled Is A Token",
        description:
          "Dimming with opacity passes contrast on one background and fails on the next. A token does not move.",
        soon: true,
      },
    ],
  },
];
