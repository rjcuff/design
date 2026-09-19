import type { ReactNode } from "react";

/** Body copy. One width, one rhythm, set in one place. */
export function P({ children }: { children: ReactNode }) {
  return <p className="text-text-muted mt-4 text-sm leading-6">{children}</p>;
}

/** A heading inside the body, for when a concept has more than one part. */
export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-text mt-12 text-base font-medium">{children}</h2>;
}

/**
 * The line the whole piece is there to make. Set in the plain text color at
 * body size rather than blown up, so it reads as the sentence that matters
 * instead of as another heading.
 */
export function Takeaway({ children }: { children: ReactNode }) {
  return (
    <p className="text-text mt-6 text-sm leading-6 font-medium">{children}</p>
  );
}

function WrongIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path
        d="m5.5 5.5 5 5m0-5-5 5"
        stroke="var(--canvas)"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </svg>
  );
}

function RightIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path
        d="m4.75 8.25 2.25 2.25 4.25-4.5"
        stroke="var(--canvas)"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * One side of a comparison.
 *
 * The caption under the frame says what was actually done, so the pair can be
 * read without the surrounding copy. The word wrong or right is the verdict,
 * the caption is the evidence.
 */
function Side({
  verdict,
  caption,
  children,
}: {
  verdict: "wrong" | "right";
  caption: string;
  children: ReactNode;
}) {
  const isWrong = verdict === "wrong";

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`flex items-center gap-2 text-sm font-medium ${
          isWrong ? "text-fail" : "text-pass"
        }`}
      >
        {isWrong ? <WrongIcon /> : <RightIcon />}
        {isWrong ? "Wrong" : "Right"}
      </div>

      <div className="border-line bg-surface flex w-full items-center justify-center rounded-xl border p-6">
        {children}
      </div>

      <p className="text-text-dim text-center text-xs">{caption}</p>
    </div>
  );
}

/**
 * The wrong and the right one, side by side.
 *
 * Both run at once rather than behind a toggle. The difference between two
 * timings is nearly impossible to judge from memory, and a toggle asks you to
 * do exactly that.
 */
export function Compare({
  wrong,
  right,
}: {
  wrong: { caption: string; children: ReactNode };
  right: { caption: string; children: ReactNode };
}) {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Side verdict="wrong" caption={wrong.caption}>
          {wrong.children}
        </Side>
        <Side verdict="right" caption={right.caption}>
          {right.children}
        </Side>
      </div>

      <p className="text-text-dim mt-6 text-center text-xs">
        Point at either one to play it
      </p>
    </div>
  );
}
