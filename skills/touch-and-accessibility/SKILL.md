---
name: touch-and-accessibility
description: "building for pointers that are not a mouse and readers who are not looking at the screen: tap target sizes, hover that sticks on touch, pointer events and capture, touch-action and scroll conflicts, the 300ms tap delay, keyboard navigation and focus order, focus trapping in overlays, roving tabindex, live regions, accessible names, and reduced motion as a first class path. use when building any interactive component, when something works with a mouse and fails on a phone, or when reviewing for accessibility. triggers on: tap target, 44px, hover on touch, sticky hover, pointer events, pointer capture, touch-action, scroll conflict, tap delay, keyboard navigation, focus order, focus trap, roving tabindex, aria-live, screen reader, accessible name, aria-label, sr-only, prefers-reduced-motion, contrast."
---

# touch and accessibility

these are one topic. both are about the interface working for input methods
and perception that are not the developer's own, and the same components fail
both in the same places.

## targets

**44 by 44 css pixels minimum** for anything tappable. this is the ios human
interface guideline number and it is close enough to the android and wcag
numbers to be the one worth remembering.

the visual size does not have to be 44px. the target does.

```tsx
{/* 16px icon, 44px target, no visual change */}
<button className="relative p-2.5">
  <Icon className="size-4" />
  <span className="absolute -inset-1.5" aria-hidden="true" />
</button>
```

padding is the simplest route. a pseudo-element or an absolutely positioned
overlay works where padding would break the layout.

**8px minimum between adjacent targets.** two 44px buttons flush against each
other still produce mis-taps at the boundary, because the finger contact patch
is larger than the point the browser reports.

the places this is most often wrong: icon buttons in a toolbar, close buttons
on a chip, the checkbox in a table row, and pagination controls.

## hover does not exist on touch

`:hover` on a touch device applies on tap and stays applied until the reader
taps elsewhere. a hover-revealed action stays revealed. a hover-lift stays
lifted. a hover-only tooltip opens and does not close.

```css
@media (hover: hover) and (pointer: fine) {
  .card:hover { transform: translateY(-2px); }
}
```

both conditions matter. `hover: hover` alone still matches a stylus and some
hybrid devices, where hover is real but imprecise.

configure this once as a variant rather than writing the query in every
component.

**the deeper rule: hover may never be the only way to reach something.** an
action revealed on hover is an action that does not exist on a touch device
and does not exist for a keyboard. give it a persistent state, or a focus
state, or both.

```tsx
className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 max-md:opacity-100"
```

## pointer events, not mouse events

`pointerdown`, `pointermove`, `pointerup` cover mouse, touch and stylus in one
set of handlers. use them and delete the touch and mouse pairs.

### capture, always, for drags

```tsx
onPointerDown={(event) => {
  event.currentTarget.setPointerCapture(event.pointerId)
  setDragging(true)
  trackPointer(event)
}}
onPointerMove={(event) => { if (dragging) trackPointer(event) }}
onPointerUp={(event) => {
  event.currentTarget.releasePointerCapture(event.pointerId)
  setDragging(false)
}}
onPointerCancel={() => setDragging(false)}
```

without capture, a fast drag that leaves the element stops receiving events
and the element sticks wherever the pointer left it. with capture, the element
keeps receiving events until release, no matter where the pointer goes.

**`pointercancel` must be handled.** the browser fires it when it takes over
the gesture, which happens on scroll, on a system gesture, and on some
long-press behaviors. an unhandled cancel leaves the component stuck in its
dragging state forever.

### touch-action, and blocking only one axis

a draggable element inside a scrollable page has a conflict: is a vertical
swipe a drag or a scroll? the browser resolves it by waiting, which makes the
drag feel late.

`touch-action` resolves it up front:

```tsx
style={{
  // block only the axis the divider travels on, so the page can still be
  // scrolled with a finger that lands on the frame.
  touchAction: vertical ? "pan-x" : "pan-y",
}}
```

this is the detail people miss. `touch-action: none` makes the drag responsive
and makes the element a dead zone for scrolling, so a finger that lands on a
full-width control cannot scroll the page. block the drag axis only.

### the tap delay

older mobile browsers waited 300ms after a tap to see whether it was a double
tap to zoom. a correct viewport meta removes it on all current browsers:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

`viewport-fit=cover` is what makes `env(safe-area-inset-*)` return real
values. include it.

if a tap still feels slow, the cause is now almost always javascript work in
the handler, not the browser.

## keyboard

### focus order follows the dom

tab order is dom order. css that moves elements visually does not move them in
the tab order, so a `flex-direction: row-reverse` or an `order` property
produces a focus order that jumps around the screen.

fix the dom, not the tab order. `tabindex` with a positive number is almost
always a mistake: it creates a separate tab sequence that runs before every
natural element on the page, and it has to be maintained globally forever.

only two values are safe:

- `tabIndex={0}`: in the natural order.
- `tabIndex={-1}`: focusable by script, not by tab.

### what needs to be reachable

everything interactive. the test is: unplug the mouse and use the feature.

specific things that are commonly unreachable:

- a custom slider with no key handling. arrow keys, home, end.
- a drag-only interaction with no keyboard equivalent.
- a hover-only menu.
- a modal that does not move focus into itself.
- a card where the whole card is clickable but nothing inside it is focusable.

for the slider case, the fix is to use the real role and handle the keys:

```tsx
<div
  role="slider"
  tabIndex={0}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={Math.round(value)}
  aria-orientation={orientation}
  onKeyDown={handleKeyDown}
/>
```

```tsx
const handleKeyDown = (event: React.KeyboardEvent) => {
  const distance = event.shiftKey ? step * 5 : step
  const back = vertical ? "ArrowUp" : "ArrowLeft"
  const forward = vertical ? "ArrowDown" : "ArrowRight"

  if (event.key === back) commit(value - distance)
  else if (event.key === forward) commit(value + distance)
  else if (event.key === "Home") commit(0)
  else if (event.key === "End") commit(100)
  else return

  event.preventDefault()
}
```

shift for a larger step, home and end for the extremes. `preventDefault` only
on keys you handled, so everything else still works.

### roving tabindex

a group of related controls, a tab strip, a toolbar, a menu, should be **one
tab stop**, with arrow keys moving inside it. tabbing through fifteen toolbar
buttons to reach the content is a failure.

```tsx
<div role="tablist" onKeyDown={handleKeyDown}>
  {items.map((item, position) => (
    <button
      role="tab"
      aria-selected={position === index}
      // only the selected tab is in the tab order. the arrows move between
      // them, which is how a tablist is meant to be walked.
      tabIndex={position === index ? 0 : -1}
    />
  ))}
</div>
```

and when selection moves by keyboard, **focus moves with it**:

```tsx
select(position)
tabsRef.current[position]?.focus()
```

without that line, the next arrow key starts from the tab that was just left
behind, and the group becomes unusable after one keypress.

### overlays

a modal or a dialog has four requirements:

1. focus moves into it on open, to the first focusable element or the dialog
   itself.
2. focus is trapped inside while it is open.
3. escape closes it.
4. focus returns to the trigger on close.

number four is the one most often missed, and it is the one that matters most:
without it, closing a dialog dumps focus at the top of the document and the
reader has to tab all the way back.

`<dialog>` with `showModal()` gives you the trap, the escape handling and the
inert background for free. use it unless there is a reason not to.

## screen readers

### accessible names

every interactive element needs one. in order of preference:

1. visible text content.
2. a real `<label>`.
3. `aria-labelledby` pointing at existing visible text.
4. `aria-label` as a string.

`aria-label` is last because it is invisible, so it drifts out of sync with
the design and nobody notices. it is the right answer for an icon-only button
and the wrong answer for anything with text next to it.

an icon beside a text label is decorative and gets `aria-hidden="true"`.
otherwise the label is announced with a meaningless graphic in front of it.

### duplicated visual content is hidden

any element rendered twice for a visual effect gets `aria-hidden` on the
copies:

- the second and later copies in a marquee
- the inverted text layer in a two-color indicator
- a decorative background that repeats content

without this, the content is announced two or three times and the reader has
no way to know why.

```tsx
aria-hidden={index > 0 ? "true" : undefined}
```

### live regions

anything that changes without the reader acting needs announcing:

```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {status}
</div>
```

`polite` waits for a pause. `assertive` interrupts, and is for errors and
genuinely urgent changes only.

the region must be **in the dom before the message arrives**. rendering the
container and the message at the same time means most screen readers announce
nothing. render an empty live region, then fill it.

use it for: form submission results, async errors, items added or removed,
copy-to-clipboard confirmations, anything currently communicated by a toast.

### visual-only affordances must be spoken

if a state is communicated by a fill, a color, a position or a progress bar
and nothing else, it does not exist for a screen reader.

```tsx
{/* read after the label, never shown. without it the button announces as an
    ordinary one, and a press that does nothing is indistinguishable from a
    button that is broken. */}
<span id={hintId} hidden>
  Press and hold for {seconds} seconds to confirm.
</span>
```

`hidden` still exposes the element to `aria-describedby`, which is what makes
this work.

## reduced motion is a design, not a switch

`prefers-reduced-motion: reduce` is set by people who get motion sickness from
parallax and large transitions. it is not a preference for a worse interface.

**reduce, do not remove.** an element that fades without moving is usually
right. removing the animation entirely can remove the feedback that told the
reader their action worked.

**the end state must be identical.** the reduced path and the animated path
resolve to the same frame. a reduced-motion branch that leaves an element at
its start position is a bug that ships, because the developer never has the
setting on.

```ts
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
if (reduced) { set({ fill: target }); return }   // same destination, no travel
to({ fill: target })
```

for a loop that cannot simply stop, resolve it to a sensible frame. a marquee
frozen mid-travel shows a clipped item, so freeze the track at its start
instead.

**test it.** turn the setting on in your os and use the app for ten minutes.
it takes one session to find every place it was handled carelessly.

## contrast

- **4.5:1** for body text.
- **3:1** for large text, which is 18pt or 14pt bold and up.
- **3:1** for interface components and their states: borders of inputs, focus
  rings, icons that carry meaning.

placeholder text and disabled text are the two that most often fail, and
disabled text is a genuine tension: it is meant to look inactive. the
resolution is that disabled controls should be rare, and where a control is
disabled the reason should be visible in text that does meet contrast.

**never use color alone.** an error is red and says what is wrong. a required
field is marked and named. a chart series has a shape or a label as well as a
hue.

## checklist

- [ ] 44px minimum targets, 8px minimum between them
- [ ] `:hover` gated behind `(hover: hover) and (pointer: fine)`
- [ ] nothing reachable only by hover
- [ ] pointer events, with capture and a `pointercancel` handler
- [ ] `touch-action` blocks only the dragged axis
- [ ] viewport meta includes `viewport-fit=cover`
- [ ] focus order is dom order, no positive `tabindex`
- [ ] every interaction has a keyboard path, tested with the mouse unplugged
- [ ] grouped controls use roving tabindex, focus follows selection
- [ ] overlays trap focus and return it to the trigger
- [ ] every interactive element has an accessible name
- [ ] decorative and duplicated content `aria-hidden`
- [ ] live regions present in the dom before they are filled
- [ ] visual-only affordances have a spoken description
- [ ] reduced motion resolves to the same end state
- [ ] contrast met, and nothing communicated by color alone
