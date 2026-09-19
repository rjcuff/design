import Link from "next/link";

import { siteConfig, socialLinks } from "@/app/site-config";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="currentColor"
        d="M17.2 3h3.3l-7.2 8.2L21.7 21h-6.6l-4.2-5.4L6.1 21H2.8l7.7-8.8L2.6 3h6.7l3.8 5 4.1-5Zm-1.2 16h1.8L8.1 4.8H6.2L16 19Z"
      />
    </svg>
  );
}

const icons: Record<string, () => React.ReactElement> = {
  github: GithubIcon,
  x: XIcon,
};

/**
 * Pinned across the top: the wordmark on the left, links on the right.
 *
 * Fixed rather than scrolling with the page, so the way home and the theme
 * control are reachable from any depth. It sits above the sidebar in the
 * stacking order and the sidebar starts below it, so the two never overlap.
 */
export function Topbar() {
  return (
    <header className="bg-canvas fixed inset-x-0 top-0 z-20 flex h-14 items-center justify-between px-6">
      <div className="flex items-center gap-1">
        <MobileMenu />

        <Link
          href="/"
          className="flex items-center gap-2 no-underline"
          aria-label={`${siteConfig.title}, home`}
        >
          <span className="bg-accent size-2 rounded-full" />
          <span className="text-text text-sm font-medium">
            {siteConfig.title}
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1">
        {socialLinks.map((link) => {
          const Icon = icons[link.icon];
          if (!Icon) return null;

          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-text-muted hover:text-text hover:bg-surface-hover relative grid size-8 place-items-center rounded-md transition-colors after:absolute after:-inset-1.5"
            >
              <Icon />
            </a>
          );
        })}

        {/* Ripple, so the new theme spreads from the button that was pressed
            rather than from the middle of the screen. */}
        <ThemeToggle
          variant="ripple"
          className="text-text-muted hover:text-text hover:bg-surface-hover relative size-8 rounded-md transition-colors after:absolute after:-inset-1.5"
          iconClassName="size-4"
        />
      </div>
    </header>
  );
}
