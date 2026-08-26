import type { ComponentType } from "react";

import OrangeButton from "./demos/orange-button";

export type ShowcaseItem = {
  /** Stable key, also usable as an anchor id. */
  id: string;
  title: string;
  /** What building this one taught me, not a label for what it is. */
  description: string;
  /**
   * Component rendered inside the card frame. Leave undefined for an empty
   * placeholder. Demos must be client components ("use client"), since the
   * card that renders them is one.
   */
  component?: ComponentType;
  /**
   * Set on demos that play an animation, so the card shows a replay control.
   * Leave off for anything driven purely by CSS state.
   */
  replay?: boolean;
};

/** Add a showcase card by appending an entry here. Nothing else to wire up. */
export const showcaseItems: ShowcaseItem[] = [
  {
    id: "orange-button",
    title: "orange button",
    description:
      "buttons are simple, and the pull is to pile on hover colours, lifts and shadows. a 150ms scale on press does more than all of it put together. the one addition worth keeping is will-change: transform on the element itself, which hands it to the gpu up front. the same line on :hover made the jerk worse, because building that layer mid-hover is a repaint of its own. less is more.",
    component: OrangeButton,
  },
];
