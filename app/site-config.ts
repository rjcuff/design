export const siteConfig = {
  title: "Design",
  /** Override with NEXT_PUBLIC_SITE_URL on preview deploys. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://design.ryancuff.com",
  description: "Design engineering concepts by Ryan, a design engineer.",
  author: {
    name: "Ryan",
    href: "https://github.com/rjcuff",
  },
  repo: {
    label: "rjcuff/design",
    href: "https://github.com/rjcuff/design",
  },
  /** Installs the skills pack through the skills cli. */
  installCommand: "npx skills add rjcuff/design",
} as const;

/** Places to find me. Rendered in the contact section. */
export const socialLinks = [
  { icon: "github", label: "GitHub", href: "https://github.com/rjcuff" },
  { icon: "x", label: "X", href: "https://x.com/ryancuff_" },
] as const;
