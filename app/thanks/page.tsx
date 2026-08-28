import type { Metadata } from "next";
import Stripe from "stripe";

import styles from "@/app/components/layout.module.css";
import { createDownloadToken, LINK_TTL_SECONDS } from "@/app/lib/download";
import { requireEnv } from "@/app/lib/env";
import { pack } from "@/app/skills";

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

export default async function Thanks({ searchParams }: PageProps<"/thanks">) {
  const params = await searchParams;
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : undefined;

  const outcome = await resolve(sessionId);

  return (
    <div className={styles.column}>
      <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
        {outcome.state === "ready" ? "thanks" : "something went wrong"}
      </h1>

      {outcome.state === "ready" ? (
        <>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            payment received. {pack.packSize} skills, yours to keep and edit.
          </p>

          <div className="mt-8">
            <a
              href={outcome.href}
              className="inline-flex items-center rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white no-underline transition-colors hover:bg-orange-600"
            >
              download the pack
            </a>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              this link works for 24 hours. save the files somewhere you will
              find them again. updates go to the email you paid with, free, for
              as long as the pack exists.
            </p>
          </div>
        </>
      ) : (
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
      )}
    </div>
  );
}
