import { siteConfig, socialLinks } from "@/app/site-config";

/**
 * Contact for narrow screens.
 *
 * The sidebar carries these links and is hidden below `md`, so without this
 * there is no way to reach them on a phone at all.
 */
export function MobileFooter() {
  return (
    <footer className="border-t border-stone-100 px-6 py-10 md:hidden">
      <nav className="flex flex-col gap-2" aria-label="elsewhere">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-500 no-underline"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <p className="mt-6 text-sm text-neutral-400">
        made by{" "}
        <a
          href={siteConfig.author.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-500"
        >
          {siteConfig.author.name}
        </a>
      </p>
    </footer>
  );
}
