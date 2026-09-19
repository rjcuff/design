import Link from "next/link";

import { siteConfig, socialLinks } from "@/app/site-config";

/**
 * Contact and terms for narrow screens.
 *
 * The sidebar carries these and is hidden below `md`, so without this there
 * is no way to reach either on a phone.
 */
export function MobileFooter() {
  return (
    <footer className="border-line border-t px-6 py-10 md:hidden">
      <nav className="flex flex-col gap-2" aria-label="elsewhere">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted text-sm no-underline"
          >
            {link.label}
          </a>
        ))}

        <Link href="/terms" className="text-text-muted text-sm no-underline">
          terms
        </Link>
      </nav>

      <p className="text-text-dim mt-6 text-sm">
        Made by{" "}
        <a
          href={siteConfig.author.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted"
        >
          {siteConfig.author.name}
        </a>
      </p>
    </footer>
  );
}
