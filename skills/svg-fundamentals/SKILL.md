---
name: svg-fundamentals
description: "svg coordinate systems, viewBox, path syntax, stroke-based line drawing, pathLength normalization, and transform origins, for building and animating svg components. use when writing or reviewing svg markup, animating a path, making an svg responsive, drawing a chart or a gauge, sizing icons, or debugging a shape that will not render or a transform that pivots from the wrong point. triggers on: viewBox, path, d attribute, stroke-dasharray, stroke-dashoffset, pathLength, transform-origin, transform-box, vector-effect, preserveAspectRatio, non-scaling-stroke, line drawing animation, svg chart, svg icon, currentColor, mask, clipPath id."
---

# svg fundamentals

svg is a coordinate system with a drawing api attached. almost every svg bug is
a coordinate system misunderstanding, and almost every svg animation is a
stroke trick.

## viewBox is the whole thing

```html
<svg viewBox="0 0 100 100">
```

four numbers: `min-x min-y width height`. they define an internal coordinate
space. everything inside the svg is expressed in that space, and the browser
maps it onto whatever size the element actually renders at.

this is why an svg scales cleanly and why `width` and `height` attributes are
mostly noise. the viewBox is the drawing. the css size is the presentation.

**pick one box and express everything as a fraction of it.** a component that
draws in `0 0 100 100` and takes a pixel `size` prop stays legible, because
every number in the markup is a percentage you can read at a glance.

```tsx
/** the box the ring is drawn in. every measurement is a share of this. */
const BOX = 100

const radius = (BOX - thickness) / 2
const circumference = 2 * Math.PI * radius
```

```tsx
<svg viewBox={`0 0 ${BOX} ${BOX}`} className="size-full" aria-hidden="true">
  <circle cx={BOX / 2} cy={BOX / 2} r={radius} fill="none" strokeWidth={thickness} />
</svg>
```

the svg fills its container, the container has the pixel size, and nothing
inside the markup has to know what that size is.

### making it responsive

```css
svg { display: block; width: 100%; height: auto; }
```

`display: block` matters. svg is inline by default, so it sits on a text
baseline and picks up a few pixels of descender space underneath. that is the
mysterious gap under an svg, and this is the fix.

### preserveAspectRatio

controls what happens when the container aspect ratio does not match the
viewBox.

```html
preserveAspectRatio="xMidYMid meet"   <!-- default: fit inside, centered -->
preserveAspectRatio="xMidYMid slice"  <!-- fill and crop -->
preserveAspectRatio="none"            <!-- stretch, distorting -->
```

`meet` is right for icons and diagrams. `slice` is right for a decorative
background that should cover. `none` is right almost never, and when it is
right you usually wanted two separate shapes.

## paths

the `d` attribute is a sequence of commands. uppercase means absolute
coordinates, lowercase means relative to the current point.

| command | does |
| --- | --- |
| `M x y` | move to, without drawing |
| `L x y` | line to |
| `H x` / `V y` | horizontal / vertical line |
| `C x1 y1 x2 y2 x y` | cubic bezier, two control points |
| `S x2 y2 x y` | smooth cubic, first control point mirrored from the previous |
| `Q x1 y1 x y` | quadratic bezier, one control point |
| `A rx ry rot large-arc sweep x y` | elliptical arc |
| `Z` | close the path back to the last `M` |

```
M 0 62 C 18 6 42 6 52 48 S 78 96 100 34
```

read that as: start at (0, 62). curve to (52, 48) bending through two control
points. then continue smoothly to (100, 34), reusing the mirrored control
point. `S` after a `C` is how you get a curve that does not kink at the joint,
and it is the command most hand-written paths are missing.

**`A` is the one to avoid writing by hand.** the two flags are hard to reason
about and the parameterization is unforgiving. for arcs, either use a circle
with a stroke dash, or generate the path from code.

### degenerate shapes will not render

a path with zero area and no stroke draws nothing. a `circle` with `r="0"`
draws nothing. a shape with `fill="none"` and no `stroke` draws nothing.

this is the answer to most "my svg is invisible" questions, and the second
answer is that the shape is outside the viewBox.

## line drawing with stroke dashes

the core svg animation technique, and it is a trick.

`stroke-dasharray` sets a repeating dash pattern along the path.
`stroke-dashoffset` shifts where that pattern starts. set the dash length to
the path's full length and there is exactly one dash and one gap, so the
offset controls how much of the line is visible.

```css
stroke-dasharray: 300;    /* the full path length */
stroke-dashoffset: 300;   /* fully hidden */
stroke-dashoffset: 0;     /* fully drawn */
```

the traditional way to get that length is `path.getTotalLength()`, which means
measuring in javascript after mount, storing the number, and remeasuring
whenever the path changes.

### pathLength, which removes the measuring

```html
<path pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" />
```

`pathLength` tells the browser to pretend the path is that long for all
dash calculations. set it to 1 and the path is normalized: the offset is now
the fraction still to draw, and no measurement is ever needed.

```ts
// pathLength="1" normalizes the path, so the offset is the fraction of it
// still to be drawn and the geometry never has to be measured.
const draw = (value: number) => {
  node.style.strokeDashoffset = `${1 - clamp(value)}`
}
```

this survives the path changing, the container resizing, and server rendering,
none of which the `getTotalLength` version does. use it.

### the arc case

for a circle, the length is known without measuring, so either approach works:

```tsx
const circumference = 2 * Math.PI * radius
```

```tsx
<circle
  strokeDasharray={circumference}
  strokeDashoffset={circumference}
  strokeLinecap="round"
/>
```

then animate the offset:

```ts
arc.style.strokeDashoffset = `${circumference * (1 - fill)}`
```

two notes. `stroke-dashoffset` is a **paint**, not a composite. it is the
sanctioned exception in `motion-system`, because there is no way to draw a
filling arc without one, and it stays cheap because only the stroke repaints
and layout never moves.

and an arc drawn with a stroke starts at 3 o'clock. rotate the svg, not the
path:

```tsx
<svg viewBox={`0 0 ${BOX} ${BOX}`} className="size-full -rotate-90">
```

`strokeLinecap="round"` is worth it on any arc that does not complete, because
a flat cap on a curve reads as a rendering error at small sizes.

## transforms, and the origin trap

this is the most common svg animation bug.

css `transform-origin` on an html element defaults to the element's own box.
on an svg child, it resolves against the **svg user space**, not the element,
so `transform-origin: center` means the center of the whole viewBox rather
than the center of the shape you are rotating.

a spinner built this way orbits instead of spinning.

the fix is one line:

```css
.shape {
  transform-box: fill-box;   /* origin resolves against the element bounding box */
  transform-origin: center;  /* now actually the center of this shape */
}
```

`transform-box: fill-box` is the load-bearing declaration. set it on anything
inside an svg that you rotate or scale.

the alternative is the svg `transform` attribute with explicit coordinates,
which is precise and unreadable:

```html
<g transform="rotate(45 50 50)">
```

prefer the css version.

## strokes that should not scale

when an svg scales, its strokes scale with it. usually correct. for a hairline
that should stay one pixel at any size, it is not:

```css
vector-effect: non-scaling-stroke;
```

use it for chart axes, grid lines and hairline rules. do not use it for the
main strokes of an icon, which should scale, or the icon looks wrong at large
sizes.

## color

`currentColor` is the single most useful value in svg.

```html
<svg fill="none" stroke="currentColor" strokeWidth="2">
```

the shape now inherits the text color of wherever it is placed, so it works in
light mode, dark mode, on hover, and inside a button that changes color on
press, without any of those knowing the icon exists.

never hardcode a hex value in an icon you intend to reuse.

## icons

a consistent icon set has one viewBox, one stroke width, and one cap and join
style:

```tsx
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth={2}
  strokeLinecap="round"
  strokeLinejoin="round"
  className="size-4"
>
  <path d="m9 6-4 6 4 6" />
  <path d="m15 6 4 6-4 6" />
</svg>
```

- **24 by 24 is the practical standard.** matching whatever set you already
  use matters more than the specific number.
- **stroke, not fill, for line icons.** it scales, it recolors, and the weight
  can be tuned in one place.
- **round caps and joins** unless the design is deliberately hard-edged. flat
  joins produce visible spikes at tight angles.
- **`aria-hidden="true"`** on any icon that sits beside a text label, or the
  label is announced with a meaningless graphic in front of it. an icon that
  is the only content of a button needs an accessible name on the button, not
  on the svg.

## ids are global

`clipPath`, `mask`, `filter`, `linearGradient` and `pattern` are referenced by
id, and the id space is the whole document. two instances of the same
component both defining `#gradient` means the second one wins for both.

generate the id per instance:

```tsx
const maskId = React.useId()
```

```tsx
<mask id={maskId}>...</mask>
<path mask={`url(#${maskId})`} />
```

this is the bug that only appears when a component is rendered twice, which
means it reaches production.

## inline or file

**inline** when the svg needs to recolor with the theme, animate, or respond
to state. it costs markup and it is the only way to reach into the shape.
logos in a config file and icons in a component both want this.

**as a file, in an `img`** when it is decorative, large, and static. it caches,
it does not bloat the html, and it cannot be styled from outside, which is
fine for something that never changes.

there is no third option worth using. an svg in a css `background-image` gets
the worst of both: it cannot recolor and it does not cache separately when it
is a data uri.

## checklist

- [ ] one viewBox, everything inside expressed as a share of it
- [ ] `display: block` on the svg
- [ ] `pathLength="1"` for any drawn line, instead of measuring
- [ ] `transform-box: fill-box` on anything rotated or scaled inside an svg
- [ ] `stroke="currentColor"`, no hardcoded colors in reusable shapes
- [ ] `vector-effect: non-scaling-stroke` on hairlines only
- [ ] `strokeLinecap="round"` on incomplete arcs
- [ ] every referenced id generated per instance
- [ ] decorative icons `aria-hidden`, icon-only buttons named on the button
- [ ] no `A` commands written by hand
