import type { ComponentType } from "react";

import ClipPath from "./demos/clip-path";
import ListView from "./demos/list-view";
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
      "buttons are simple. a 150ms scale on press beats piling on hover colors, lifts and shadows. will-change: transform belongs on the element itself, not on :hover, where building the layer is its own repaint.",
    component: OrangeButton,
  },
  {
    id: "list-view",
    title: "list view",
    description:
      "if someone sees an interaction a hundred times a day, the right duration is none. this row has no transition and no easing, because a fade reads as lag. will-change buys nothing here either, since background-color is painted, not composited.",
    component: ListView,
  },
  {
    id: "clip-path",
    title: "clip path",
    description:
      "clip-path hides part of an element without touching layout, so it composites like transform does. two layers stacked, the top one clipped with inset, and the split falls straight through the letters. every reveal, slider and wipe is this same trick with the inset animated.",
    component: ClipPath,
  },
];
