export const siteConfig = {
  title: "design",
  /** Override with NEXT_PUBLIC_SITE_URL on preview deploys. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://design.ryancuff.com",
  description: "animations by ryan, a design engineer.",
  version: "v0.1.0",
  status: "MIT licensed",
  author: {
    name: "ryan",
    href: "https://github.com/rjcuff",
  },
} as const;

/** Places to find me. Rendered in the contact section. */
export const socialLinks = [
  { label: "github", handle: "rjcuff", href: "https://github.com/rjcuff" },
  { label: "x", handle: "ryancuff_", href: "https://x.com/ryancuff_" },
] as const;

/** Single page. Each nav item scrolls to a section id on this page. */
export const navItems = [
  { id: "introduction", label: "introduction" },
  { id: "contact", label: "contact" },
] as const;
