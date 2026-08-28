"use client";

import Link from "next/link";

import { navItems, siteConfig } from "@/app/site-config";
import { useActiveSection } from "./use-active-section";

const sectionIds = navItems.map((item) => item.id);

export function Sidebar() {
  const activeId = useActiveSection(sectionIds);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col bg-white px-6 py-8 md:flex">
      <div className="flex flex-row items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-orange-500" />
        <span className="text-sm font-medium text-neutral-900">
          {siteConfig.title}
        </span>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = activeId === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? "true" : undefined}
              className={
                isActive
                  ? "text-sm text-neutral-900 no-underline transition-colors"
                  : "text-sm text-neutral-500 no-underline transition-colors hover:text-neutral-900"
              }
            >
              {item.label}
            </a>
          );
        })}

        {/* A real page rather than a section anchor, so it sits with the nav
            but stays out of navItems, which drives the scroll spy. */}
        <Link
          href="/terms"
          className="text-sm text-neutral-500 no-underline transition-colors hover:text-neutral-900"
        >
          terms
        </Link>
      </nav>

      {/* Sits under the nav rather than in its own page section, so it is
          reachable from anywhere on the page instead of only from the bottom
          of it. */}
      <div className="mt-6 border-t border-stone-100 pt-6">
        <p className="text-sm text-neutral-400">
          made by{" "}
          <a
            href={siteConfig.author.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 transition-colors hover:text-neutral-900"
          >
            {siteConfig.author.name}
          </a>
        </p>
      </div>
    </aside>
  );
}
