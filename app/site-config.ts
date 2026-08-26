export const siteConfig = {
  title: "design",
  version: "v0.1.0",
  status: "MIT licensed",
  author: {
    name: "ryan",
    href: "https://github.com/",
  },
} as const;

/** Single page. Each nav item scrolls to a section id on this page. */
export const navItems = [
  { id: "introduction", label: "introduction" },
  { id: "contact", label: "contact" },
] as const;
