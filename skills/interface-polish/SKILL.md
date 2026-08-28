---
name: interface-polish
description: "the details that separate a shipped interface from a competent one: font rendering and loading without layout shift, letter spacing by size, text wrapping, shadows that read as borders, hairline rules on high density screens, gradients that do not band, scrollbars, focus outlines, z-index as a scale, safe areas, and dark mode that is redrawn rather than inverted. use when an interface is functionally correct but looks unfinished, when text shifts on load, when a border looks wrong, or when reviewing visual detail. triggers on: font rendering, font loading, layout shift, cls, size-adjust, letter spacing, tracking, text-wrap, balance, pretty, hairline border, shadow, gradient banding, scrollbar, focus outline, focus-visible, z-index, stacking context, safe area, notch, dark mode, theme."
---

# interface polish

everything here is small. collectively it is most of the difference between an
interface that looks made and one that looks assembled.

## type

### rendering

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

on macos this thins the strokes. it is the right default for light text on
dark backgrounds and for large display type, and it is arguably wrong for
small dark text on light backgrounds, where the default subpixel rendering is
more legible.

apply it deliberately, not reflexively. if body text looks thin and washed out
on a mac and correct on windows, this is why.

`text-rendering: optimizeLegibility` is not worth it. it enables kerning and
ligatures at a real performance cost on long documents, and modern browsers
already do the useful part.

### loading without shift

a web font that loads after first paint reflows every line it touches. the fix
has three parts and all three matter.

**`font-display: swap`** renders fallback text immediately and swaps when the
web font arrives. the text is readable at once, at the cost of the swap being
visible.

**preload the font file** so the swap happens early rather than late:

```html
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />
```

`crossorigin` is required even for same-origin fonts. without it the browser
fetches the font twice.

**match the fallback metrics** so the swap does not move anything:

```css
@font-face {
  font-family: "Inter Fallback";
  src: local("Arial");
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

`size-adjust` scales the fallback so its x-height matches the real font. with
the four overrides tuned, the swap is nearly invisible and cumulative layout
shift from fonts goes to zero. framework font loaders generate these
automatically, which is the main reason to use one.

subset to the characters you actually need. latin only is usually a third of
the file.

### letter spacing is a function of size

this is the single most under-applied typographic rule in interface work.

large type needs pulling together. small type needs opening up. the optical
correction is real and it is why a headline set at default tracking looks
loose and 10px labels look cramped.

| size | tracking |
| --- | --- |
| 10 to 12px | `+0.02em` to `+0.04em` |
| 14 to 16px | `0` |
| 20 to 30px | `-0.01em` |
| 36 to 48px | `-0.02em` |
| 60px and up | `-0.03em` to `-0.04em` |

**bind tracking to the size in the type scale**, not to the element. a
hand-applied `tracking-tight` gets one size right and every other size that
class touches wrong.

```css
--text-xs: 0.75rem;
--text-xs--line-height: 1rem;
--text-xs--letter-spacing: 0.02em;

--text-6xl: 3.75rem;
--text-6xl--line-height: 1;
--text-6xl--letter-spacing: -0.03em;
```

line height moves the same way and in the same place: tight for display sizes,
generous for body. large text at 1.5 line height looks like a document.

### wrapping

```css
h1, h2, h3 { text-wrap: balance; }
p { text-wrap: pretty; }
```

`balance` evens out the line lengths of a short block, which stops a headline
breaking with one word on the last line. it is capped at a handful of lines by
the spec, so it is for headings only.

`pretty` prevents orphans in longer text at much lower cost.

both degrade to normal wrapping where unsupported. there is no reason not to
use them.

### three weights, and state is never one of them

400, 500, 600 covers everything an interface needs. a fourth is a weight
nobody can place.

more importantly: **a state change must never change font weight.** a hover or
selected state that bolds text reflows that text under the pointer, because
bold glyphs are wider. carry state with color, or with a background, never
with weight.

if a design genuinely requires the bolder look on selection, reserve the space
with a hidden bold copy, or use a variable font with the width axis pinned.

## borders and shadows

### shadows that read as borders

a hairline border and a tight shadow do different things. the border is a hard
edge, the shadow is a suggestion of elevation. an element that needs
definition against a similar background usually wants both, and often wants
the shadow to be doing the border's job.

```css
box-shadow:
  0 0 0 1px oklch(0 0 0 / 0.06),   /* the ring, doing the border's work */
  0 1px 2px oklch(0 0 0 / 0.06),   /* contact */
  0 4px 12px oklch(0 0 0 / 0.04);  /* ambient */
```

three stacked shadows beat one big blur. a single wide shadow reads as a halo.
a tight contact shadow plus a wider ambient one reads as an object on a
surface, because that is what light actually does.

using the `0 0 0 1px` ring instead of `border: 1px` means the ring does not
participate in layout, so a hover that adds definition does not shift the
element by a pixel.

### hairlines on high density screens

`border: 1px` is one css pixel, which is two or three device pixels on a
retina display. it looks heavier than the designer intended.

for a genuine hairline:

```css
.hairline { box-shadow: 0 0 0 0.5px var(--border); }
```

or a transform-scaled pseudo-element for full control. do not chase this
everywhere. it matters on dense surfaces, tables and cards, and it is
invisible on a landing page.

### dark mode shadows are redrawn, not rescaled

there is nothing to darken on a dark surface. a shadow that was subtle in
light mode is invisible in dark mode, and turning up its opacity produces a
smudge.

in dark mode, the ring does the work:

```css
:root       { --shadow-card: 0 0 0 1px oklch(0 0 0 / 0.06), 0 4px 12px oklch(0 0 0 / 0.04); }
.dark       { --shadow-card: 0 0 0 1px oklch(1 0 0 / 0.10), 0 4px 12px oklch(0 0 0 / 0.40); }
```

light border, heavy ambient. that is elevation on a dark surface.

## gradients

a two-stop gradient bands. the eye is very good at seeing the boundary where a
linear ramp meets a flat value, and it reads as a hard line in what was
supposed to be a soft fade.

two fixes.

**sample a curve rather than ramping linearly.** more stops, positioned along
an ease:

```ts
const FADE_STOPS = [0, 0.0608, 0.216, 0.5, 0.784, 0.939, 1]
```

build the gradient from those alpha values at even intervals. the ends round
off and the fade runs out instead of stopping.

**interpolate in oklch** so the midpoint does not go grey:

```css
background: linear-gradient(in oklch, var(--from), var(--to));
```

srgb interpolation between two saturated colors passes through a desaturated
middle. oklch does not. this is most visible on blue to purple and on anything
crossing the hue wheel.

for large gradients, a subtle noise overlay at 2 to 4 percent opacity kills
residual banding completely. it is a tiny tiled png and it is the standard fix
in print and film.

## scrollbars

```css
.scroll-area {
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
  overscroll-behavior: contain;
}
```

`overscroll-behavior: contain` is the important one. without it, scrolling to
the bottom of a modal keeps going and scrolls the page behind it. this is the
scroll chaining bug and it makes every modal feel broken on a trackpad.

do not hide scrollbars on anything that scrolls and is not obviously
scrollable. a hidden scrollbar on a horizontal row is a row a large number of
people will never discover.

## focus outlines

```css
:focus { outline: none; }              /* never do this alone */
:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
```

`:focus-visible` applies on keyboard focus and not on mouse clicks, which is
the behavior everyone wanted when they removed the outline in the first place.
removing `:focus` without adding `:focus-visible` makes an interface
unusable by keyboard and is one of the most common accessibility defects
there is.

`outline` does not affect layout, unlike a border, so it never shifts
anything. use it rather than a box shadow where you can. use `outline-offset`
to keep it clear of the element's own edge.

note that `overflow: hidden` on a parent clips a focus outline. this is a real
tension with rounded cards, and the answer is `outline-offset` inward or the
ring shadow instead.

## z-index is a scale, not a number

`z-index: 9999` is a confession. give the stacking order names and use them:

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
internal ordering cannot leak.

the thing that catches people: many properties create a stacking context
without anyone asking. `transform`, `filter`, `opacity` below 1, `will-change`,
`isolation: isolate`, `contain`, and `clip-path` all do. a child with
`z-index: 999` inside a parent with `opacity: 0.99` cannot escape that parent,
and the fix is almost always to move the element in the dom rather than to
raise the number.

`isolation: isolate` is the deliberate version. put it on a component root and
the component's internal z-indexes become private.

## safe areas

on notched and gesture-bar devices, content can sit under the hardware.

```css
padding-bottom: max(1rem, env(safe-area-inset-bottom));
padding-left: max(1rem, env(safe-area-inset-left));
```

`max()` is what makes this correct on both. it keeps your intended padding on
a normal device and grows only where the inset is larger.

required on: fixed bottom bars, full-screen sheets, anything sticky at the
edge of the viewport. requires `viewport-fit=cover` in the viewport meta or
the insets are all zero.

## dark mode

**define the palette in oklch** and move lightness only. same chroma, same
hue, different lightness keeps light and dark perceptually matched, which srgb
hex pairs never quite are.

```css
:root { --accent: oklch(0.65 0.19 25); }
.dark { --accent: oklch(0.72 0.17 25); }
```

note the chroma drops slightly in dark mode. saturated color on a dark
background reads as more intense than the same color on white, so matching the
numbers exactly makes dark mode look garish.

**do not invert.** dark mode is a second design, not a filter. shadows are
redrawn, borders get lighter rather than darker, images may need a slight
brightness reduction, and pure white text on pure black is harsher than most
people can read for long. `oklch(0.98 0 0)` on `oklch(0.15 0 0)` is easier
than `#fff` on `#000`.

**suppress the transition during the swap**, or every element on the page
animates its color at once, which is a full-page paint. the standard approach
injects `transition: none !important` for one frame. be aware this also kills
any keyframe animation running at that moment, which is a real bug with a real
fix: drive that animation with `@keyframes` rather than a transition.

## checklist

- [ ] font preloaded with `crossorigin`, `display: swap`, metrics overridden
- [ ] letter spacing bound to size in the scale, not applied by hand
- [ ] `text-wrap: balance` on headings, `pretty` on body
- [ ] no state change alters font weight
- [ ] shadows stacked, ring plus contact plus ambient
- [ ] dark mode shadows redrawn, not rescaled
- [ ] gradients interpolated in oklch, multi-stop where they are large
- [ ] `overscroll-behavior: contain` on every scrollable overlay
- [ ] `:focus-visible` present wherever `:focus` was removed
- [ ] z-index from a named scale, components isolated
- [ ] safe area insets on anything fixed to an edge
- [ ] dark palette is a second design, not an inversion
