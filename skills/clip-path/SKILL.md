---
name: clip-path
description: "clip-path as an animation primitive: inset and polygon syntax, image and text reveals, before and after comparison sliders, tab indicators whose label changes color at the boundary, theme toggle wipes, and hold-to-confirm fills. use when building a reveal, a wipe, a slider that splits two layers, an indicator whose text inverts, or any effect where part of an element should be hidden without a wrapper. triggers on: clip-path, inset, polygon, circle, ellipse, path, mask-image, reveal animation, comparison slider, before after slider, wipe transition, tab indicator, theme toggle, hold to delete, overflow hidden alternative, round."
---

# clip-path

`clip-path` hides part of an element without a wrapper, without affecting
layout, and without touching the element's own geometry. that combination is
what makes it an animation primitive rather than a styling detail.

the property is composited, so animating it is cheap in the same way
`transform` is cheap. the element is painted once and the clip is applied to
the result.

## the shapes

```css
clip-path: inset(10px 20px 30px 40px);        /* top right bottom left */
clip-path: inset(0 0 0 50%);                  /* show the right half */
clip-path: inset(10px round 8px);             /* with corner radius */
clip-path: circle(40% at 50% 50%);
clip-path: ellipse(40% 25% at 50% 50%);
clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
clip-path: path("M 0 0 L 100 0 L 100 100 Z"); /* fixed pixel coordinates */
```

`inset` covers most real work. the four values are insets from each edge, in
the same order as `margin`, and any of them can be a percentage of the
element's own box.

the mental model that makes `inset` click: **the numbers say how much to cut
off, not what to keep.** `inset(0 0 0 50%)` cuts half off the left, so the
right half survives.

### which shapes interpolate

- `inset` to `inset`: interpolates. all four values, plus the radius.
- `polygon` to `polygon`: interpolates **only if both have the same number of
  points**. this is the same constraint as svg path morphing, and the same fix:
  author both with matching point counts, adding redundant collinear points
  where one shape needs fewer.
- `circle` and `ellipse`: interpolate with each other and with themselves.
- `inset` to `polygon`: does not interpolate. it snaps.
- `path()`: does not interpolate in most engines, and its coordinates are
  fixed pixels rather than relative to the box, so it does not respond to
  resize. avoid it for anything that animates or reflows.

when in doubt, use `inset`. it covers reveals, wipes, splits and fills, and it
is the only one with no interpolation caveats.

## reveals and wipes

a reveal is an `inset` animating from covering everything to covering nothing.

```css
@keyframes wipe-in {
  from { clip-path: inset(0 100% 0 0); }  /* everything cut from the right */
  to   { clip-path: inset(0 0 0 0); }     /* nothing cut */
}
```

the direction of the wipe is which edge the inset retreats from. `inset(0 0 0
100%)` to `inset(0 0 0 0)` wipes left to right. `inset(100% 0 0 0)` to zero
wipes top to bottom.

**why this beats animating width.** width is a layout property. animating it
reflows everything after the element in flow, every frame. the clip is
composited and the element never changes size, so nothing around it moves.

**why it beats a wrapper with `overflow: hidden`.** a wrapper is an extra
element in the tree, it needs its own dimensions, and it clips the box shadow
and focus ring of whatever is inside it. the clip does not.

a text reveal is the same thing, and it is the one place `overflow: hidden`
still wins: for a line of text that should be revealed per line, the wrapper
per line is simpler than computing line boxes.

## comparison slider

two layers stacked, the top one clipped at the divider position. this is the
clearest demonstration of why the property exists: the after image is at full
size at all times, and only how much of it you can see changes.

```tsx
<div ref={frameRef} className="relative isolate overflow-hidden select-none">
  <div className="h-full w-full">{before}</div>

  <div
    className="absolute inset-0"
    style={{
      clipPath: vertical
        ? `inset(${value}% 0 0 0)`
        : `inset(0 0 0 ${value}%)`,
    }}
  >
    {after}
  </div>

  <div
    // a real slider, so the comparison is reachable without a pointer.
    // the value is the divider position, which is the only thing to move.
    role="slider"
    tabIndex={0}
    aria-label={label}
    aria-orientation={orientation}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(value)}
    onKeyDown={handleKeyDown}
    style={vertical ? { top: `${value}%` } : { left: `${value}%` }}
  />
</div>
```

the details that make it feel right rather than merely work:

**the handle only transitions for keyboard input.** during a drag it must sit
exactly under the finger. a transition on a dragged element feels like the
element is being towed on a string.

```tsx
!dragging && "transition-[left,top] duration-200 ease-[var(--ease-out-quart)]"
```

**`touch-action` blocks only the axis the divider travels on**, so a finger
that lands on the frame can still scroll the page.

```tsx
style={{ touchAction: vertical ? "pan-x" : "pan-y" }}
```

**pointer capture**, so a drag that leaves the element still tracks. without
it, moving fast off the edge drops the drag and the divider sticks.

```tsx
onPointerDown={(event) => {
  event.currentTarget.setPointerCapture(event.pointerId)
  setDragging(true)
  trackPointer(event)
}}
```

**it is a real `role="slider"`** with arrow keys, home and end. a comparison
that can only be operated by dragging is a comparison a large number of people
cannot operate at all.

## the two-color indicator

the effect where a tab label is one color outside the indicator and another
inside it, with the boundary moving through the middle of the text.

this cannot be done by coloring the text, because a single text node has one
color. it is done by rendering the label twice and clipping the second copy to
the indicator.

```tsx
<div className="relative">
  {/* base layer: the normal color */}
  <div className="flex">
    {items.map((item) => <span key={item.value}>{item.label}</span>)}
  </div>

  {/* the indicator */}
  <div
    className="bg-foreground absolute inset-y-0 rounded-full transition-[left,width]"
    style={{ left: pill.left, width: pill.width }}
  />

  {/* inverted layer: identical markup, clipped to the indicator */}
  <div
    aria-hidden="true"
    className="text-background absolute inset-0 flex"
    style={{
      clipPath: `inset(0 ${frameWidth - pill.left - pill.width}px 0 ${pill.left}px round 999px)`,
    }}
  >
    {items.map((item) => <span key={item.value}>{item.label}</span>)}
  </div>
</div>
```

three rules for this one.

**the clipped copy is `aria-hidden`.** it is a visual duplicate. without this
every tab label is announced twice.

**both layers must have identical layout.** same markup, same classes, same
font metrics. any difference shows as a shimmer at the boundary because the
two copies do not line up exactly.

**`round` matches the indicator radius**, or the text inverts inside a
rectangle sitting in a pill and the corners are visibly wrong.

## the fill

a progress or hold-to-confirm fill sweeping across a button.

the naive version animates `width`, which is layout, on an element that
contains a label, which then reflows. the correct version is a `scaleX` on an
absolutely positioned layer, clipped by its parent.

```tsx
{/* the fill is the whole affordance: it is the only thing telling you how
    much longer to keep holding. it is a scale, not a width, so filling the
    button costs no layout, and it is clipped by a wrapper rather than
    rounded itself, or the scale would squash its own corners. */}
<span
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
>
  <span
    className="absolute inset-0 origin-left"
    style={{ transform: "scaleX(var(--hold-progress, 0))" }}
  />
</span>
```

that comment names the real trap. a scaled element with its own
`border-radius` has its corners scaled too, so a fill at 10 percent shows an
ellipse rather than a rounded rectangle. clipping from the parent with
`rounded-[inherit]` keeps the corners correct at every value.

`clip-path: inset(0 calc(100% - var(--progress) * 100%) 0 0)` is the direct
alternative and it is also correct. the scale version is marginally cheaper
because it is a transform rather than a clip recomputation, and the difference
only matters at high frequency.

**the fill must be announced.** it is a visual-only affordance and it says
nothing to a screen reader, so the requirement has to be spoken:

```tsx
<span id={hintId} hidden>
  Press and hold for {Math.round(duration / 100) / 10} seconds to confirm.
</span>
```

with `aria-describedby={hintId}` on the button. without it the control
announces as an ordinary button, and a press that appears to do nothing is
indistinguishable from a button that is broken.

## theme toggle wipe

a circular clip expanding from the toggle, revealing the new theme.

```css
clip-path: circle(0% at var(--x) var(--y));   /* from */
clip-path: circle(150% at var(--x) var(--y)); /* to */
```

the radius has to exceed the distance to the furthest corner, which is why
150 percent rather than 100. compute it exactly if the toggle can sit near a
corner:

```ts
const radius = Math.hypot(
  Math.max(x, window.innerWidth - x),
  Math.max(y, window.innerHeight - y)
)
```

two constraints. this requires a snapshot of the outgoing theme to reveal
over, which in practice means the view transitions api or a rendered copy.
and it is a full-viewport composite for the length of the animation, so keep
it under 400ms and give it a reduced-motion path that swaps instantly.

## mask-image, and when to use it instead

`mask-image` does everything `clip-path` does, plus soft edges, because the
mask is an alpha channel rather than a hard boundary.

use `clip-path` for hard edges. it is cheaper and it interpolates predictably.

use `mask-image` when the edge should be soft: fading the ends of a scrolling
row, feathering a reveal.

one detail that separates a good fade from an obvious one. a two-stop linear
gradient ramps linearly, and the eye reads the point where that ramp meets
full opacity as a hard line. sampling a smoothstep curve rounds both ends off,
so the fade runs out instead of stopping:

```ts
const FADE_STOPS = [0, 0.0608, 0.216, 0.5, 0.784, 0.939, 1]
```

build the gradient from those alpha values at even position intervals. the
difference is small and it is the whole difference between a fade that looks
deliberate and one that looks like a gradient.

## gotchas

- **percentages resolve against the element's own border box**, not the
  viewport and not the parent. an element that resizes changes what its own
  percentages mean, which is usually what you want and occasionally a surprise.
- **the clip applies to the whole element including its shadow and focus
  ring.** a clipped button loses its focus outline outside the clip. put the
  clip on an inner layer, never on the focusable element.
- **`clip-path` creates a new stacking context.** this is usually harmless and
  occasionally explains why a `z-index` stopped working.
- **`polygon` interpolation needs matching point counts.** add collinear
  points to the simpler shape.
- **`clip-path: path()` uses fixed pixel coordinates** and does not respond to
  resize. do not use it for anything responsive.
- **safari needs no prefix in current versions**, but `-webkit-clip-path` is
  still worth emitting if you support older ios.

## checklist

- [ ] `inset` unless another shape is genuinely required
- [ ] animating a clip, not a width or a height
- [ ] the clip is on an inner layer, not on the focusable element
- [ ] duplicated visual layers are `aria-hidden`
- [ ] `round` on the clip matches the visible radius
- [ ] scaled fills are clipped by a parent with `rounded-[inherit]`
- [ ] visual-only affordances have a spoken description
- [ ] `touch-action` limits only the axis being dragged
- [ ] pointer capture on any draggable divider
- [ ] a reduced-motion path that reaches the same end state
