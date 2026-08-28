---
name: template-architecture
description: "how a one-page template or landing page is put together so a buyer can change the whole site without opening a component: the three file spine, one config file as the schema, sections that take no props, in-page anchors, the bordered canvas against free flow, shipping only the components the page uses, and the running order of sections with what each one owes. use when building a landing page template, structuring a marketing site, or deciding where copy should live. triggers on: landing page, template, one pager, marketing site, site config, page.tsx, section component, sections order, hero, pricing section, faq, testimonials, cta, footer, divide-y, section header, config file, no props."
---

# template architecture

a template is not an app. it is one route, one content file, and a shelf of
sections. every structural decision below follows from that, and most of them
are about making the thing easy for a **buyer** to change, not easy for the
author to write.

## the three file spine

```
src/
  app/page.tsx          one route, a list of section imports, nothing else
  lib/config.tsx        all copy, all data, all links
  components/section/   one file per section, each reading its own slice
```

`page.tsx` contains no markup beyond a wrapper:

```tsx
export default function Home() {
  return (
    <main className="flex flex-col divide-y divide-border pt-16">
      <HeroSection />
      <DemoSection />
      <LogoRow />
      <WorkflowSection />
      <FeatureSection />
      <TestimonialSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}
```

that file is the product. a buyer deletes a line to drop a section and moves a
line to reorder the page. no prop threading, no layout config, no cms. the
whole page order is legible in one screen.

**a section takes no props.** it reads its own key from the config directly.

this looks wrong if you think of sections as reusable components. they are
not. they are page furniture, used once. props would only move the content
back into `page.tsx` and destroy the property that makes the spine work.

## the config file

one file. use the `.tsx` extension, not `.ts`, because it holds icons and
inline svg logos.

```tsx
export const siteConfig = {
  name: "Acme",
  description: "One sentence that says what it is.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: ["...", "..."],
  links: { email, twitter, github },
  nav: { links: [...] },

  hero: { badge, badgeIcon, title, description, cta: { primary: { text, href } } },
  demoSection: { title, description, items: [...] },
  featureSection: { badge, title, description, sections: {...} },
  pricing: { title, description, plans: [...] },
  faqSection: { title, description, items: [...] },
  ctaSection: { title, subtext, button: {...} },
  footerLinks: [...],
}

export type SiteConfig = typeof siteConfig
```

the decisions that carry it:

**one key per section, named after the section.** `featureSection` is read only
by `feature-section.tsx`. the mapping is one to one and mechanical, so a buyer
editing the features never has to hunt for where the copy lives.

**`url` is env first**, with a localhost fallback. the template ships working
on localhost and is correct on a deploy with one environment variable. no
build step and nothing to remember.

**the config is the schema.** `export type SiteConfig = typeof siteConfig`.
never hand write an interface for it, because editing copy would then mean
editing two files, which is the exact thing this design exists to avoid.

**sections cache their slice at module scope.** `const featureConfig =
siteConfig.featureSection`. cheap, and it keeps the jsx free of
`siteConfig.featureSection.sections.blocks[0].title`.

**every array item carries an `id`.** react keys come from data, never from
index.

### where to draw the line

copy, links, prices, faq text, logos, nav: config. layout, spacing, animation
timing: the section file.

the test: if a buyer would change it to make the template theirs, it is
config. if changing it would break the design, it is code.

## section files

roughly 60 to 200 lines each. mark a section as a client component only when
it actually holds state or a hook. an faq with an accordion is client, a logo
row is not.

the common mistake is putting the client directive at the top of `page.tsx`
because one section needs it, which makes the entire page a client bundle.
sections are separate files precisely so the boundary can sit at the section.

consistent internal shape:

```tsx
const featureConfig = siteConfig.featureSection

export function FeatureSection() {
  return (
    <section id="features" className="relative w-full">
      <SectionHeader>
        <HeaderBadge icon={featureConfig.badgeIcon} text={featureConfig.badge} />
        <h2>{featureConfig.title}</h2>
        <p>{featureConfig.description}</p>
      </SectionHeader>

      {/* the section body */}
    </section>
  )
}
```

**every section has an `id`**, because the nav and the hero calls to action are
all in-page anchors. that is the only routing a one pager has.

## two shells, pick one

**bordered canvas.** the layout wraps everything in a fixed width box with side
borders, and sections divide themselves.

```tsx
// layout
<div className="mx-auto w-full max-w-7xl border-x border-border">
  <Navbar />
  {children}
</div>

// page
<main className="flex flex-col divide-y divide-border pt-16">
```

`divide-y` on the parent means no section draws its own top or bottom border,
so reordering never leaves a doubled or missing rule. the side borders make
the page feel like a document. costs one line and looks deliberate.

**free flow.** no frame. a shared section wrapper carries the rhythm instead,
taking a title, a subtitle and an alignment. sections pass copy in as props
here rather than reading config, because this wrapper is genuinely reusable.

the bordered canvas suits anything structured: a design system, a developer
tool, a data product. free flow suits consumer and mobile app pages, where the
frame would read as heavy.

`pt-16` clears a fixed header. put it on `main`, once, not on the hero.

## the running order

| # | section | job on the page |
| --- | --- | --- |
| 1 | hero | name the product, give one action |
| 2 | demo | show it working before anything is claimed |
| 3 | logo row | borrow trust |
| 4 | workflow | how it works, in steps |
| 5 | benefits | where it fits |
| 6 | features | what it does, in depth |
| 7 | integrations | what it connects to |
| 8 | testimonials | trust, in someone else's words |
| 9 | pricing | the ask |
| 10 | faq | remove the last objection |
| 11 | cta | ask again, now that they know |
| 12 | footer | everything that is not the pitch |

two structural facts worth keeping. **proof comes before claims**: the demo at
two and the logos at three, before the feature section at six. and **the page
asks twice**: pricing at nine, cta at eleven.

twelve sections is the shape. fewer than eight reads as a thin product. more
than fourteen and the page stops being read.

no about section. no blog link above the fold.

## what each one owes

**hero.** badge, headline, one paragraph, one primary action. a single call to
action beats a primary and a secondary, because the secondary is usually there
because nobody could decide. the badge does real work: a pill above the
headline that dates the page as current and tells the reader what kind of
thing is coming, which is what lets the headline be short. keep the headline
to two lines at desktop width.

if you have a live component to put in the right hand slot, use it. a working
thing beats a screenshot of a working thing.

**demo.** the section that earns the rest of the page. a tab strip or a
scroll-linked panel with three or four states, each with a title, a sentence
and an image. four is the right number: enough to show range, few enough that
all four fit in one strip.

**logo row.** monochrome, in a marquee only if there are more than six. inline
svg in the config, not image files: no layout shift, no request, and it
recolors with the theme.

**workflow.** numbered steps. the one section where a straight ordered list is
correct and nobody minds.

**features.** the long one. two columns, the copy column sticky at the top and
the visuals scrolling past it. cheap to build, reads as considered, and keeps
the claim on screen while the evidence goes by.

**testimonials.** a wall or a vertical marquee. quotes need a name, a role and
a company, or they read as invented, because in a template they are.

**faq.** accordion, single open, five to eight questions.

**cta.** headline, one button, usually over a full width effect. short.

**footer.** three or four link columns from config, logo, social row.

## pricing

a single card converts better than a three tier table when there is one
product.

```
                    [ Pricing ]                    small bordered pill, centered
        Simple pricing for unlimited access         48 to 60px, tight tracking
     one paragraph, two lines, muted                what the price covers

+------------------------------------------+
| Individual licence, lifetime  [POPULAR]   |   tinted head only
| $79  $129                                 |   56 to 72px, struck comparison
| one time payment                          |
| two lines on what it is                   |
+------------------------------------------+
| What is included                          |
| + Lead phrase. Then the explanation.      |   filled circle ticks
| + ...six of these                         |
| [   Get unlimited access              ]   |   full width, glow beneath
| team licence line, small, muted           |
+------------------------------------------+
```

details that carry it:

- **the tint lives only on the head of the card.** a gradient across the whole
  card looks like a template.
- **the included list is licence terms, not features.** commercial use,
  perpetual, lifetime updates, resale prohibited. at this point in the page the
  buyer is deciding whether they are allowed to do the thing they want to do.
- each item is a bolded lead phrase then a muted sentence. scannable and
  readable, in that order.
- the glow under the button is a blurred absolutely positioned copy of the
  button behind it, inset slightly. color spills past the edge instead of
  sitting on it.
- **ticks are filled circles with a knocked out check**, not outline strokes.
  outline ticks disappear at 14px.

## shared primitives, and how few there are

a twelve section page needs roughly ten to twelve shared components, and half
of them are decoration rather than controls: accordion, button, card, select,
navigation, a reveal wrapper, a marquee, a dot or grid pattern, a badge.

that is the whole kit. **a template does not need a design system.** it needs
the six controls the page touches and the four effects that make it look
expensive.

if you have a large component library, the lesson runs the other way: **do not
put all of it in the template.** pick the six to ten the page actually uses
and delete the rest from the delivered package. a buyer opening a template
with forty unused components thinks they bought a framework, and starts
looking for the documentation they are owed.

## section header primitive

nine lines, used by every section:

```tsx
export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border h-full w-full border-b p-6 md:p-24">
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center gap-2">
        {children}
      </div>
    </div>
  )
}
```

`max-w-lg` on the header while the section body runs to the full canvas is the
whole trick. a centered heading over a wide body reads as composed. a heading
as wide as its body reads as a document.

`md:p-24` is a lot of padding and it is correct. generous vertical space is
most of what makes a paid template feel paid.

## a badge component

pill, border, muted text, optional leading icon, sits above the section
heading. it is the cheapest way to give twelve sections visual structure
without twelve different layouts. build it once.

## defects that ship

these are all real, all common, and all free to avoid.

- **hotlinked stock photography.** every image is a dns lookup, a handshake,
  and a third party who can change or remove the file. ship local assets.
- **copy from a sibling template left in place**, naming the wrong product.
  this is the single most visible quality tell in a download.
- **typos in the config file**, which is the first file every buyer opens.
- **`href: "#"` on every link** with no note about which are meant to be
  filled in. keep them countable and comment them.
- **an experimental framework flag left on** that degrades the dev experience.

read the config top to bottom before shipping. it takes ten minutes and it
catches three of the five.

## checklist

- [ ] one `app/page.tsx`, imports only, under 40 lines
- [ ] one config file, one key per section, type derived from it
- [ ] one file per section, no props, its own `id`
- [ ] client boundary at the section, never at the page
- [ ] `divide-y` on `main`, `border-x` on the canvas, `pt-16` once
- [ ] only the components the page uses, nothing spare
- [ ] `url` reads an environment variable with a localhost fallback
- [ ] every array item has an `id`
- [ ] runs with an install and a dev command, no env file required
- [ ] config read top to bottom before shipping
