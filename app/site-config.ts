export const siteConfig = {
  title: "design",
  /** Override with NEXT_PUBLIC_SITE_URL on preview deploys. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://design.ryancuff.com",
  description: "animations by ryan, a design engineer.",
  author: {
    name: "ryan",
    href: "https://github.com/rjcuff",
  },
} as const;

/** Places to find me. Rendered in the contact section. */
export const socialLinks = [
  { label: "github", href: "https://github.com/rjcuff" },
  { label: "x", href: "https://x.com/ryancuff_" },
  { label: "instagram", href: "https://instagram.com/design.ryancuff" },
] as const;

/** Single page. Each nav item scrolls to a section id on this page. */
export const navItems = [
  { id: "introduction", label: "introduction" },
  { id: "contact", label: "contact" },
] as const;
