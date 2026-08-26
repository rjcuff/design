"use client";

import { useCallback, useState } from "react";

import type { ReplayPlay } from "./showcase-replay";
import styles from "./showcase.module.css";

type ReplayButtonProps = {
  onReplay: ReplayPlay;
};

export function ReplayButton({ onReplay }: ReplayButtonProps) {
  const [plays, setPlays] = useState(0);

  const handleClick = useCallback(() => {
    setPlays((count) => count + 1);
    void onReplay();
  }, [onReplay]);

  return (
    <button
      type="button"
      aria-label="replay"
      onClick={handleClick}
      className="shrink-0 p-1 text-neutral-400 transition-colors duration-150 ease-out hover:text-neutral-900"
    >
      <svg
        key={plays}
        className={plays > 0 ? styles.replaySpin : undefined}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
      </svg>
    </button>
  );
}
