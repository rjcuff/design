# ease-out

**v1.0.0** | [changelog](CHANGELOG.md) | [license](LICENSE.md)

seventeen skills covering interface motion, visual detail, component api
design, and shipping a landing page that looks paid for.

updates are free for as long as the pack exists. they arrive by email at the
address you bought with, and the [changelog](CHANGELOG.md) says what moved in
each one, so you can re-read only what changed.

each is a directory with a `SKILL.md` inside it. the frontmatter carries a
`name`, a `description` and the trigger phrases an agent matches on, so they
work as claude code skills, as cursor rules, or as plain reference documents.

## the tracks

### motion

start with `motion-system`. it is the decision layer and the other six are the
depth behind it.

| skill | what it settles |
| --- | --- |
| [motion-system](motion-system/SKILL.md) | which easing, how long, what to animate, when not to |
| [animation-craft](animation-craft/SKILL.md) | pace as a claim, sequencing, blur, knowing when to stop |
| [animation-performance](animation-performance/SKILL.md) | the layout, paint and composite pipeline, and the frame budget |
| [css-animations](css-animations/SKILL.md) | transitions, keyframes, and when a library is not needed |
| [animation-orchestration](animation-orchestration/SKILL.md) | springs, phases, staggering, measuring before moving |
| [clip-path](clip-path/SKILL.md) | reveals, comparison sliders, two-color indicators, fills |
| [svg-fundamentals](svg-fundamentals/SKILL.md) | viewBox, paths, stroke drawing, transform origins |

### interface craft

| skill | what it settles |
| --- | --- |
| [interface-polish](interface-polish/SKILL.md) | type, font loading, shadows, gradients, z-index, dark mode |
| [forms-and-controls](forms-and-controls/SKILL.md) | inputs, autofill, the ios zoom rule, buttons, destructive actions |
| [touch-and-accessibility](touch-and-accessibility/SKILL.md) | targets, pointer events, keyboard paths, screen readers |
| [component-api-design](component-api-design/SKILL.md) | composition, prop naming, asChild, escape hatches |

### design system

| skill | what it settles |
| --- | --- |
| [design-tokens](design-tokens/SKILL.md) | where tokens live, retheming, and what a distributed component may use |

### landing pages

| skill | what it settles |
| --- | --- |
| [template-architecture](template-architecture/SKILL.md) | the file spine, one config, sections with no props, the running order |
| [landing-page-layout](landing-page-layout/SKILL.md) | the canvas, grid splits, padding, hierarchy, full bleed rows |
| [landing-page-copy](landing-page-copy/SKILL.md) | headings as hooks, stats with denominators, house style |
| [landing-page-performance](landing-page-performance/SKILL.md) | budget, lazy mounting, images, client boundaries |
| [landing-page-seo](landing-page-seo/SKILL.md) | metadata factory, social cards, sitemap, structured data |

## the ten things that matter most

1. **frequency beats craft.** a 200ms transition on a control someone operates
   all day is a 200ms tax charged all day. `motion-system`
2. **the real test is not "transform or opacity", it is "does this touch
   layout, and if it paints, how many pixels".** `animation-performance`
3. **a frame that re-renders is a frame that can drop.** write to a ref, then
   to the dom. `animation-performance`
4. **a component may only use a token it ships with itself.** the failure is
   silent. `design-tokens`
5. **the canvas sets the width and sections fill it.** centering a column
   inside every section is what makes a page read as a blog.
   `landing-page-layout`
6. **one route, one config, one file per section, no props.** a buyer changes
   the whole site without opening a component. `template-architecture`
7. **headings are four to six words.** everything else goes in the description
   under them. `landing-page-copy`
8. **one reveal primitive on a counted delay ladder**, not five kinds of
   animation. `animation-craft`
9. **nothing may be reachable only by hover.** it does not exist on a touch
   device and it does not exist for a keyboard. `touch-and-accessibility`
10. **configuration for things with one shape, composition for things with
    many.** adding a wrapper later is easy, extracting composition is a
    breaking change. `component-api-design`

## house style

the skills follow the conventions they describe, which is deliberate: they are
also a sample of the writing.

- lowercase for prose, normal conventions for code identifiers
- american english
- ascii punctuation only, no em dashes
- every claim states the failure it prevents, not just the rule
