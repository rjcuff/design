"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { categories, conceptHref } from "@/app/concepts";
import styles from "./sidebar.module.css";

/**
 * Category mark: a sine wave that rests fully drawn and, once every seven
 * seconds, draws itself off and back on.
 *
 * A drawn glyph rather than an emoji, so it sits on the text baseline at a
 * weight matching the label instead of whatever the system font decides.
 *
 * Two wavelengths, each half-period a cubic whose control points sit at the
 * thirds. pathLength="1" rescales the path's own length to one unit, so the
 * dash values in the stylesheet are plain numbers and stay correct even if
 * this geometry is edited.
 */
function CategoryMark({ color }: { color: string }) {
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
        className={styles.wave}
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
  const onHome = pathname === "/";

  return (
    <nav className="flex flex-col gap-8" aria-label="concepts">
      <Link
        href="/"
        onClick={onNavigate}
        aria-current={onHome ? "page" : undefined}
        className={
          onHome
            ? "text-text flex min-h-11 items-center text-sm no-underline md:min-h-0"
            : "text-text-muted hover:text-text flex min-h-11 items-center text-sm no-underline transition-colors md:min-h-0"
        }
      >
        Index
      </Link>

      {categories.map((category) => (
        <div key={category.id} className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <CategoryMark color={category.mark} />
            <h2 className="text-text text-sm font-medium">{category.title}</h2>
          </div>

          <div className="flex flex-col gap-2">
            {category.concepts.map((concept) => {
              const href = conceptHref(category.id, concept.id);
              const isActive = pathname === href;

              // Three states, in order of precedence: the page you are on,
              // then anything not written yet, then everything else. The gap
              // between written and unwritten is what makes the list
              // scannable, so it is a real step rather than a shade.
              const className = isActive
                ? "text-text flex min-h-11 items-center text-sm no-underline transition-colors md:min-h-0"
                : concept.soon
                  ? "text-text-dim hover:text-text-muted flex min-h-11 items-center text-sm no-underline transition-colors md:min-h-0"
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
