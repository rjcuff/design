"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { type CategoryGlyph, categories, conceptHref } from "@/app/concepts";
import styles from "./sidebar.module.css";

/**
 * Category marks. One glyph each, all drawn on the same 16px grid at the same
 * stroke weight, so they read as one family rather than three icons that
 * happened to end up in the same column.
 *
 * Each animates in the terms of its own category: the stroked ones redraw
 * themselves, and the color one changes color. They are staggered so the
 * column never moves all at once.
 */
function CategoryMark({
  glyph,
  color,
}: {
  glyph: CategoryGlyph;
  color: string;
}) {
  if (glyph === "type") {
    /*
     * An A, drawn as two strokes so the crossbar can arrive after the apex,
     * the way you would draw it by hand. Same delay on both would have the
     * bar appear out of the middle of nothing.
     */
    return (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="size-4 shrink-0"
        style={{ color }}
      >
        <path
          d="M2.5 13 8 3l5.5 10"
          pathLength={1}
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.draw}
          style={{ "--draw-delay": "2200ms" } as React.CSSProperties}
        />
        <path
          d="M4.6 9.2h6.8"
          pathLength={1}
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          className={styles.draw}
          style={{ "--draw-delay": "2450ms" } as React.CSSProperties}
        />
      </svg>
    );
  }

  if (glyph === "swatch") {
    // A filled disc rather than an outline, because the whole point of this
    // one is the color and a 1.75px stroke is not much color to look at.
    return (
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={`size-4 shrink-0 ${styles.hue}`}
        style={{ color }}
      >
        <circle cx="8" cy="8" r="5" fill="currentColor" />
      </svg>
    );
  }

  /*
   * The wave. Two wavelengths, each half-period a cubic whose control points
   * sit at the thirds.
   */
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="size-4 shrink-0"
      style={{ color }}
    >
      <path
        d="M0 8C1.33 3.74 2.67 3.74 4 8C5.33 12.26 6.67 12.26 8 8C9.33 3.74 10.67 3.74 12 8C13.33 12.26 14.67 12.26 16 8"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        className={styles.draw}
      />
    </svg>
  );
}

/**
 * The grouped list of concepts.
 *
 * Shared, so the sidebar on a wide screen and the drawer on a phone are the
 * same list rather than two that have to be kept in step.
 */
export function ConceptNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  /** The two standalone pages, which sit above the grouped concepts. */
  const pages = [
    { href: "/", label: "Intro" },
    { href: "/goodies", label: "Goodies" },
  ];

  return (
    <nav className="flex flex-col gap-8" aria-label="concepts">
      <div className="flex flex-col">
        {pages.map((page) => {
          const isActive = pathname === page.href;

          return (
            <Link
              key={page.href}
              href={page.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "text-text flex min-h-11 items-center text-sm no-underline md:min-h-0 md:py-1"
                  : "text-text-muted hover:text-text flex min-h-11 items-center text-sm no-underline transition-colors md:min-h-0 md:py-1"
              }
            >
              {page.label}
            </Link>
          );
        })}
      </div>

      {categories.map((category) => (
        <div key={category.id} className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <CategoryMark glyph={category.glyph} color={category.mark} />
            <h2 className="text-text text-sm font-medium">{category.title}</h2>
          </div>

          <div className="flex flex-col gap-2">
            {category.concepts.map((concept) => {
              const href = conceptHref(category.id, concept.id);
              const isActive = pathname === href;

              /*
               * An unwritten concept is listed but not a link. There is
               * nothing behind it yet, and a link that goes to a page saying
               * "not written" wastes the trip.
               *
               * A span rather than a disabled link, because there is no such
               * thing: an anchor without an href is already out of the tab
               * order and unclickable, and aria-disabled would announce a
               * control that is not there.
               */
              if (concept.soon) {
                return (
                  <span
                    key={concept.id}
                    className="text-text-dim flex min-h-11 cursor-default items-center text-sm select-none md:min-h-0"
                  >
                    {concept.title}
                  </span>
                );
              }

              const className = isActive
                ? "text-text flex min-h-11 items-center text-sm no-underline transition-colors md:min-h-0"
                : "text-text-muted hover:text-text flex min-h-11 items-center text-sm no-underline transition-colors md:min-h-0";

              return (
                <Link
                  key={concept.id}
                  href={href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={className}
                >
                  {concept.title}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
