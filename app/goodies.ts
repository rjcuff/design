/**
 * Things worth keeping a link to.
 *
 * Each entry owns a favicon in /public/goodies, fetched once and committed
 * rather than hotlinked. Hotlinking an icon service means every visitor makes
 * a request to somebody else's server for every row on the page, and the page
 * breaks quietly the day that service changes its URLs.
 *
 * Run `npm run goodies:icons` after adding an entry to pull its icon down.
 */

export type Good = {
  /** Also the icon filename, /public/goodies/<id>.png. */
  id: string;
  name: string;
  /** One short line, in my own words. Kept to a single row on the page. */
  note: string;
  href: string;
  /**
   * Draw the mark in the page rather than fetching a favicon for it.
   *
   * For marks that are a shape in one flat color. As an <img> a favicon
   * cannot inherit the page's color, and an svg carrying its own
   * prefers-color-scheme rule follows the operating system rather than this
   * site's theme, so it disappears whenever the two disagree.
   */
  inlineIcon?: "easeui";
};

export type GoodGroup = {
  id: string;
  title: string;
  goods: Good[];
};

export const goodGroups: GoodGroup[] = [
  {
    id: "learning",
    title: "Learning",
    goods: [
      {
        id: "animations-dev",
        name: "animations.dev",
        note: "Emil Kowalski on web animation.",
        href: "https://animations.dev",
      },
      {
        id: "devouring-details",
        name: "Devouring Details",
        note: "Rauno Freiberg on interaction detail.",
        href: "https://devouringdetails.com",
      },
      {
        id: "whimsy",
        name: "Whimsical Animations",
        note: "Josh Comeau on animation worth enjoying.",
        href: "https://whimsy.joshwcomeau.com",
      },
      {
        id: "joshwcomeau",
        name: "Josh Comeau",
        note: "Long posts that explain things properly.",
        href: "https://www.joshwcomeau.com",
      },
      {
        id: "refactoring-ui",
        name: "Refactoring UI",
        note: "Where to start when something looks off.",
        href: "https://www.refactoringui.com",
      },
      {
        id: "web-dev",
        name: "web.dev",
        note: "Platform guides that stay current.",
        href: "https://web.dev",
      },
    ],
  },
  {
    id: "motion",
    title: "Motion",
    goods: [
      {
        id: "motion",
        name: "Motion",
        note: "For when CSS runs out of road.",
        href: "https://motion.dev",
      },
      {
        id: "easings",
        name: "Easings",
        note: "Every named curve, side by side.",
        href: "https://easings.net",
      },
      {
        id: "cubic-bezier",
        name: "cubic-bezier.com",
        note: "Drag a curve into shape.",
        href: "https://cubic-bezier.com",
      },
      {
        id: "spring-visualizer",
        name: "Spring Visualizer",
        note: "Stiffness and damping made visible.",
        href: "https://linear-easing-generator.netlify.app",
      },
    ],
  },
  {
    id: "icons",
    title: "Icons",
    goods: [
      {
        id: "lucide",
        name: "Lucide",
        note: "The default. One grid, clean strokes.",
        href: "https://lucide.dev",
      },
      {
        id: "phosphor",
        name: "Phosphor",
        note: "Six weights of one family.",
        href: "https://phosphoricons.com",
      },
      {
        id: "radix-icons",
        name: "Radix Icons",
        note: "Drawn for 15px, not shrunk to it.",
        href: "https://www.radix-ui.com/icons",
      },
      {
        id: "tabler",
        name: "Tabler Icons",
        note: "A huge free set on one grid.",
        href: "https://tabler.io/icons",
      },
    ],
  },
  {
    id: "reference",
    title: "Reference",
    goods: [
      {
        id: "mdn",
        name: "MDN",
        note: "Still the only docs worth quoting.",
        href: "https://developer.mozilla.org",
      },
      {
        id: "caniuse",
        name: "Can I Use",
        note: "Before shipping anything conveniently new.",
        href: "https://caniuse.com",
      },
      {
        id: "webaim",
        name: "WebAIM Contrast Checker",
        note: "Settles whether a grey passes.",
        href: "https://webaim.org/resources/contrastchecker",
      },
      {
        id: "type-scale",
        name: "Type Scale",
        note: "Sizes that relate to each other.",
        href: "https://typescale.com",
      },
    ],
  },
  {
    id: "looking",
    title: "Worth Looking At",
    goods: [
      {
        id: "mobbin",
        name: "Mobbin",
        note: "Real product screens, searchable.",
        href: "https://mobbin.com",
      },
      {
        id: "recent",
        name: "Recent",
        note: "A daily drip of sites worth studying.",
        href: "https://recent.design",
      },
      {
        id: "linear",
        name: "Linear",
        note: "Speed treated as a design decision.",
        href: "https://linear.app",
      },
      {
        id: "easeui",
        name: "Ease UI",
        note: "My component library, where this ends up.",
        href: "https://easeui.dev",
        inlineIcon: "easeui",
      },
    ],
  },
];
