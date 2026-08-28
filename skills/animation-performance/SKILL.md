---
name: animation-performance
description: "holding 60fps: the browser layout, paint and composite pipeline, which properties are cheap and why, hardware acceleration and the cost of a layer, will-change, the css custom property inheritance trap, react re-render cost during motion, offscreen work, and blur limits. use when an animation stutters, when reviewing any animated code, when choosing which property to animate, or when a drag gets laggy as content grows. triggers on: dropped frames, janky, stutter, 60fps, 120hz, gpu, hardware accelerated, will-change, requestAnimationFrame, layout thrash, reflow, repaint, composite, compositor, css variable performance, re-render during animation, blur performance, safari blur, intersection observer, offscreen."
---

# animation performance

a frame is 16.7ms at 60hz and 8.3ms at 120hz. everything below is about what
fits in that.

the goal is not to make animation code fast. it is to hand the animation to a
part of the browser that was already going to do the work anyway.

## the pipeline

every visual change goes through some suffix of this:

```
style  ->  layout  ->  paint  ->  composite
```

- **style** works out the computed values. unavoidable.
- **layout** works out where every affected box is. changing one element can
  reflow its siblings, its parent, and in the worst case the document.
- **paint** fills pixels into layers.
- **composite** puts the layers on screen, transformed.

the further right you enter, the cheaper the frame. this is the entire theory.

| you animate | pipeline entered at | cost |
| --- | --- | --- |
| `width`, `height`, `top`, `margin`, `font-size` | layout | worst. reflows neighbors |
| `background-color`, `box-shadow`, `border-radius`, `color` | paint | repaints the affected area |
| `transform`, `opacity`, `filter` | composite | cheapest. can run off the main thread |

`transform` and `opacity` are special because a composited layer already has
its pixels. moving it or fading it is a matrix and an alpha applied to
something already drawn, and the compositor can do that without the main
thread being involved at all.

that last part is why css animations survive a busy main thread and
javascript animations do not. a `requestAnimationFrame` loop competes with
every other thing on the main thread. a composited css animation does not.

### the paint exception worth knowing

"only animate transform and opacity" is a good default and a bad absolute. the
real question is how many pixels a paint touches.

- `stroke-dashoffset` on an svg arc is a paint, and it is the only way to draw
  a filling arc. it stays cheap because only the stroke repaints and layout
  never moves.
- `background-position` across a few hundred pixels of glyph for gradient text
  is a paint and it is fine.
- `background-position` across a full-viewport gradient is the same property
  and it is a disaster.

state the paint and its area, then decide. do not cargo-cult the rule.

## layers, and why more is not better

promoting an element to its own compositor layer makes it cheap to move. it
also costs memory, roughly width times height times 4 bytes, on the gpu, and
every layer has to be composited every frame.

a page that promotes everything runs worse than a page that promotes nothing.
the symptom is a scroll that gets progressively worse as the page gets longer,
and it looks exactly like the problem promotion was supposed to fix.

`will-change` is a hint that promotion is coming, not a performance setting.

```css
/* wrong: a permanent layer for a hover that happens twice a day */
.card { will-change: transform; }

/* right: promoted just before it is needed */
.card:hover { will-change: transform; }
```

better still, set it from script when the interaction begins and remove it
when the animation ends. leaving `will-change` on an idle element is the most
common way to make a page slower while believing you made it faster.

the one legitimate always-on case is fixing the 1px jitter at the ends of a
transform animation, which is a gpu handoff artifact. even then, remove it
once the element is at rest if the element is long-lived.

## the custom property trap

this one is invisible and it is expensive.

a css custom property declared on an element is inherited by every descendant.
when the value changes, the browser must invalidate style for the whole
subtree. animating a variable on a container with a large subtree is therefore
a style recalculation of everything under it, every frame, regardless of how
cheap the property being derived from it is.

```css
/* every descendant invalidates on each frame */
.page { --progress: 0; transition: --progress 300ms; }
```

two ways out.

**declare it as low as possible.** put the variable on the element that reads
it, not on an ancestor.

```tsx
<span
  className="absolute inset-0 origin-left"
  style={{ transform: "scaleX(var(--hold-progress, 0))" }}
/>
```

**register it so it animates on the compositor where possible.**

```css
@property --progress {
  syntax: "<number>";
  inherits: false;
  initial-value: 0;
}
```

`inherits: false` is the load-bearing line. it stops the invalidation from
walking the subtree at all.

## writing values without re-rendering

in react, the rule is: a frame that re-renders is a frame that can drop.

driving an animation through `useState` means sixty renders a second, sixty
reconciliations, and sixty commit phases, to produce a number that a single
`style.setProperty` call could have delivered. it will drop frames on any
component tree of real size, and it will drop them on the reader's machine
before it drops them on yours.

write to a ref, then to the dom:

```tsx
const state = React.useRef({ progress: 0 })

const write = React.useCallback(() => {
  ref.current?.style.setProperty("--hold-progress", `${state.current.progress}`)
}, [])

const tick = React.useCallback((now: number) => {
  // clamp the delta. a backgrounded tab hands back one enormous frame,
  // and an unclamped delta turns that into a jump.
  const elapsed = state.current.last ? Math.min(now - state.current.last, 64) : 16
  state.current.last = now
  state.current.progress = Math.min(1, state.current.progress + elapsed / duration)
  write()
  if (state.current.progress < 1) frame.current = requestAnimationFrame(tick)
}, [duration, write])
```

state is still the right tool for the things that genuinely change the tree:
whether the interaction is running, whether it has completed. those change a
handful of times, not sixty times a second.

### the two frame-loop details everyone gets wrong

**clamp the delta.** a tab returning from the background delivers one frame
with a delta of several seconds. unclamped, the animation teleports. 64ms is a
reasonable ceiling: about four dropped frames.

**use a fixed sub-step for physics.** a spring integrated with one big step at
a low frame rate overshoots into oscillation, and a stiff spring diverges
outright. sub-stepping at a fixed interval makes the motion identical on a
60hz screen and a 120hz one.

```ts
const STEP = 1 / 240

for (let t = 0; t < elapsed; t += STEP) {
  const step = Math.min(STEP, elapsed - t)
  v += (-k * (x - to) - c * v) * step
  x += v * step
}
```

without this, the same spring config feels different on different hardware,
which is the kind of bug that costs a day to find.

## do not animate what nobody can see

css animations keep running while scrolled out of view, and the compositor
keeps their layers alive to do it. a marquee with a 40 second loop is 40
seconds of work per loop, forever, for a row nobody is looking at.

gate it on visibility:

```tsx
export function useInViewport<T extends Element>(
  ref: React.RefObject<T | null>,
  margin = "200px"
) {
  // starts true so the first paint is never a paused one, on the server
  // or where IntersectionObserver is missing.
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: margin }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, margin])

  return visible
}
```

```tsx
className={cn(
  "animate-marquee",
  !onScreen && "[animation-play-state:paused]"
)}
```

two details. the margin is generous, so the loop is already running by the
time the row scrolls in and the reader never catches it starting. and the
initial value is `true`, so server rendering and browsers without the observer
get motion rather than a permanently frozen element.

pausing beats unmounting: `animation-play-state` keeps the element in place
and costs nothing to resume.

## blur

`filter: blur()` is a paint over the filtered area, and the cost scales with
both radius and area. it is the most expensive thing in common use, and safari
is meaningfully worse at it than chromium.

- keep animated blur at or under about 16px.
- treat anything above 20px as **static only**: one pass over a container
  whose children move underneath it. never a value that changes per frame.
- blur on a full-viewport element is a full-viewport paint. if you need a
  large soft wash, pre-render it as an image or use a radial gradient, which
  is a fraction of the cost and usually indistinguishable.
- blurring a large element and then scaling it down is cheaper than blurring
  hard at full size, because the paint area is smaller.

## measuring

- **the frames panel in devtools performance**, not the fps meter. you are
  looking for long tasks and for purple layout bars during the animation. any
  layout bar at all during a transform animation means something else on the
  page is reading a geometry property.
- **layout thrash** shows as alternating purple and green. it comes from
  reading a layout property after writing one in the same frame:
  `offsetHeight` after setting `style.width`. batch the reads, then the
  writes.
- **the layers panel** shows what got promoted and what it costs in memory.
  if the count is in the hundreds, something is promoting in a loop.
- **throttle to 4x cpu and test on the real thing.** motion that only works on
  a development machine is not shipped.

## checklist

- [ ] animating `transform` or `opacity`, or a paint whose area is stated
- [ ] no layout properties animated anywhere
- [ ] `will-change` scoped to the interaction, not left on
- [ ] custom properties declared on the element that reads them, or
      `@property` with `inherits: false`
- [ ] no react state written per frame
- [ ] frame deltas clamped
- [ ] physics sub-stepped at a fixed interval
- [ ] offscreen loops paused
- [ ] animated blur under 20px, large blur static
- [ ] profiled once under 4x throttle
