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
function Verdict({ wrong }: { wrong: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium ${
        wrong ? "text-fail" : "text-pass"
      }`}
    >
      {wrong ? <WrongIcon /> : <RightIcon />}
      {wrong ? "Wrong" : "Right"}
    </div>
  );
}

function Side({
  verdict,
  caption,
  children,
}: {
  verdict: "wrong" | "right";
  caption: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center gap-4">
      <Verdict wrong={verdict === "wrong"} />

      {/*
       * Grows to the tallest frame in the row. The two demos rarely measure
       * the same, and a pair of frames at different heights puts the captions
       * on different lines, which reads as a layout bug rather than as the
       * difference being demonstrated.
       */}
      <div className="border-line bg-surface flex w-full flex-1 items-center justify-center rounded-xl border p-6">
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
  hint = "Point at either one to play it",
}: {
  wrong: { caption: string; children: ReactNode };
  right: { caption: string; children: ReactNode };
  /** Set to null for a pair that is not interactive. */
  hint?: string | null;
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

      {hint ? (
        <p className="text-text-dim mt-6 text-center text-xs">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * The same pair, stacked and full width.
 *
 * For anything whose problem is its width. Half a column each would make the
 * wrong one look fine, which is the opposite of the point.
 */
export function CompareStacked({
  wrong,
  right,
}: {
  wrong: { caption: string; children: ReactNode };
  right: { caption: string; children: ReactNode };
}) {
  return (
    <div className="mt-8 flex flex-col gap-8">
      {[
        { verdict: "wrong" as const, ...wrong },
        { verdict: "right" as const, ...right },
      ].map((side) => (
        <div key={side.verdict} className="flex flex-col gap-3">
          <Verdict wrong={side.verdict === "wrong"} />

          <div className="border-line bg-surface rounded-xl border p-5">
            {side.children}
          </div>

          <p className="text-text-dim text-xs">{side.caption}</p>
        </div>
      ))}
    </div>
  );
}
