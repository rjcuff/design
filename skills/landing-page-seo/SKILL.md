---
name: landing-page-seo
description: "the metadata layer a page should ship with, so changing one string makes the whole site correct: a single metadata factory, metadataBase and why cards break without it, title templates, open graph images by route handler or file convention, satori constraints, sitemap and robots, canonicals, keywords, and json-ld worth having. use when setting up metadata for a marketing site or template, when a link preview shows no card, or when adding a new route to an existing site. triggers on: metadata, constructMetadata, metadataBase, open graph, og image, twitter card, ImageResponse, satori, edge runtime, sitemap, robots.txt, canonical, alternates, keywords, json-ld, structured data, FAQPage, link preview broken."
---

# landing page seo

the goal: a buyer changes one string and the whole site is correct. title,
description, social card, sitemap, canonical.

## one helper, called once

put everything in a factory and call it from the root layout.

```ts
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || siteConfig.url}${path}`
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = absoluteUrl("/og"),
  ...props
}: {
  title?: string
  description?: string
  image?: string
  [key: string]: Metadata[keyof Metadata]
}): Metadata {
  return {
    title: { template: `%s | ${siteConfig.name}`, default: siteConfig.name },
    description,
    keywords: siteConfig.keywords,
    openGraph: {
      title,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    icons: "/favicon.ico",
    metadataBase: new URL(siteConfig.url),
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    ...props,
  }
}
```

```ts
// app/layout.tsx
export const metadata: Metadata = constructMetadata({
  title: `${siteConfig.name} | ${siteConfig.description}`,
})
```

**why a factory rather than a literal.** a one pager has one page today and a
privacy page, a terms page and maybe a blog by the time the buyer ships. with
the factory each of those is two lines and inherits everything else. the
trailing spread lets any page override a single field without restating the
object.

## metadataBase is not optional

without it, relative open graph image urls are emitted, and every scraper,
slack, x, linkedin, imessage, silently shows no card at all.

it is the most common broken thing in shipped templates, it produces no error
anywhere, and the only way to notice is to paste your own link into a chat.
do that before shipping.

## title template

```ts
title: { template: `%s | ${siteConfig.name}`, default: siteConfig.name }
```

home gets the bare brand. every child page gets `Page | Brand` for free by
setting only its own title string. never hand write the suffix in page files,
because the day the brand name changes you will find four of the six.

## the open graph image

two approaches, both worth knowing.

**route handler.** one endpoint, title from a query parameter.

```tsx
export const runtime = "edge"

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title") || siteConfig.description
  const fontData = await fetch(
    new URL("../../assets/fonts/Inter-SemiBold.ttf", import.meta.url)
  ).then((r) => r.arrayBuffer())

  return new ImageResponse(<div style={{ display: "flex" }}>{title}</div>, {
    width: 1200,
    height: 630,
    fonts: [{ name: "Inter", data: fontData, style: "normal" }],
  })
}
```

**file convention.** `opengraph-image.tsx` beside the route it belongs to, and
the framework wires it up. no url to construct.

```tsx
export const runtime = "edge"
export const alt = siteConfig.name
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
```

prefer the file convention for anything with real routes, because it cannot
drift from the page it belongs to. use the route handler when one card serves
the whole site with a swappable title.

### two hard rules for generated images

**fonts must be fetched as a buffer and passed in.** the renderer has no
access to your css font stack. wrap the fetch in a try and fall back to a
system font, because a failed font fetch otherwise returns a 500 and the card
disappears entirely.

**inline styles only, and a subset of flexbox.** no utility classes. every
element containing more than one child needs an explicit `display: "flex"`,
and the error when it is missing is not obvious.

test the output by rendering the endpoint in a browser before shipping. it is
the one asset nobody looks at until it is wrong in public.

## sitemap and robots

for a one pager, this is enough:

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteConfig.url, lastModified: new Date() }]
}
```

reading the host from request headers instead makes it correct on a preview
deploy, the production domain and a buyer's own domain with no configuration,
which is a nice trick, but it forces the route dynamic. for a real page list,
prefer static and build the urls from config.

ship a robots file too. it is four lines and most templates omit it.

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
```

## canonicals

```ts
alternates: { canonical: absoluteUrl("/") }
```

a template gets deployed on a preview domain and a real domain at the same
time more often than not, and without a canonical both get indexed and split
the ranking.

## keywords

a flat array of four to eight phrases in config. search engines have ignored
the meta tag for over a decade, but smaller indexes and answer engines do not,
and it costs one line.

keep it honest. a term the page does not deliver on buys a visit that bounces,
which is worse than no visit.

## per page metadata

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)
  return constructMetadata({
    title: post.title,
    description: post.summary,
    image: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
  })
}
```

three lines of override, everything else inherited. this is the payoff for the
factory.

## structured data worth shipping

most json-ld earns nothing. two kinds do.

**`FAQPage` on the faq section.** nearly free, because the data is already an
array of question and answer pairs in config, and it is the structured data
that most reliably wins extra space in a result.

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: siteConfig.faqSection.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }),
  }}
/>
```

generate it from the same array the section renders, so the two can never
disagree.

**`SoftwareApplication` or `Product` on the landing page**, with the name,
description and offer. worth the ten lines.

anything beyond those two is usually effort with no result.

## checklist

- [ ] one metadata factory, called from the root layout
- [ ] `metadataBase` set from config
- [ ] title template `%s | Brand`, bare brand as the default
- [ ] open graph image by file convention where routes are real
- [ ] fonts fetched as a buffer, with a fallback
- [ ] inline styles only in the generated image, explicit flex
- [ ] link pasted into a chat client and the card confirmed
- [ ] sitemap and robots both present
- [ ] canonical on every route
- [ ] four to eight honest keywords
- [ ] faq json-ld generated from the same array the section renders
- [ ] the public url variable documented in the readme and an example env file
