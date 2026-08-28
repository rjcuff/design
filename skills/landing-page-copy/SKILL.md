---
name: landing-page-copy
description: "the copy layer of a marketing page: headings as hooks rather than sentences, the badge and title and description shape, claims paired with what they save, stats that carry a denominator, testimonials that read as real, an faq that answers the money questions, pricing copy, and a house style with a banned word list. use when writing or reviewing landing page copy, section headings, pricing cards, faq entries, or placeholder content in a template. triggers on: landing page copy, headline, section heading, hook, badge, description, stat, denominator, testimonial, faq, pricing copy, microcopy, house style, banned words, em dash, placeholder, lorem ipsum."
---

# landing page copy

this is the part buyers judge fastest and authors think about last.

## headings are hooks, not sentences

a section heading that needs a comma to get through is a paragraph wearing a
heading's clothes, and the paragraph underneath is already there to do that
job.

| too long | better |
| --- | --- |
| Four pieces, and none of them is a research project | Four pieces, none to build |
| A working feature by the end of the day, not the quarter | Shipping by this afternoon |
| What it looks like once it is running | Once it is running |
| What changed for the teams shipping on it | What changed for them |

**four to six words.** if it will not fit, the second half belongs in the
description underneath, where there is room for it and where nobody is trying
to read it at 60px.

the hero headline gets more latitude than a section heading, but not much. two
lines at desktop width is the ceiling.

## the shape of a section's copy

three fields, always, in this order.

```ts
badge:       "Capabilities"
title:       "Four pieces, none to build"
description: "Everything below is on the day you create a workspace. No vector
              database to run, no eval harness to write."
```

**the badge is not decoration.** it tells the reader what kind of thing is
coming before they read the hook, which is exactly what lets the hook be
short. one or two words.

**the description is where the qualifying goes.** the "no x, no y" clauses,
the caveats, the specifics. one or two sentences.

## say the thing, then say the cost

every good line has the same shape: a claim, then the thing it saves you.

> Reads your billing provider directly. MRR, expansion, churn and net revenue
> retention are correct the day you connect it, **not the week after somebody
> reconciles them.**

the second half is what makes it copy rather than a feature list. a feature
without the alternative is a spec, and a spec is something the reader has to
do work to evaluate.

this is the most reliable single edit available on a marketing page. take any
flat feature line and add what it replaces.

## numbers need a denominator

a percentage on its own is decoration. every stat gets a line saying what it
was measured across.

```ts
{
  value: 34,
  suffix: "%",
  label: "Fewer bad answers",
  note: "Against the same prompts before evaluation.",
}
```

without the note it is not a claim anybody can evaluate, and a reader who
notices that stops trusting the other two stats beside it.

if you cannot write the denominator, the stat is not ready to ship.

## testimonials

**name, role and company. all three**, or they read as invented, because in a
template they are.

the quotes that work are specific and slightly awkward:

> We had a retrieval stack held together by three cron jobs and one engineer
> who understood it. That engineer is building product again.

the ones that do not:

> Acme has transformed how our team works. Highly recommended.

**write six, and give each a different reason for being happy.** one saved
time, one avoided an incident, one got past a compliance review, one set it up
in an afternoon, one switched from a competitor, one uses it for something you
did not design for. six variations on "it is great" is one testimonial
printed six times.

length varies too. a wall of six quotes all exactly two lines long reads as
generated.

## the faq answers the money questions

not the product ones. by the time somebody reaches the faq they have decided
they want it and are looking for the reason not to buy.

the four that matter, in this order:

1. **what counts as a seat?** billing surprises are the main reason people do
   not start.
2. **is usage metered on top?** say plainly if it is not.
3. **how long is setup?** the real number, including the part that usually
   takes a quarter.
4. **what happens if we leave?** export, ownership, and no hostage taking.

five to eight entries total. answer in the negative where the answer is good:
"No, and there is no setting to turn it on" is stronger than a paragraph about
your commitment to privacy.

## pricing copy

- **say what a seat is on the card**, not only in the faq.
- **show an annual saving by moving the number**, not with a "save 20%" pill
  beside an unchanged price.
- **reserve the footnote line on every card** so the buttons stay on one row.
  a card with no footnote and a card with one should be the same height.
- **the free tier gets a real description**, not "for individuals". "For one
  person building one thing" says who it is for.
- **the included list on a paid template is license terms, not features.**
  commercial use, perpetual, updates, resale. at that point in the page the
  buyer is deciding whether they are allowed to do what they want to do.

## house style

- **no em dashes.** they are the clearest single tell of machine written copy.
  commas, colons and full stops do the same work.
- **no exclamation marks.**
- **no words from this list:** seamless, effortless, powerful, revolutionize,
  unlock, supercharge, game changing, cutting edge, robust, leverage. if a
  word appears on every page in the category it carries no information.
- **spell numbers under ten**, use figures at ten and above, always figures for
  money, versions and measurements.
- **second person for what the reader does.** first person plural sparingly
  for what you do. never third person about yourself.
- **contractions are fine in a quote and not in body copy.** it keeps
  testimonials sounding like people and the page sounding like a company.
- **one idea per sentence.** if a sentence has two clauses joined by "and", it
  is usually two sentences.

## placeholder honesty

everything invented in a template must be obviously invented or obviously
labeled.

- **company names in a logo row are placeholders.** say so in a config
  comment, and say that the row reads as a claim of endorsement once it is
  real.
- **stock photography is fine while building.** note that it should be
  downloaded locally before shipping.
- **every `href: "#"` is a promise the buyer has to keep.** keep them
  countable and comment them.
- **never ship copy naming a different product.** copy lifted from a sibling
  page and left unchanged is the most visible quality tell in a download, and
  it costs nothing to avoid: read the config top to bottom before shipping,
  because it is the first file every buyer opens.

## checklist

- [ ] every section heading four to six words
- [ ] badge, title and description on every section
- [ ] every claim followed by what it saves
- [ ] every stat has a denominator
- [ ] six testimonials, six different reasons, three attributes each
- [ ] faq answers billing, metering, setup time and leaving
- [ ] pricing says what a seat is, on the card
- [ ] no em dashes, no exclamation marks, no banned words
- [ ] placeholders labeled, `href: "#"` countable
- [ ] config read top to bottom before shipping
