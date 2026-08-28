---
name: animation-orchestration
description: "coordinating several elements through one interaction: springs and velocity across retargets, measuring before moving, phased sequences where one part must finish before the next starts, staggered reveals scheduled by a parent, idle loops, path morphing, and keeping timing in one place instead of scattered across handlers. use when an interaction drives more than two or three elements, when animations must run in order, when one phase has to complete before another begins, or when timing values are spread across event handlers. triggers on: orchestration, sequence, stagger, variants, phases, await animation, spring, retarget, velocity, remeasure, ResizeObserver, path morphing, idle loop, animation sequence, coordinate animations."
---

# animation orchestration

one element moving is a transition. several elements moving through one
interaction is a system, and it needs somewhere for the timing to live.

the failure this file prevents: timing constants scattered across six event
handlers, each correct on its own, collectively producing motion that nobody
can reason about and nobody can change.

## put the timing in one place

before any technique, this. every duration, delay and rung in an interaction
belongs in one object at the top of the file.

```tsx
const TIMING = {
  fill: 1200,      // how long a hold has to be held
  drain: 260,      // how long an abandoned fill takes to run back out
  settle: 200,     // how long a completed fill sits at full
  clear: 240,      // how long the completed fill takes to fade off
} as const
```

it is not about reuse. it is that the relationship between the numbers is the
design, and the relationship is invisible when they are 200 lines apart. read
as a block, the numbers above say something: the fill is slow and deliberate,
everything after it is quick, and the settle is shorter than the clear so the
fade begins before the reader has finished registering the completion.

## springs, and what they are for

a spring is not a nicer easing curve. it is the answer to one specific
problem: the target changes while the motion is still running.

a css transition retargeted mid-flight starts over from a standstill. the
element was at full speed, then at zero, then accelerating again. that dead
stop is the tell.

a spring carries velocity across the retarget, so something already traveling
keeps traveling.

### parameterize by duration and bounce

specify what you want, not the three physical constants whose product you
discover by trial:

```ts
function coefficients({ duration = 0.4, bounce = 0 }) {
  const omega = (2 * Math.PI) / duration
  const damping =
    bounce >= 0
      ? (4 * Math.PI * (1 - bounce)) / duration
      : (4 * Math.PI) / (duration * (1 + bounce))

  return { stiffness: omega * omega, damping }
}
```

`duration` is roughly the settling time. a spring has no fixed end, but this is
the number you would have reached for with a tween. `bounce` at 0 arrives and
stops, above 0 overshoots and returns, below 0 eases in slowly.

keep bounce at 0 in product surfaces. reserve 0.1 to 0.3 for drag-to-dismiss,
where the overshoot is the physical metaphor doing real work.

### drive it onto a callback, not into state

```ts
export function useSpring(
  onFrame: (values: Record<string, number>) => void,
  options: SpringOptions = {}
) {
  const current = React.useRef<Values>({})
  const velocity = React.useRef<Values>({})
  const target = React.useRef<Values>({})

  // read through refs so the loop never closes over a stale callback and
  // never has to be torn down and rebuilt when one changes.
  const frameRef = React.useRef(onFrame)
  React.useEffect(() => { frameRef.current = onFrame })

  /** retarget. whatever is already moving keeps its velocity. */
  const to = React.useCallback((next: Values) => {
    target.current = { ...target.current, ...next }
    run()
  }, [run])

  /**
   * put the values somewhere directly. pass carry to keep them moving as
   * they land there, which is what a remeasure needs: the numbers change
   * meaning but the motion they describe does not.
   */
  const set = React.useCallback((next: Values, carry?: Values) => {
    stop()
    current.current = { ...current.current, ...next }
    if (!carry) target.current = { ...target.current, ...next }
    for (const key of Object.keys(next)) {
      velocity.current[key] = carry?.[key] ?? 0
    }
    frameRef.current({ ...current.current })
  }, [stop])

  return { to, set, peek, speed, stop }
}
```

four operations, and each one exists for a case:

- **`to`** retargets and keeps velocity. the normal path.
- **`set`** places values without animating. mount, reset, reduced motion.
- **`set` with `carry`** places values and keeps them moving. this is the
  remeasure case and it is the one people miss: when a container resizes, the
  pixel coordinates change but the motion in progress is still valid. without
  carry, every resize stops the animation dead.
- **`peek` and `speed`** read the live values, which is how you hand a
  gesture off to a spring at the velocity the finger was moving.

## measure, then move

anything that animates between measured positions has the same three-part
shape, and getting the order wrong is the usual bug.

1. **first placement is a measurement, not a move.** the element has to appear
   at its starting position without traveling there from wherever the browser
   put it.
2. **remeasure on resize**, or the indicator is left behind by a reflow.
3. **only then, travel.**

```tsx
const [pill, setPill] = React.useState(EMPTY)
// the first placement must not animate
const [settled, setSettled] = React.useState(false)

React.useEffect(() => {
  const list = listRef.current
  if (!list) return

  const observer = new ResizeObserver(() => setPill(measure(indexRef.current)))
  observer.observe(list)

  // one tick, so the initial placement paints before transitions turn on
  const timer = window.setTimeout(() => setSettled(true), 0)
  return () => {
    observer.disconnect()
    window.clearTimeout(timer)
  }
}, [measure])
```

```tsx
className={cn(
  "absolute inset-y-1 rounded-full",
  settled && "transition-[left,width] ease-[var(--ease-out-expo)] motion-reduce:transition-none"
)}
```

the `settled` flag is the whole trick. without it, every indicator in every tab
strip slides in from the left edge on first paint.

## phases: when one part must finish before the next

some motion is genuinely sequential. the mistake is running the phases on
overlapping timers and hoping.

a worked case: a tab indicator that stretches to span both the old and new
tab, then contracts onto the new one. moving `left` and `width` straight to the
target slides a fixed shape across, which reads as sliding. spanning first is
what makes it read as elastic.

```tsx
React.useEffect(() => {
  const target = measure(index)
  const from = pillRef.current

  if (from.width === 0) {
    setPill(target)
    return
  }

  // phase one: span both
  const start = Math.min(from.left, target.left)
  const end = Math.max(from.left + from.width, target.left + target.width)
  setPill({ left: start, width: end - start })

  // phase two: contract. the stretch is allowed to finish first. cutting it
  // off part way left the pill still accelerating when it was handed a new
  // target, and that change of speed is what read as a stutter.
  const timer = window.setTimeout(() => setPill(measure(index)), duration * 0.45)
  return () => window.clearTimeout(timer)
}, [index, measure, duration])
```

two things to take from this beyond the effect itself.

**the phase boundary is derived, not hardcoded.** `duration * 0.45` means the
caller changes one number and both phases stay in proportion. two independent
constants would drift apart the first time someone tuned one of them.

**the cleanup cancels the pending phase.** a rapid tab change while phase one
is running must not have phase two fire against a stale target. every phased
sequence needs this and it is the most commonly omitted line in the pattern.

when phases get past about three, stop using timers and await the animation
directly, either through the web animations api or whatever your library
returns.

## staggered reveals

covered as judgement in `animation-craft`. the mechanism:

**one observer on the parent, a rung handed to each child.** not one observer
per child.

```tsx
<div ref={gridRef} data-visible={visible ? "" : undefined} className="grid">
  {tiles.map((tile, index) => (
    <div
      key={tile.id}
      className="tile"
      style={{ "--rung": `${index * 40}ms` } as React.CSSProperties}
    >
      {tile.content}
    </div>
  ))}
</div>
```

```css
.tile { opacity: 0; }
[data-visible] .tile {
  animation: rise 400ms var(--ease-out-quart) var(--rung) both;
}
```

at six tiles that is five observers saved, and the group can never arrive in
two halves because two observers disagreed about when it entered.

`both` on the fill mode is required here, not optional. without `backwards`,
every tile flashes at full opacity for the length of its delay.

## idle loops

an animation that runs continuously after an interaction settles needs three
things or it becomes a liability.

**it pauses when offscreen.** see `animation-performance`.

**it pauses when the interaction resumes**, and resumes from where it was
rather than restarting. `animation-play-state` gives you this for free; a js
loop needs to store its phase.

**it has an off switch on the component.** someone will render forty of these.

```tsx
className={cn(
  "animate-drift",
  (paused || !onScreen || active) && "[animation-play-state:paused]",
  "motion-reduce:animate-none"
)}
```

## path morphing

interpolating one svg path into another requires both paths to have the same
number and type of commands. authored paths almost never do.

three options, in order of preference.

**author them compatibly.** draw both shapes with the same command sequence,
differing only in coordinates. tedious once, free forever, no dependency, and
it interpolates natively.

```html
<path d="M 4 12 L 12 4 L 20 12" />
<path d="M 4 8  L 12 16 L 20 8"  />
```

**cross-fade two paths** with a slight scale. for most icon swaps this is
indistinguishable from a morph at 150ms and costs nothing.

**normalize at runtime** with a path interpolation library. correct for
arbitrary shapes, and the only option when the paths are data rather than
design. it is a real dependency for an effect the reader sees for 200ms, so
have a reason.

for the underlying path syntax and coordinate rules, see `svg-fundamentals`.

## checklist

- [ ] every timing constant for the interaction in one object
- [ ] phase boundaries derived from the total, not independently hardcoded
- [ ] every pending phase cancelled in cleanup
- [ ] first placement does not animate
- [ ] resize remeasures, and carries velocity if motion is in flight
- [ ] one observer per group, not one per child
- [ ] `both` fill mode on anything with a delay
- [ ] idle loops pause offscreen and expose an off switch
- [ ] nothing driven through per-frame react state
