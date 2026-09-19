import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

import { EasingGuideBody } from "@/app/concepts/easing-guide";
import { IconMorphBody } from "@/app/concepts/icon-morph";
import { categories, conceptHref, findConcept } from "@/app/concepts";
import { siteConfig } from "@/app/site-config";
import styles from "@/app/components/layout.module.css";

/**
 * The written body for each concept, by id.
 *
 * Kept here rather than on the concept itself so app/concepts.ts stays plain
 * data and can be imported by the sidebar without dragging every article and
 * its demos into that bundle.
 */
const BODIES: Record<string, ComponentType> = {
  "icon-morph": IconMorphBody,
  "easing-guide": EasingGuideBody,
};

type Params = { category: string; concept: string };

export function generateStaticParams(): Params[] {
  return categories.flatMap((category) =>
    category.concepts.map((concept) => ({
      category: category.id,
      concept: concept.id,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, concept } = await params;
  const found = findConcept(category, concept);
  if (!found) return {};

  const url = `/${category}/${concept}`;

  return {
    title: found.concept.title,
    description: found.concept.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${found.concept.title} | ${siteConfig.title}`,
      description: found.concept.description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${found.concept.title} | ${siteConfig.title}`,
      description: found.concept.description,
    },
  };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, concept } = await params;
  const found = findConcept(category, concept);
  if (!found) notFound();

  const Body = BODIES[found.concept.id];

  // Article schema, so a concept can show as its own result rather than being
  // rolled into the site. The author block is what ties them together.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: found.concept.title,
    description: found.concept.description,
    url: `${siteConfig.url}${conceptHref(category, concept)}`,
    inLanguage: "en",
    isAccessibleForFree: true,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.href,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    articleSection: found.category.title,
  };

  return (
    <div className={styles.column}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Link
        href="/"
        className="group text-text-dim hover:text-text-muted -ml-1 inline-flex items-center gap-1.5 text-sm no-underline transition-colors"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5"
        >
          <path
            d="M9.5 3.5 5 8l4.5 4.5"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </Link>

      <h1 className="text-text mt-6 text-2xl font-medium tracking-tight">
        {found.concept.title}
      </h1>

      {Body ? (
        <Body />
      ) : (
        <p className="text-text-muted mt-4 text-sm leading-6">
          {found.concept.description} not written yet.
        </p>
      )}
    </div>
  );
}
