---
name: landing-page-layout
description: "how a landing page is laid out, as opposed to a blog: the canvas sets the width and sections fill it, hierarchy from grid splits rather than centering, sticky copy columns beside scrolling evidence, padding as the budget, full bleed rows for logos and stats, continuous hairline rules between cells, and a type hierarchy with no size nobody can place. use when laying out a marketing page or a section of one, when a page looks assembled rather than designed, or when deciding where a width constraint belongs. triggers on: landing page layout, section layout, max-width, canvas, grid split, six column grid, sticky column, self-start, padding, full bleed, logo row, stat row, hairline, divide-y, type hierarchy, tracking-tighter, corner marks, looks like a blog."
---

# landing page layout

the difference between a page that looks bought and one that looks written is
almost entirely structural. this file is that structure.

## the one rule everything follows

**the canvas sets the width. sections fill it.**

```tsx
// layout, declared once
<div className="border-border mx-auto w-full max-w-7xl border-x">
  {children}
</div>

// every section, no width of its own
<section className="relative w-full">
```

if you find yourself writing `mx-auto max-w-5xl` inside a section, stop. that
is the mistake that makes a page read as a blog: a column of content floating
in the middle of a wide viewport with dead air on either side, section after
section, all the same width, nothing ever touching an edge.

the only legitimate width constraint inside a section is on **a run of prose**,
where line length is a readability requirement:

```tsx
<p className="text-muted-foreground max-w-xl">...</p>
```

that is a paragraph deciding its measure. it is not a layout.

## hierarchy comes from splits, not from centering

a section is a grid across the full canvas, divided by borders. the split
carries the hierarchy: a narrow column states the thing, a wide column shows
it.

```tsx
<div className="grid grid-cols-1 md:grid-cols-6">
  {/* the claim. sticky, so it stays while the evidence goes past. */}
  <div className="p-8 md:col-span-2 md:sticky md:top-20 md:self-start md:p-10 lg:p-14">
    ...
  </div>

  {/* the evidence. border on the leading edge, never a wrapper. */}
  <div className="border-border border-t md:col-span-4 md:border-t-0 md:border-l">
    <div className="divide-border divide-y">...</div>
  </div>
</div>
```

four things that matter here.

**six columns, not twelve.** 2/4 and 3/3 are the only splits you need, and six
makes both exact. twelve invites a 5/7 that nobody can justify.

**the divider goes on the second cell**, not on a wrapper. on a phone it
becomes a top border and the same rule keeps working, with no extra element
and no doubled edge.

**`md:self-start` is the part people miss.** without it the grid cell stretches
to the row height and `sticky` has nothing to move within, so the column
simply does not stick and nobody can see why.

**sticky is a desktop breakpoint only.** a pinned column on a phone is a column
following you around a screen it does not fit on.

## padding is the budget

generous vertical space is most of what makes a page feel paid for. these
numbers are larger than feels right until you see them next to the
alternative.

| where | padding |
| --- | --- |
| section header block | `p-6 md:p-24` |
| content cell | `p-8 md:p-10 lg:p-14` |
| full bleed row (logos, stats) | `h-32` per cell, no padding |

a section at `py-14` reads as cramped beside one at `md:p-24`. pick the big
number. the instinct to tighten it up is almost always wrong on a marketing
page, and almost always right in a product surface, which is why the two do
not share a spacing scale.

## the section header

one component, used by every section, with a rule under it.

```tsx
export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border w-full border-b p-6 md:p-24">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-2">
        {children}
      </div>
    </div>
  )
}
```

**`max-w-lg` on the header while the body below runs full width** is the whole
trick. a centered heading over a wide body reads as composed. a heading as
wide as its body reads as a document.

this is the one place centering is correct, and it is correct because it is a
deliberate contrast with everything under it.

heading type: `text-3xl md:text-4xl lg:text-6xl font-medium tracking-tighter
text-balance`. tighter tracking at larger sizes, always. `text-balance` stops
a three word heading breaking with one word alone on the second line.

## full bleed rows

logos, stats and anything countable go edge to edge in their own grid, with a
label cell beside them rather than a heading above them.

```tsx
<div className="divide-border grid grid-cols-1 divide-y lg:grid-cols-6 lg:divide-y-0">
  <p className="col-span-2 inline-flex min-h-20 items-center justify-center text-center">
    Trusted by fast growing startups
  </p>

  <div className="border-border col-span-4 grid grid-cols-2 gap-px md:grid-cols-4 lg:border-l">
    {logos.map((logo) => (
      <div key={logo.id} className="flex h-32 w-full items-center justify-center p-4">
        {logo.mark}
      </div>
    ))}
  </div>
</div>
```

do not center a logo grid in a narrow box. it is the single clearest tell that
a page was assembled rather than designed: the row that is supposed to say
"lots of people use this" instead says "here are six things in a small box".

the label beside rather than above is what makes it a row instead of a
section. it costs nothing and it reads as considered.

### rules between cells that bleed

for hairlines that should run past a cell's own bounds, use pseudo-elements
sized to the viewport rather than borders sized to the cell.

```tsx
className="relative
  before:bg-border before:absolute before:-left-1 before:top-0 before:h-screen before:w-px before:content-['']
  after:bg-border after:absolute after:-top-1 after:left-0 after:h-px after:w-screen after:content-['']"
```

each cell draws one rule up and one rule left, overshooting its own box. the
grid ends up with continuous rules and no doubled edges, and nothing has to
know how many columns there are or which cell is on an end.

## the page

`divide-y` on `main`, so no section draws its own top or bottom rule.
reordering can then never produce a doubled border or a missing one.

```tsx
<main className="divide-border flex flex-col divide-y pt-16">
  <HeroSection />
  ...
</main>
```

`pt-16` clears a fixed header. put it here, once, not on the hero.

## type hierarchy

| level | where | type |
| --- | --- | --- |
| page | hero `h1` | `text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight` |
| section | header `h2` | `text-3xl md:text-4xl lg:text-6xl font-medium tracking-tighter` |
| block | cell `h3` | `text-3xl lg:text-4xl font-medium tracking-tighter` |
| item | card title | `text-sm font-medium` |
| body | anywhere | `text-sm leading-6` or `text-base leading-7` |

two things to notice.

**the section heading is nearly as large as the page heading.** a landing page
is a sequence of arguments and each one gets to open at full volume. a section
heading two steps down from the hero reads as a subheading, and the page
flattens into one long article.

**there is a hard drop from block titles to item titles**, and nothing sits in
between. a fifth size is a size nobody can place, and the moment it exists
every new element becomes a decision.

## decoration, in order of value

1. **corner marks.** hairline crosshairs overshooting each corner of a
   section. the cheapest way to make stacked sections feel constructed.
2. **a badge above each heading.** the same pill every time, so twelve
   sections get structure without twelve layouts.
3. **a radial pool behind the hero type**, tighter than a section wide wash,
   so the eye lands on the headline rather than drifting.
4. **one full bleed effect, at the call to action only.** it is the one place
   nothing has to be read carefully.

everything past that is noise. **if a section needs decoration to be
interesting, the section is wrong**, and the fix is in the copy or the
evidence, not in the background.

## checklist

- [ ] canvas declared once in the layout, `max-w-7xl border-x`
- [ ] every section `w-full`, no width of its own
- [ ] no width constraint except on a paragraph or a section header
- [ ] splits are 2/4 or 3/3 on a six column grid
- [ ] divider borders on the second cell, top border on mobile
- [ ] copy columns `md:sticky md:top-20 md:self-start`
- [ ] headers `p-6 md:p-24`, cells `p-8 md:p-10 lg:p-14`
- [ ] `divide-y` on `main`, `pt-16` once for the fixed header
- [ ] logo and stat rows full bleed, cells `h-32`, label beside not above
- [ ] section headings `lg:text-6xl tracking-tighter`
- [ ] five type levels, no sixth
- [ ] no more than the four decorations, in that order
