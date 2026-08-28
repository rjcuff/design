---
name: design-tokens
description: "a token layer that can be rethemed by overriding one block: where each token lives, the split between primitives and framework mappings, type scales that carry their own leading and tracking, duration named for the job, three-part elevation, blur ceilings, a stacking ladder, and the hard rule about which tokens a distributed component is allowed to use. use before adding a token, before using a token class inside a component that ships to other projects, or when setting up a theme layer. triggers on: design token, theme, retheme, custom theme, css variables, type scale, letter spacing, duration token, shadow token, elevation, z-index scale, blur token, oklch, tailwind theme, at-theme, globals.css, does the consumer get this."
---

# design tokens

a token layer has two jobs. it makes a change in one place reach everywhere,
and it makes the design legible as a set of decisions rather than a pile of
values.

it fails in one specific way: a component that reads a token the consuming
project does not have. that failure is silent, so most of this file is about
preventing it.

## file layout

one entry point that imports, and nothing else.

```
styles/
  globals.css            entry. imports only.
  tokens/
    color.css            palettes light and dark, chart series, radius
    typography.css       type scale with paired leading and tracking, weights
    elevation.css        shadows per theme, blur, stacking scale
    motion.css           durations, easing curves, animation shorthands
  keyframes.css          the keyframes those shorthands point at
  base.css               base layer, reduced motion, selection, cursors
  prose.css              long-form and code block styles
```

two ordering rules, both load-bearing.

1. **tokens import before anything that reads them.**
2. **prose or override files import last.** a media query adds no specificity,
   so when a small-screen rule has to beat a base rule, source order is the
   only thing deciding it.

a build-time css bundler flattens all of this, so the split costs no request.

## the two layers

**primitives** live in `:root` and `.dark`. raw values. this is the theming
surface and the only thing anyone should override.

**framework mappings** bind primitives to utility names. in tailwind v4 that
is `@theme`. this is plumbing, not design. do not edit it to change how
something looks.

```css
:root {
  --accent: oklch(0.65 0.19 25);
}
.dark {
  --accent: oklch(0.72 0.17 25);
}

@theme inline {
  --color-accent: var(--accent);
}
```

`@theme inline` matters wherever a token differs between light and dark. it
makes the generated utility reference the variable rather than baking in one
value, so the `.dark` override actually reaches it. colors and shadows need
it. a type scale and a set of easing curves do not.

## the rule that actually matters

> **a component that ships to other projects may only use a token it ships
> with itself.**

a distributed component is copied into a codebase that does not have your
styles folder. if it says `text-2xs` and the consumer has no `--text-2xs`,
the labels silently fall back to an inherited size and the component is wrong,
with no error anywhere.

| | your own app code | a component you distribute |
| --- | --- | --- |
| your design system tokens | use freely | only if it ships the token itself |
| baseline theme colors the ecosystem defines | yes | yes |
| anything else | not applicable | arbitrary values, self contained |

**an arbitrary value inside a distributed component is not a smell.** it is
the component being honest about being self contained. `text-[10px]` in a
shipped component beats `text-2xs` that resolves to nothing.

where the distribution mechanism supports it, declare the requirement instead:

```json
"cssVars": {
  "theme": { "ease-out-quart": "cubic-bezier(0.165, 0.84, 0.44, 1)" }
}
```

before using a new token class inside distributed code, check that the
component declares it, or use an arbitrary value.

## retheming

override primitives. nothing else.

```css
:root {
  --accent: oklch(0.65 0.19 25);
  --radius: 0.75rem;
  --duration-ui: 140ms;
}
.dark {
  --accent: oklch(0.72 0.17 25);
}
```

**use oklch.** light and dark stay perceptually matched when you hold chroma
and hue and move lightness, which srgb hex pairs never quite do. drop chroma
slightly in dark mode: saturated color reads as more intense on a dark
background, so matching the numbers exactly makes dark mode look garish.

## the scales

### type

**every step carries its own line height and letter spacing.** correct
tracking is a function of size: large type wants pulling together, small type
wants opening up. a hand-applied `tracking-tight` gets one size right and
every other size that class touches wrong.

```css
--text-2xs: 0.625rem;
--text-2xs--line-height: 0.875rem;
--text-2xs--letter-spacing: 0.03em;

--text-6xl: 3.75rem;
--text-6xl--line-height: 1;
--text-6xl--letter-spacing: -0.03em;
```

keep the framework's existing names and rem values so nothing that already
reads `text-sm` moves. add at the ends: a 10px step for dense labels, and
display steps for marketing headlines between the largest body size and the
largest heading.

display steps use unitless line height so a wrapped headline follows its own
size.

**three weights only.** 400, 500, 600. a fourth is a weight nobody can place.
and a hover or selected state must never change weight, because bold glyphs
are wider and the text reflows under the pointer. state is carried by color.

### duration

**name durations for the job.** a raw number never says which one a dropdown
should use.

```css
--duration-micro: 120ms;      /* press, toggle, icon swap */
--duration-ui: 180ms;         /* tooltip, dropdown, tab */
--duration-panel: 260ms;      /* modal, drawer, popover */
--duration-page: 360ms;       /* route change */
--duration-marketing: 600ms;  /* entrance on a page read once */
```

product surfaces stay at `panel` or under. `marketing` exists for pages that
are read rather than operated, and using it in a product surface is the most
common way an app comes to feel slow.

### elevation

**three stacked shadows, not one big blur.** a tight contact shadow, a mid
spread, a wide ambient. one wide shadow reads as a halo. three read as an
object on a surface, because that is what light does.

```css
--shadow-card:
  0 0 0 1px oklch(0 0 0 / 0.06),
  0 1px 2px oklch(0 0 0 / 0.06),
  0 4px 12px oklch(0 0 0 / 0.04);
```

**dark mode is redrawn, not rescaled.** there is nothing to darken on a dark
surface, so the ring does the work: a lighter border and a heavier ambient.

```css
.dark {
  --shadow-card:
    0 0 0 1px oklch(1 0 0 / 0.10),
    0 4px 12px oklch(0 0 0 / 0.40);
}
```

the `0 0 0 1px` ring instead of a real border means definition does not
participate in layout, so a hover that adds a ring does not shift the element
by a pixel.

### blur

```css
--blur-sm: 4px;
--blur-md: 8px;
--blur-lg: 16px;     /* ceiling for anything animated */
--blur-scrim: 64px;  /* static only */
```

**cap animated blur at about 16px.** past roughly 20px, filters spread badly
and cost a lot, and safari is meaningfully worse than chromium.

the large value is deliberately over that line and is **static only**: one
pass over a container whose children move underneath it. never animate it.
label it in the token name so nobody has to know the rule to follow it.

### stacking

```css
--z-raised: 10;
--z-sticky: 20;
--z-overlay: 40;
--z-modal: 50;
--z-popover: 60;
--z-toast: 70;
--z-tooltip: 80;
```

anything not on the ladder belongs inside its own stacking context, where its
internal ordering cannot leak. `isolation: isolate` on a component root is the
deliberate way to do that.

## tokens without a framework namespace

in tailwind v4, duration and z-index have no `@theme` namespace, so they
generate no utilities. reach them the way you would any custom property:

```
duration-(--duration-ui)
z-(--z-modal)
```

color, type, weight, shadow, blur, easing and radius all do have namespaces
and generate utilities normally. knowing which is which saves a confusing
twenty minutes.

## adding a token

1. put the primitive in the right file, in `:root`, and in `.dark` too if it
   differs by theme.
2. map it in that file's `@theme` block. use `@theme inline` if it is theme
   dependent.
3. **write down why the value is what it is.** not what it is named. the blur
   ceiling exists because of safari, the duration scale exists because of
   frequency, and a token whose reason is not recorded gets changed by someone
   who does not know it.
4. if a distributed component will use it, add it to that component's declared
   requirements and rebuild.

## checklist

- [ ] primitive in a token file, never in a component
- [ ] `@theme inline` if it varies between light and dark
- [ ] oklch, chroma dropped slightly in dark mode
- [ ] type steps carry their own leading and tracking
- [ ] three weights, and no state change alters weight
- [ ] durations named for the job
- [ ] shadows stacked, dark mode redrawn
- [ ] animated blur under the ceiling, large blur labeled static
- [ ] z-index from the ladder, components isolated
- [ ] distributed components ship the tokens they use, or use arbitrary values
- [ ] override files imported last
- [ ] every token has a comment saying why, not what
