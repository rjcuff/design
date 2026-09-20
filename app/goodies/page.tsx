import type { Metadata } from "next";
import Image from "next/image";

import icons from "@/app/goodies-icons.json";
import { type Good, goodGroups } from "@/app/goodies";
import { siteConfig } from "@/app/site-config";
import styles from "@/app/components/layout.module.css";

const title = "Goodies";
const description =
  "Courses, tools and references worth keeping a link to, collected while building the concepts on this site.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/goodies" },
  openGraph: {
    title: `${title} | ${siteConfig.title}`,
    description,
    url: "/goodies",
  },
};

const iconFor = icons as Record<string, string | undefined>;

/**
 * The site's own favicon, or a neutral square when it has none.
 *
 * A fallback rather than a broken image, because one site in twenty serves
 * nothing usable and that should not leave a hole in the row.
 */
function EaseMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      <polygon
        points="8.27,3 15.73,3 21,8.27 21,15.73 15.73,21 8.27,21 3,15.73 3,8.27"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoodIcon({
  id,
  name,
  inlineIcon,
}: {
  id: string;
  name: string;
  inlineIcon?: Good["inlineIcon"];
}) {
  if (inlineIcon === "easeui") return <EaseMark />;

  const src = iconFor[id];

  if (!src) {
    return (
      <span
        aria-hidden="true"
        className="border-line text-text-dim grid size-4 shrink-0 place-items-center rounded-[3px] border text-[0.5rem]"
      >
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={16}
      height={16}
      // Every one of these is a different site's favicon at a different
      // aspect ratio, so the box is fixed and the image fits inside it.
      className="size-4 shrink-0 rounded-[3px] object-contain"
      unoptimized
    />
  );
}

export default function GoodiesPage() {
  /*
   * A collection of links is exactly what ItemList describes, so say so
   * rather than leaving a search engine to infer a page of anchors. Each
   * entry keeps its position, because the order here is editorial.
   */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${siteConfig.url}/goodies`,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.href,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: goodGroups.flatMap((group) =>
        group.goods.map((good, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: good.name,
          description: good.note,
          url: good.href,
        })),
      ),
    },
  };

  return (
    <div className={styles.column}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <h1 className="text-text text-2xl font-medium tracking-tight">{title}</h1>

      <p className="text-text-muted mt-3 text-sm leading-6">
        Courses I worked through, tools I still open weekly, and a few sites I
        go to when something is not working and I cannot say why.
      </p>

      {goodGroups.map((group) => (
        <section key={group.id} className="mt-12">
          <h2 className="text-text text-sm font-medium">{group.title}</h2>

          <ul className="mt-4 flex flex-col gap-3">
            {group.goods.map((good) => (
              <li key={good.id}>
                {/* One row that wraps. The note is a single element rather
                    than one copy per breakpoint, so a screen reader reads it
                    once. Below sm it wraps under the name and the separator
                    goes with it. */}
                <a
                  href={good.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-11 flex-wrap items-center gap-x-2.5 gap-y-0.5 text-sm no-underline sm:min-h-0"
                >
                  <span className="flex items-center gap-2.5">
                    <GoodIcon
                      id={good.id}
                      name={good.name}
                      inlineIcon={good.inlineIcon}
                    />
                    <span className="text-text group-hover:text-text-muted transition-colors">
                      {good.name}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-text-dim hidden sm:inline"
                  >
                    ·
                  </span>

                  <span className="text-text-muted hidden leading-6 sm:inline">
                    {good.note}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
