function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 shrink-0">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  );
}

/**
 * Link out to the repo.
 *
 * The arrow is an svg rather than a glyph, both because the house style is
 * ascii only and because a drawn one can be sized and aligned to the text
 * instead of sitting wherever the font decides.
 */
export function RepoCard({ repo, href }: { repo: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group border-line bg-surface hover:bg-surface-hover flex items-center justify-between gap-4 rounded-xl border px-4 py-3 no-underline transition-colors"
    >
      <span className="text-text flex items-center gap-3 text-sm">
        <GithubIcon />
        {repo}
      </span>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="text-text-dim group-hover:text-text-muted size-4 shrink-0 transition-colors"
      >
        <path
          d="M7 17 17 7M17 7H9M17 7v8"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
