---
name: css-animations
description: "when to use css instead of an animation library, and how to write transitions and keyframes correctly. the transition shorthand, why never all, interruption and retargeting, hover on touch devices, at-keyframes syntax, fill-mode, iteration, direction, play-state, and implicit keyframes. use when writing or reviewing any css animation, choosing between a transition and a keyframe animation, deciding whether an interaction needs a library, or debugging motion that snaps back, stutters mid-travel, or sticks after a tap. triggers on: transition, transition-property, transition-delay, timing-function, all, interruptible, retarget, hover on touch, pointer fine, keyframes, animation-fill-mode, forwards, backwards, iteration-count, animation-direction, alternate, play-state, infinite, marquee, spinner."
---

# css animations

most interface motion does not need a library. this file is about the part
that does not, and about how to tell.

## the choice

**use a css transition** when a discrete state change moves a property between
two values. hover, focus, open and closed, selected, disabled. this is the
large majority of interface motion.

**use a css keyframe animation** when the motion has more than two states, or
runs without a state change to drive it. a loading spinner, a marquee, a
shimmer, a three-phase entrance.

**use javascript** when any of these are true:

- the motion is driven by a continuous input: a drag, a scroll position, a
  pointer coordinate.
- the target changes while the motion is running and the velocity has to
  survive that. springs, in other words.
- the animation must coordinate phases, where one has to finish before the
  next begins.
- you need to know when it ended, and a `transitionend` listener is not
  enough because the property list is dynamic.

**use an animation library** when you are doing several of the javascript
cases at once and the bookkeeping has become the bug source. a library is a
dependency and a bundle cost. earn it.

the honest default: css until something on the js list is actually true. a
component library that ships zero animation runtime is a real feature, and
most of the pressure to add one comes from effects that were wrong for the
format anyway.

## transitions

### the shorthand, in order

```css
transition: <property> <duration> <timing-function> <delay>;
transition: transform 180ms cubic-bezier(0.165, 0.84, 0.44, 1) 0ms;
```

the first time value is always duration and the second is always delay. that
is the only ambiguity in the shorthand and it catches people once.

multiple properties are comma separated, and each gets its own timing:

```css
transition:
  opacity 140ms ease-out,
  transform 220ms var(--ease-out-quart);
```

### never transition all

`transition: all` is the single most common animation defect.

it animates every property that changes, including ones you did not intend and
ones you cannot see. the concrete failures:

- a property added later starts animating silently, and the bug appears in a
  component nobody touched.
- layout properties get animated by accident, so a class toggle that changes
  `height` now costs a reflow per frame.
- inherited changes cascade into children and animate there too.
- theme swaps animate `color` and `background-color` on every element at once,
  which is a full-page paint.

name the properties. it is three more characters and it is the difference
between a transition you control and one you discover.

```css
/* no */  transition: all 200ms ease;
/* yes */ transition: opacity 200ms ease, transform 200ms ease;
```

if the list is genuinely long, that is a signal the element is doing too much,
not a reason to reach for `all`.

### interruption and retargeting

css transitions are interruptible, and this is their best property. a
transition retargeted mid-flight starts a new transition from the current
computed value, so an element halfway through moving right will move left from
where it is rather than jumping.

what they do not do is preserve velocity. the new transition begins with its
own easing curve from a standstill. with `ease-out`, that means the element was
at full speed, then instantly at zero, then accelerating again. on a fast
retarget this reads as a stutter.

this is the line where a spring earns its cost. if the target changes often
mid-flight, a transition will always have that dead stop in it, and no easing
choice removes it. see `animation-orchestration`.

a related trap: a transition and a drag on the same property fight each other.
during a drag, the element must sit exactly under the finger or it feels
towed. so disable the transition while dragging and re-enable it for keyboard
and programmatic moves:

```tsx
className={cn(
  // only glide for keys. during a drag the divider has to sit exactly
  // under the finger or it feels like it is being pulled on a string.
  !dragging && "transition-[left,top] duration-200 ease-[var(--ease-out-quart)]",
  "motion-reduce:transition-none"
)}
```

### transitions need a starting value

a transition only runs between two rendered values. an element that is
inserted into the dom already at its target has nothing to transition from,
which is why entrance animations on mount need either a keyframe animation or
a forced reflow between the two states. keyframes are the correct answer
almost every time.

### hover on touch devices

`:hover` on a touch device sticks. the browser applies it on tap and leaves it
applied until the reader taps elsewhere, so a hover-revealed element stays
revealed and a hover-lift stays lifted.

gate it:

```css
@media (hover: hover) and (pointer: fine) {
  .card:hover { transform: translateY(-2px); }
}
```

in tailwind, configure the `hover` variant to include the query, or write it
with the `pointer-fine` and `hover` media conditions rather than relying on
the bare variant. either way, do it once globally rather than per component.

both conditions matter. `hover: hover` alone still matches a stylus or some
hybrid devices where the hover is real but imprecise.

## keyframe animations

### the shorthand

```css
animation: <name> <duration> <timing-function> <delay> <iteration-count> <direction> <fill-mode> <play-state>;
animation: rise 400ms var(--ease-out-quart) 120ms 1 normal both;
```

same rule as transitions: first time is duration, second is delay.

### fill-mode is the one that bites

by default an animation applies its styles only while it is running. before it
starts and after it ends, the element renders its normal styles.

that means a delayed entrance animation flashes at full opacity for the length
of the delay, then jumps to transparent, then fades in. this is the most
common keyframe bug there is.

| value | before it starts | after it ends |
| --- | --- | --- |
| `none` | normal styles | normal styles |
| `forwards` | normal styles | holds the last keyframe |
| `backwards` | applies the first keyframe | normal styles |
| `both` | applies the first keyframe | holds the last keyframe |

use `both` for any entrance. `backwards` is what kills the flash during the
delay, `forwards` is what stops it snapping back at the end, and there is
almost never a reason to want one without the other.

### implicit keyframes

`from` and `to` can be omitted, and the browser uses the element's current
computed value for the missing end. this is genuinely useful:

```css
@keyframes fade-in {
  from { opacity: 0; }
  /* to is implicit: whatever opacity the element actually has */
}
```

the animation now works on an element at `opacity: 0.8` without a separate
keyframe set. the trap is that it also silently changes behavior when the
computed value changes, so use it where the flexibility is the point and be
explicit where it is not.

### iteration, direction, play-state

```css
animation-iteration-count: infinite;   /* or a number, including fractions */
animation-direction: alternate;        /* normal | reverse | alternate | alternate-reverse */
animation-play-state: paused;          /* running | paused */
```

`alternate` halves the keyframes you have to write for anything that goes out
and comes back. note it also doubles the effective cycle length, so a 2s
alternating animation takes 4s to return to its start.

`play-state` is the correct way to stop a loop. it holds the element exactly
where it is and costs nothing to resume, unlike unmounting, which loses the
position, or setting `animation: none`, which snaps to the start.

`animation-direction: reverse` is how one keyframe set serves two directions,
which is what a bidirectional marquee wants.

### a seamless loop

the seam in a marquee is the whole difficulty, and it is solved by geometry
rather than by timing. render at least two copies, and travel exactly one copy
plus one gap.

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% - var(--marquee-gap))); }
}
```

```tsx
{Array.from({ length: Math.max(repeat, 2) }, (_, index) => (
  <div
    key={index}
    // only the first copy is real content. the rest are visual duplicates
    // and a screen reader should not read the row twice.
    aria-hidden={index > 0 ? "true" : undefined}
    className={cn(
      "animate-marquee flex shrink-0",
      reverse && "[animation-direction:reverse]",
      (paused || !onScreen) && "[animation-play-state:paused]",
      // stopping dead would leave half a row cut off, so freeze the whole
      // track at its start instead.
      "motion-reduce:animate-none"
    )}
  >
    {children}
  </div>
))}
```

three things worth taking. the duplicate copies are `aria-hidden`, or the row
is announced twice. the offscreen pause is on `play-state`. and reduced motion
resolves to the start of the track rather than to wherever it happened to be,
because a marquee frozen mid-travel shows a clipped item.

## reduced motion

every animated element carries its own escape, on the element:

```tsx
className="animate-rise motion-reduce:animate-none"
```

put it in the component rather than in a global stylesheet so it survives
being copied out into someone else's project.

a global backstop is still worth having, but it is a backstop, not the
mechanism:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

note that this resolves animations to their end state rather than removing
them, which is what you want: the element ends up correct rather than stuck at
its first keyframe.

reduced motion means less motion, not no interface. an element that fades
without moving is usually the right answer, and reducing to nothing at all can
remove the feedback that told the reader their action worked.

## debugging

| symptom | cause |
| --- | --- |
| flashes at full opacity before fading in | missing `animation-fill-mode: both` with a delay |
| snaps back at the end | missing `forwards` |
| runs once and never again | the element was not remounted and the class was not removed. re-trigger by removing the class, forcing a reflow, adding it back |
| sticks after a tap on mobile | `:hover` without `@media (hover: hover)` |
| stutters when retargeted | transition restarting from a standstill. use a spring |
| animates properties you never named | `transition: all` |
| dead only during a theme swap | a library injecting `transition: none !important`. use keyframes for that element |
| different speed on a 120hz screen | a js loop without a fixed sub-step. see `animation-performance` |

## checklist

- [ ] properties named, never `all`
- [ ] `both` on any delayed entrance
- [ ] `:hover` gated behind `(hover: hover) and (pointer: fine)`
- [ ] transitions disabled during a drag on the dragged property
- [ ] loops paused with `play-state`, not unmounted
- [ ] duplicate marquee copies `aria-hidden`
- [ ] `motion-reduce:` on the element itself
- [ ] no animation library added for something on the css list
