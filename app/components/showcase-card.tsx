"use client";

import { useCallback, useMemo, useRef } from "react";

import type { ShowcaseItem } from "@/app/showcase/items";
import { ReplayButton } from "./replay-button";
import { ReplayProvider, type ReplayPlay } from "./showcase-replay";
import styles from "./showcase.module.css";

export function ShowcaseCard({ title, description, component }: ShowcaseItem) {
  const Component = component;
  const playRef = useRef<ReplayPlay | null>(null);

  const registry = useMemo(
    () => ({
      register: (play: ReplayPlay) => {
        playRef.current = play;
      },
    }),
    [],
  );

  const handleReplay = useCallback<ReplayPlay>(
    () => playRef.current?.() ?? Promise.resolve(),
    [],
  );

  return (
    <figure className="m-0">
      <div
        className={`${styles.frame} border border-stone-100 bg-stone-50 shadow`}
      >
        <div className={styles.frameInner}>
          {Component ? (
            <ReplayProvider value={registry}>
              <Component />
            </ReplayProvider>
          ) : null}
        </div>
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-900">{title}</p>
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        </div>
        {Component ? <ReplayButton onReplay={handleReplay} /> : null}
      </figcaption>
    </figure>
  );
}
