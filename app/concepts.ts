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

export type Category = {
  id: string;
  title: string;
  /** Color for this category's mark. */
  mark: string;
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
];
