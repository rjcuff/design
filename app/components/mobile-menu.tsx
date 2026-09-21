"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { ConceptNav } from "./concept-nav";
import { Drawer } from "./drawer";

/**
 * The nav on a phone.
 *
 * The sidebar is hidden below md, so this is the only way to the concepts
 * there. It opens the same list in a sheet, and closing it on navigate
 * matters because most of the links are in-page anchors, and without that the
 * sheet would stay up covering the thing it just scrolled to.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="text-text-muted hover:text-text hover:bg-surface-hover relative -ml-2 grid size-9 place-items-center rounded-md transition-colors after:absolute after:-inset-1"
      >
        <Menu className="size-5" />
      </button>

      <Drawer open={open} onOpenChange={setOpen} title="Concepts">
        <div className="pb-8">
          <ConceptNav onNavigate={() => setOpen(false)} />
        </div>
      </Drawer>
    </div>
  );
}
