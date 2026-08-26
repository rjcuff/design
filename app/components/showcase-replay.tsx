"use client";

import { createContext, useContext, useEffect } from "react";

export type ReplayPlay = () => Promise<void>;

type ReplayRegistry = {
  register: (play: ReplayPlay) => void;
};

const ReplayContext = createContext<ReplayRegistry | null>(null);

export const ReplayProvider = ReplayContext.Provider;

/**
 * Lets a demo hand its play function up to the card chrome without the card
 * re-rendering it. A render mid-playback would reset the inline transforms
 * the animation frame loop is writing.
 */
export function useReplayTarget(play: ReplayPlay) {
  const registry = useContext(ReplayContext);

  useEffect(() => {
    registry?.register(play);
  }, [registry, play]);
}
