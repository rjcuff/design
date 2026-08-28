---
name: motion-system
description: "the decision layer for any web animation: which easing, how long, what to animate, and when not to animate at all. use before writing a transition, a keyframe, or a spring, and when reviewing motion someone else wrote. triggers on: easing, cubic-bezier, ease-out, ease-in-out, duration, transition, keyframes, spring, bounce, transform, opacity, will-change, motion-reduce, prefers-reduced-motion, feels janky, feels slow, make it smooth, should this animate."
---

# motion system

motion is a cost before it is a feature. every animation spends time the reader
did not choose to spend, so the whole discipline is deciding what is worth the
spend and then getting out of the way.

this file is the decision layer. the rest of the pack is the depth:
`animation-craft` for judgement, `animation-performance` for frame budget,
`css-animations` and `animation-orchestration` for mechanics.

## the four questions

answer these in order before writing anything.

1. is the element **entering or leaving**? use `ease-out`.
2. is an already-visible element **moving or morphing**? use `ease-in-out`.
3. is it a **hover or a color change**? use `ease`.
4. will the reader trigger this **more than a hundred times a day**? do not
   animate it.

question four outranks the other three. a 200ms transition on a control
someone operates all day is a 200ms tax charged all day. frequency beats
craft, every time.

when two questions apply, entering wins. an arrow that appears on hover is
entering, not hovering, so it takes `ease-out`.

## why ease-out, and why almost never ease-in

`ease-in` starts slow. an element that starts slow reads as an element that did
not hear you. the click already happened, so the motion should be at full speed
on the first frame and spend its time arriving, not departing.

`ease-out` is the shape of something with momentum coming to rest, which is
what almost everything in an interface is.

`linear` has exactly two correct uses: a marquee, and a bar that represents
time passing. both are visualizations of a constant, so a constant rate is
honest. everywhere else it reads mechanical.

`ease-in` is correct only for something leaving the screen and not coming
back, and even then `ease-out` is usually fine.

## the curve set

six curves cover every case. do not invent a seventh.

```css
/* entering and exiting */
--ease-out-quad:  cubic-bezier(0.25, 0.46, 0.45, 0.94);  /* barely eased */
--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);    /* house default */
--ease-out-expo:  cubic-bezier(0.19, 1, 0.22, 1);        /* leaves hard, lands soft */

/* movement between two on-screen positions */
--ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
--ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
```

they differ in how front-loaded the motion is. quad is nearly linear. expo
throws most of the distance into the first third and then crawls to the
target, which is why it suits a shape stretching across a gap and gathering
back up, and why it is wrong for a tooltip.

pick quart unless there is a reason. one house curve used everywhere is worth
more than four curves each used correctly.

## duration

name durations for the job. a raw number never says which one a dropdown
wants.

| token | value | for |
| --- | --- | --- |
| `--duration-micro` | 120ms | press, toggle, icon swap |
| `--duration-ui` | 180ms | tooltip, dropdown, tab, hover |
| `--duration-panel` | 260ms | modal, drawer, popover |
| `--duration-page` | 360ms | route change, large surface |
| `--duration-marketing` | 600ms | entrance on a page read once |

hard ceiling for product surfaces is 300ms. marketing surfaces get latitude
because they are seen once and read, not operated.

two adjustments that are not optional:

- **bigger travels slower.** duration scales with distance, not with
  importance. a drawer crossing the screen and a tooltip appearing 4px away
  should not share a number.
- **exits run about 20 percent faster than entrances.** nobody wants to wait to
  dismiss something. 180ms in, 140ms out.

## what to animate

`transform` and `opacity` are the two properties the compositor can handle on
its own thread without asking for layout or paint. everything else costs more,
and most of it costs frames.

| do not animate | animate instead |
| --- | --- |
| `width`, `height` | `transform: scale()` |
| `top`, `left`, `margin` | `transform: translate()` |
| `box-shadow` | opacity on a second, pre-rendered shadow layer |
| `filter: blur()` past about 20px | keep it under, safari especially |

there are sanctioned exceptions and they are all the same shape: a paint that
is provably tiny. `background-position` across a few hundred pixels of glyph
for gradient text is fine. `stroke-dashoffset` on a progress ring is a paint,
and there is no way to draw a filling arc without one, but only the stroke
repaints and layout never moves.

that is the real test. not "is it transform or opacity", but "does this touch
layout, and if it paints, how many pixels".

### the tailwind v4 trap

v4 compiles `scale-*`, `rotate-*` and `translate-*` to the independent css
properties `scale:`, `rotate:` and `translate:`, not to `transform:`. a
transition list naming `transform` therefore animates nothing, and the value
snaps.

```tsx
/* broken: the scale jumps */
className="transition-[opacity,transform] scale-75"

/* correct */
className="transition-[opacity,scale] scale-75"
```

the bare `transition` utility already covers all three, so this only bites when
properties are named explicitly. if a transition looks instant despite a
correct duration, check this first.

## the rules

### never start from zero

`scale(0)` makes a thing appear out of nothing. real objects have size before
they arrive.

```css
/* wrong */ from { opacity: 0; transform: scale(0);    }
/* right */ from { opacity: 0; transform: scale(0.96); }
```

same for travel. `translateY(8px)`, not `translateY(80px)`. the reader needs to
register that it moved, not watch it fly in.

### scale from where it came from

a popover growing out of the middle of itself has no spatial story. set
`transform-origin` to the trigger. radix hands you this:

```css
transform-origin: var(--radix-popover-content-transform-origin);
```

### animate the child, not the hovered parent

if the hovered element moves, the pointer can fall off it, the hover ends, the
element moves back, and the hover starts again. that is the strobe.

```tsx
<div className="group">
  <div className="transition-transform duration-200 group-hover:-translate-y-1" />
</div>
```

the hit target stays still. something inside it moves.

### springs for interruption, curves for everything else

reach for a spring when the motion can be retargeted mid-flight: a drag, a
swipe, a value that updates while the last update is still traveling. a css
transition handed a new target restarts from a standstill, and that dead stop
is the exact moment it stops feeling physical. a spring carries velocity across
the retarget, so something already moving keeps moving.

prefer the duration-and-bounce parameterization over mass, stiffness and
damping. it says what you want, instead of three numbers whose product you
discover by trial:

```ts
{ duration: 0.4, bounce: 0 }
```

`bounce: 0` arrives and stops. above zero it overshoots and comes back. keep it
at zero for anything in a product surface. reserve 0.1 to 0.3 for
drag-to-dismiss, where the overshoot is the physical metaphor doing work.

### everything animated needs a reduced-motion escape

not optional, not "except opacity". every one.

```tsx
className="animate-rise motion-reduce:animate-none"
```

put it on the element, not in a global stylesheet, so it survives being copied
into another project.

for js-driven motion, check the query and render the end state rather than
skipping to it a frame later:

```ts
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
if (reduced) { set({ fill: target }); return }
to({ fill: target })
```

### do not animate keyboard paths

arrow-key list navigation, shortcut-driven focus moves, tab order. these are
high frequency by definition, and the animation reads as lag, not polish.

## worked example: a value that moves while it is already moving

a progress ring on a spring rather than a tween. the target changes while the
last change is still traveling, which is the case a transition handles badly.

```tsx
const paint = React.useCallback(
  ({ fill = 0 }: Record<string, number>) => {
    // written straight to the node. a value that re-rendered react sixty
    // times a second to cross the ring is a value that drops frames.
    arcRef.current?.style.setProperty(
      "stroke-dashoffset",
      `${circumference * (1 - fill)}`
    )
  },
  [circumference]
)

const { to, set } = useSpring(paint, { duration: 0.6, bounce: 0 })

React.useLayoutEffect(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  // first paint is the value, not an empty ring filling itself in front of
  // someone who did not ask for the demonstration.
  if (!started.current || reduced) {
    started.current = true
    set({ fill: target })
    return
  }
  to({ fill: target })
}, [target, set, to])
```

three decisions worth naming. the value is written to a ref and then to the
dom, never through state. the mount case sets rather than animates, because an
element arriving already correct is not the same as an element performing its
correctness. and the reduced-motion branch produces the same final frame as the
animated one, which is the whole point of the branch.

## component contract

anything shipped for other people to copy has to clear all of this:

- [ ] animates only `transform` and `opacity`, or documents the paint and why
- [ ] uses a curve from the set, not an ad-hoc `cubic-bezier`
- [ ] duration is on the scale, and under 300ms unless it is marketing
- [ ] carries its own `motion-reduce:` escape
- [ ] does not start from `scale(0)` or a large translate
- [ ] exposes an off switch: `duration`, `paused` or `disabled`
- [ ] ships its own keyframes and custom properties rather than assuming the
      consumer stylesheet has them
- [ ] merges `className` last, so timing can be overridden from outside

the off switch matters more than it looks. someone will drop this into a
dashboard where it fires forty times per screen.

## debugging

| symptom | cause and fix |
| --- | --- |
| 1px jitter at the ends | gpu handoff. add `will-change: transform`, drop it when idle |
| hover strobes | the hovered element is moving. animate a child |
| sluggish at the right duration | it is `ease-in`. switch to `ease-out` |
| mechanical | it is `linear`. only marquees and time bars get linear |
| two elements drift apart | paired elements need identical duration and easing |
| snaps despite a correct transition | tailwind v4 named `transform`. use `scale` |
| dead only during a theme swap | `next-themes` `disableTransitionOnChange` injects `transition: none !important`. drive it with keyframes instead |
| janky under load | it is on the main thread. move it to css, or to a ref |

## the point

good motion is invisible. nobody finishing a task should stop to admire a
transition, they should just not meet any friction. if a reviewer says "nice
animation", it is probably too much.
