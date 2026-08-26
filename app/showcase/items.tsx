import type { ComponentType } from "react";

export type ShowcaseItem = {
  /** Stable key, also usable as an anchor id. */
  id: string;
  title: string;
  description: string;
  /**
   * Component rendered inside the card frame. Leave undefined for an empty
   * placeholder. Drop a component in here when it is ready.
   */
  component?: ComponentType;
};

/** Add a showcase card by appending an entry here. Nothing else to wire up. */
export const showcaseItems: ShowcaseItem[] = [
  {
    id: "image-timeline",
    title: "image timeline",
    description: "image control at your fingertips.",
  },
  {
    id: "placeholder-two",
    title: "placeholder two",
    description: "a short one-line description of this animation.",
  },
  {
    id: "placeholder-three",
    title: "placeholder three",
    description: "a short one-line description of this animation.",
  },
];
