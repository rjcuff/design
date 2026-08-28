import type { Metadata } from "next";
import Stripe from "stripe";

import styles from "@/app/components/layout.module.css";
import { createDownloadToken, LINK_TTL_SECONDS } from "@/app/lib/download";
import { requireEnv } from "@/app/lib/env";
import { pack } from "@/app/skills";
import { DownloadButton } from "./download-button";
import thanks from "./thanks.module.css";

/**
 * Post-payment landing page.
 *
 * Stripe redirects here with the checkout session id, and this page asks
 * Stripe directly whether that session was paid before minting a download
 * link. The session id is unguessable and the payment is verified server
 * side, so there is nothing to forge.
 *
 * The one hole is a buyer sharing this url, which would let anyone mint fresh
 * links indefinitely. Refusing sessions older than the link lifetime closes
 * it: after a day the page stops working for everybody, buyer included.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "thanks",
  // Nothing here should ever appear in a search result.
  robots: { index: false, follow: false },
};

type Outcome =
  | { state: "ready"; href: string }
  | { state: "no-session" }
  | { state: "unpaid" }
  | { state: "stale" }
  | { state: "error" };

async function resolve(sessionId: string | undefined): Promise<Outcome> {
  if (!sessionId) return { state: "no-session" };

  try {
    const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") return { state: "unpaid" };

    const age = Math.floor(Date.now() / 1000) - session.created;
    if (age > LINK_TTL_SECONDS) return { state: "stale" };

    return {
      state: "ready",
      href: `/api/download?token=${createDownloadToken(session.id)}`,
    };
  } catch (error) {
    console.error("[thanks] could not resolve session", error);
    return { state: "error" };
  }
}

function Detail({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="text-sm text-neutral-500">{term}</dt>
      <dd className="text-sm text-neutral-900 tabular-nums">{value}</dd>
    </div>
  );
}

export default async function Thanks({ searchParams }: PageProps<"/thanks">) {
  const params = await searchParams;
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : undefined;

  const outcome = await resolve(sessionId);

  if (outcome.state !== "ready") {
    return (
      <div className={styles.column}>
        <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
          something went wrong
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          {outcome.state === "stale"
            ? "this page has expired. it stays open for 24 hours after a purchase."
            : outcome.state === "unpaid"
              ? "this payment has not completed yet. if your card went through, give it a minute and reload."
              : "i could not find that purchase."}{" "}
          email{" "}
          <a
            href="mailto:ryan.cuff@icloud.com"
            className="text-neutral-900 transition-colors hover:text-neutral-500"
          >
            ryan.cuff@icloud.com
          </a>{" "}
          and i will send your download by hand.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.column}>
      <h1
        className={`${thanks.rise} text-2xl font-medium tracking-tight text-neutral-900`}
      >
        thanks
      </h1>

      <p
        className={`${thanks.rise} mt-3 text-sm leading-6 text-neutral-500`}
        style={{ animationDelay: "60ms" }}
      >
        payment received. the pack is yours to keep and edit, on anything you
        build.
      </p>

      <div
        className={`${thanks.rise} mt-10 rounded-lg border border-stone-100 bg-stone-50 p-6`}
        style={{ animationDelay: "120ms" }}
      >
        <p className="text-sm font-medium text-neutral-900">{pack.name}</p>

        <dl className="mt-4 divide-y divide-stone-200/70 border-y border-stone-200/70">
          <Detail term="skills" value={String(pack.packSize)} />
          <Detail term="version" value="1.0.0" />
          <Detail term="format" value="markdown" />
        </dl>

        <div className="mt-6">
          <DownloadButton href={outcome.href} />
        </div>
      </div>

      <p
        className={`${thanks.rise} mt-6 text-sm leading-6 text-neutral-500`}
        style={{ animationDelay: "180ms" }}
      >
        updates are free for as long as the pack exists, and go to the email you
        paid with. anything wrong, email{" "}
        <a
          href="mailto:ryan.cuff@icloud.com"
          className="text-neutral-900 transition-colors hover:text-neutral-500"
        >
          ryan.cuff@icloud.com
        </a>{" "}
        and i will sort it.
      </p>
    </div>
  );
}
