import { siteConfig } from "@/app/site-config";
import { ConceptNav } from "./concept-nav";

/**
 * The nav on a wide screen. Below md it is hidden and the same list opens in
 * a sheet instead, from the menu button in the top bar.
 */
export function Sidebar() {
  return (
    <aside className="bg-canvas fixed top-14 bottom-0 left-0 z-10 hidden w-64 flex-col overflow-y-auto px-6 py-8 md:flex">
      <ConceptNav />

      {/* Sits under the nav rather than in its own page section, so it is
          reachable from anywhere on the page instead of only from the bottom
          of it. mt-auto pins it to the bottom on a tall window. */}
      <div className="mt-auto pt-6">
        <p className="text-text-dim text-sm">
          Made by{" "}
          <a
            href={siteConfig.author.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text transition-colors"
          >
            {siteConfig.author.name}
          </a>
        </p>
      </div>
    </aside>
  );
}
