---
name: landing-page-performance
description: "keeping a marketing page light while it still looks expensive: a first load javascript budget, lazy mounting anything heavy behind an intersection observer with a placeholder, starting animations on view, cheap scroll reveals without an animation runtime, image and font rules, client boundaries at the section, and reduced motion. use when a landing page feels heavy, before shipping a template, or when deciding whether an effect is affordable. triggers on: first load js, bundle size, lighthouse, lazy mount, dynamic import, intersection observer, rootMargin, placeholder, layout shift, startOnView, scroll reveal, next/image, srcset, inline svg logo, next/font, font subset, use client, client boundary, motion-reduce."
---

# landing page performance

a landing page is judged on the first two seconds. it is also the one kind of
page where authors reach hardest for heavy effects. these are the patterns for
having both.

## the budget

**under 150KB of first load javascript.** state it, then check it in the build
output on every ship.

the common failure is a single decoration pulling in a 3d or physics library:
several hundred kilobytes of javascript for one strip of animated gradient.
the lazy mounting below makes that survivable, but it should not have been
necessary.

**the strongest structural move is having no animation runtime at all.** css
and a little state covers almost every effect a marketing page needs, and the
whole `css-animations` skill is about where the line actually is. if a page
needs an animation library, that is usually a signal the effect is wrong for
the format, not that the budget should move.

## lazy mount anything expensive

the single highest value pattern here. anything heavy is neither downloaded
nor mounted until it is close to the viewport.

```tsx
const DynamicCanvas = dynamic(
  () => import("@/components/effects/canvas").then((m) => m.Canvas),
  { ssr: false }
)

export function LazyCanvas({ rootMargin = "200px", ...props }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [shouldMount, setShouldMount] = React.useState(false)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el || shouldMount) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        setShouldMount(true)
        io.disconnect()
      },
      { rootMargin, threshold: 0.01 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin, shouldMount])

  // one frame between mount and fade, so the canvas has painted before it is
  // shown and the transition does not run against a blank element.
  React.useEffect(() => {
    if (!shouldMount) return
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [shouldMount])

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div aria-hidden className="from-muted/10 via-muted/25 to-muted/10 absolute inset-0 bg-linear-to-r" />
      {shouldMount ? (
        <div className={cn("absolute inset-0 transition-opacity duration-500", visible ? "opacity-100" : "opacity-0")}>
          <DynamicCanvas {...props} />
        </div>
      ) : null}
    </div>
  )
}
```

four things it gets right, all worth copying.

1. **a separate chunk, excluded from the server render.** the code never
   reaches anyone who does not scroll to it.
2. **a 200px root margin.** loading starts before the element is visible, so
   the first thing the reader sees is the fade rather than the download.
3. **a placeholder occupying the space from the first paint.** no layout shift
   when the real thing arrives.
4. **the observer disconnects in the callback and in cleanup.** fires once,
   leaks nothing.

use it for: webgl, canvas, maps, video players, anything above about 30KB, and
any below the fold component running a frame loop.

## start animations on view

a page with ten animated sections that all run on mount is ten concurrent
animations competing for the first frame, nine of them off screen.

every animated component on a marketing page should start when it enters the
viewport. the only exception is the hero, which is above the fold by
definition and should start immediately.

this is also the fix for looping animations, which otherwise keep running and
keep their compositor layers alive while scrolled away. see
`animation-performance` for the hook.

## scroll reveals without a runtime

the reveal wrapper is the one effect every marketing page uses, and it does
not need a library.

```tsx
<h1 className="animate-rise" />
<p  className="animate-rise [animation-delay:60ms]" />
<div className="animate-rise [animation-delay:120ms]" />
```

```css
@keyframes rise {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

`both` on the fill mode is required with a delay, or every element flashes at
full opacity before it starts. see `css-animations`.

60ms steps down a page, 40ms for small items in a list. under 40 the ladder
reads as one movement, over 100 the last item is late. the judgement is in
`animation-craft`.

**for a group, let the parent schedule the children.** one observer that sets
a per child delay beats one observer per child: fewer observers, and no
possibility of them disagreeing about when the group arrived.

**reveal once.** an element that re-animates every time it re-enters is an
element fighting the reader on the way back up the page.

## images

- **local, never hotlinked.** a remote image is a dns lookup, a tls handshake
  and a third party who can change or remove the file. in a paid template it
  is a defect.
- **explicit width and height** wherever the rendered size is known, rather
  than a fill layout with a sizes attribute. the generated srcset stays at 1x
  and 2x instead of emitting the full ladder.
- **inline svg for logos.** no request, no layout shift, and it recolors with
  the theme through `currentColor`. keep them in the config as elements.
- **screenshots inside device frames export at exactly 2x the frame's
  rendered width.** anything larger is bytes nobody sees.
- **modern formats**, and let the image pipeline do it rather than shipping
  pre-converted files you have to maintain.

every image above the fold that is not the hero should be lazy. the hero image
should be eager and preloaded, because it is the largest contentful paint.

## fonts

- **a framework font loader**, which generates the metric overrides that stop
  the swap from shifting layout. see `interface-polish` for what those are.
- **`display: swap`**, subset to the scripts you actually use. latin only is
  usually a third of the file.
- **two families maximum**, one sans and one mono. a third family shows up in
  the font loading waterfall and is almost never a design requirement.

open graph image fonts are a separate concern and have to be fetched as a
buffer. see `landing-page-seo`.

## client boundaries

default to a server component. add the client directive when the section has
state, a listener or a hook. an faq with an accordion is client. a logo row
and a footer are not.

**the common mistake is putting the client directive at the top of the page
file** because one section needs it. that makes the entire page a client
bundle. sections are separate files precisely so the boundary can sit at the
section.

## reduced motion

every animated component carries its own escape, in the component rather than
in a global stylesheet, so a buyer who copies one file out still gets it:

```
motion-reduce:animate-none motion-reduce:transition-none
```

for scroll linked and javascript driven effects, check the media query
directly and render the end state.

this is an accessibility requirement first. it is also free performance on
exactly the machines that need it most.

## ship checklist

- [ ] first load javascript under 150KB, verified in the build output
- [ ] no animation runtime dependency
- [ ] every below the fold effect behind an intersection observer with a
      placeholder
- [ ] animations start on view, except in the hero
- [ ] reveals fire once, groups scheduled by their parent
- [ ] all images local, sized, and through the image pipeline
- [ ] hero image eager and preloaded, everything else lazy
- [ ] logos as inline svg in config
- [ ] two font families, swap, subset
- [ ] client directive at the section, never at the page
- [ ] `motion-reduce:` on every animated component
- [ ] lighthouse 95 or better on performance, 100 on accessibility
