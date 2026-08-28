---
name: animation-craft
description: "the judgement calls that separate a correct animation from a good one: matching pace to what a product should feel like, marketing pace against product pace, sequencing a group so it reads as one movement, using blur to sell speed and hide seams, and knowing when a thing is finished. use when an animation is technically right but feels wrong, when picking durations for a landing page against an app, when an entrance falls flat, or when deciding whether to stop. triggers on: feels off, feels cheap, feels slow, too fast, what duration, stagger, sequencing, entrance, wave, premium, snappy, elegant, polish, is this done."
---

# animation craft

`motion-system` settles what is correct. this settles what is good. the gap
between the two is where most interfaces lose.

everything here assumes the mechanics are already right. if the easing is
wrong or the property is expensive, fix that first, because no amount of taste
rescues a transition that drops frames.

## pace is the thing people actually read

a reader cannot name your easing curve. what they register is pace, and pace
is the single strongest carrier of what a product is claiming to be.

| pace | reads as | where it belongs |
| --- | --- | --- |
| 80 to 120ms, minimal travel | precise, tool-like, slightly cold | developer tools, terminals, dense data |
| 150 to 200ms, small travel | neutral, competent, invisible | most product ui |
| 250 to 350ms, visible travel | considered, expensive, calm | onboarding, settings, empty states |
| 400ms and up | cinematic, deliberate, a little slow | marketing only |

pick the band before picking the number. a product that animates at 300ms
everywhere is making a claim about itself, and if the rest of the interface is
a dense table, the claim does not land, it just feels slow.

the mistake is choosing per-component. a modal at 260ms next to a dropdown at
90ms is not two good decisions, it is a product with no opinion.

## marketing pace is not product pace

they are different jobs and they take different numbers.

**product surfaces** are operated. the reader has a task, the animation is in
the way of it, and they will see the same transition several hundred times.
the ceiling is 300ms and most things should sit well under it.

**marketing surfaces** are read. the reader has no task except deciding
whether to care, they will see each animation once, and the motion is part of
the argument rather than an obstacle to it. 400 to 600ms is fine. an entrance
that would be intolerable in a dashboard is correct on a hero.

the failure runs both directions and both are common:

- marketing timing dragged into the product. every panel takes 500ms, the app
  feels underwater, and nobody can say why because each individual transition
  looks lovely in isolation.
- product timing dragged into marketing. the hero content snaps in at 120ms,
  nothing has any weight, and the page reads as a prototype.

when the same component appears in both places, let it take a duration prop
and set it at the boundary. do not fork the component.

## sequencing: make a group read as one movement

several elements arriving at once is a flash. several elements arriving on a
ladder is a wave, and a wave is what makes a section feel composed rather than
assembled.

the whole technique is the gap between rungs.

| gap | reads as |
| --- | --- |
| under 40ms | one movement, order is lost |
| 40 to 60ms | a sequence, items still feel related |
| 60 to 100ms | deliberate, each item its own event |
| over 100ms | the last item is late and the reader has moved on |

40ms for small items inside a list. 60ms for blocks down a page. never more
than about eight rungs before something is waiting too long to arrive.

two scheduling schemes, and you only need these two.

**index ladder.** one constant, multiplied by position in source order.

```tsx
const RUNG = 60
<h2 style={{ animationDelay: `${RUNG * 2}ms` }} />
<p  style={{ animationDelay: `${RUNG * 3}ms` }} />
```

simple, and its one weakness is that inserting a section means renumbering
everything below it.

**base plus offset.** the section gets a rung, items within it stagger off it.

```tsx
style={{ animationDelay: `${RUNG * 4 + index * 40}ms` }}
```

this is the one to use inside any list, because the list keeps its internal
rhythm no matter where the section lands on the page.

### let a parent schedule its children

when a group arrives together, one observer on the parent beats one observer
per child. fewer observers, and no chance of them disagreeing about when the
group arrived.

```tsx
// the grid observes once and hands each tile its rung
<div ref={gridRef} data-visible={visible ? "" : undefined}>
  {tiles.map((tile, index) => (
    <Tile key={tile.id} style={{ "--rung": `${index * 40}ms` }} />
  ))}
</div>
```

```css
[data-visible] .tile { animation: rise 400ms var(--ease-out-quart) var(--rung) both; }
```

at six tiles that is five observers saved, and the grid can never arrive in
two halves.

### reveal once

anything that reveals on scroll reveals once. an element that re-animates
every time it re-enters is an element fighting the reader on the way back up
the page.

## blur

blur does two jobs and both are worth knowing.

**selling speed.** a small blur along the axis of travel reads as motion the
eye cannot resolve, which is what fast motion actually looks like. 2 to 6px,
on the moving element, cleared by the time it lands. beyond about 8px it stops
reading as speed and starts reading as an effect.

**hiding a seam.** where two states do not quite reconcile, a brief blur over
the transition covers the discontinuity. this is not cheating. it is the same
trick a cut in film does, and the reader is not owed a look at your seam.

the constraint is cost. blur is a paint over the whole filtered area, it is
expensive, and it is worst in safari. keep animated blur under 20px, and treat
anything larger as static only: one pass over a container whose children move
underneath it, never a value that changes per frame.

a fade that also blurs slightly reads as more expensive than a fade alone, for
about two lines of css. it is the cheapest upgrade in this file.

## seeing your own work

after twenty passes you cannot see it any more. the fixes:

- **screen-record and step frame by frame.** almost every complaint that
  cannot be articulated becomes obvious at 1/60th speed. a stutter is a change
  of speed. a flat entrance is usually one element arriving on the wrong rung.
- **halve it, then double it.** run the animation at half duration and at
  double. one of the three will be obviously right, and it is often not the
  one you had.
- **watch it on a cold load, not on a hot reload.** hot reload skips the state
  the reader actually starts from.
- **watch it on the slowest machine you own**, throttled, with the cpu busy.
  motion that only works on your laptop is not shipped.
- **come back the next day.** the single most reliable tool here, and the one
  people skip.

## when it is finished

it is finished when removing it would be noticed and adding to it would not.

that is a real test, not a slogan. take the animation out and look at the
result. if nothing is lost, it was decoration and it should stay out. if
something is lost, put it back and stop, because the next addition is the one
that starts costing.

the tell that you have gone past the line: the animation is the thing you
notice. a reader admiring your transition is a reader who stopped doing what
they came to do.

## what to cut first

when a page has too much motion, cut in this order.

1. **anything above the fold that is not the hero.** it is already visible.
   animating it delays the first thing anybody reads.
2. **anything seen constantly.** nav, sidebar, tab bar. these are pure tax.
3. **anything on a keyboard path.** it reads as lag.
4. **the second effect in any section.** one idea per section. a section with
   a reveal and a hover and a parallax is a section with none.
5. **scroll-linked motion where a one-shot reveal would do.** scroll-linked
   work runs on every frame of every scroll, forever. a reveal runs once and
   is finished. nine sections in ten want the reveal.

## checklist

- [ ] one pace band chosen for the product, not one per component
- [ ] marketing and product durations are different numbers, set at the boundary
- [ ] groups arrive on a ladder, 40 to 60ms per rung, under eight rungs
- [ ] lists stagger off their section rung, not from zero
- [ ] a parent schedules its children where there is a parent
- [ ] reveals fire once
- [ ] animated blur under 20px, large blur static only
- [ ] recorded and stepped through at least once
- [ ] removing it would be noticed
