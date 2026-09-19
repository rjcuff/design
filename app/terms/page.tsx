import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/app/components/layout.module.css";
import { pack } from "@/app/skills";
import { siteConfig } from "@/app/site-config";

export const metadata: Metadata = {
  title: "terms",
  description: "what you are buying, how it arrives, and how refunds work.",
  alternates: { canonical: "/terms" },
};

const CONTACT = "ryan.cuff@icloud.com";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-text text-sm font-medium">{title}</h2>
      <div className="text-text-muted mt-2 space-y-3 text-sm leading-6">
        {children}
      </div>
    </section>
  );
}

function Mail() {
  return (
    <a
      href={`mailto:${CONTACT}`}
      className="text-text hover:text-text-muted transition-colors"
    >
      {CONTACT}
    </a>
  );
}

export default function Terms() {
  return (
    <div className={styles.column}>
      <h1 className="text-text text-2xl font-medium tracking-tight">
        terms of purchase
      </h1>
      <p className="text-text-muted mt-3 text-sm leading-6">
        for {pack.name}, the skills pack sold on this site. last updated 27
        august 2026.
      </p>

      <Section title="what you are buying">
        <p>
          a digital download of {pack.packSize} markdown files, one per skill,
          plus a readme, a changelog and a license. no physical goods, no
          account, no subscription. one payment of {pack.price}.
        </p>
        <p>
          the files are written for claude code and read as plain markdown
          anywhere else. the readme says where they go. they are documents, not
          software, and they do not run or install anything.
        </p>
      </Section>

      <Section title="how it arrives">
        <p>
          immediately. paying returns you to a page on this site with a download
          link on it. the link is good for 24 hours, so save the files somewhere
          you will find them again.
        </p>
        <p>
          if the download fails, the link expires before you use it, or anything
          else goes wrong, email <Mail /> and i will send it by hand. you paid,
          so you get the files.
        </p>
      </Section>

      <Section title="what you may do with them">
        <p>
          use them on unlimited personal and commercial projects, edit them,
          adapt them, and use them inside a company you work for. one purchase
          covers you and your employer on everything you build.
        </p>
        <p>
          you may not resell or redistribute them, publish them anywhere people
          who have not bought them can download them, or include them in
          something you sell or give away. the full license ships in the
          download.
        </p>
      </Section>

      <Section title="refunds">
        <p>
          <span className="text-text">3 days from purchase.</span> email{" "}
          <Mail /> within that window and say you want a refund. after 3 days
          the sale is final.
        </p>
        <p>
          the window is short because this is a digital file that cannot be
          returned, and 3 days is long enough to read a skill or two and know
          whether the writing is for you. read the three on the home page before
          you buy. they are a fair sample of the rest.
        </p>
        <p>
          if you are in the uk or eu, you have a statutory right to cancel
          digital content within 14 days, which you give up by starting the
          download. you start it on the page you land on after paying. where
          local law gives you a right the policy above does not, the law wins.
        </p>
      </Section>

      <Section title="updates">
        <p>
          free, for as long as the pack exists. i improve these as i learn more,
          and updates go to the email you paid with. the changelog in the
          download says what moved in each one.
        </p>
        <p>
          there is no promised schedule. some months there will be nothing. this
          is not a subscription and you are never billed again.
        </p>
      </Section>

      <Section title="payment">
        <p>
          payments are processed by stripe. card details go to stripe and never
          to this site, and i never see them. stripe holds the email address you
          pay with, which is how updates and any refund reach you.
        </p>
        <p>
          prices are in us dollars. your bank may add a conversion fee, which is
          between you and them.
        </p>
      </Section>

      <Section title="no warranty">
        <p>
          these are notes on how to build interfaces, written from what has
          worked for me. they are opinions backed by reasoning, not guarantees.
          nothing here is professional advice and i am not liable for what you
          build with it.
        </p>
      </Section>

      <Section title="questions">
        <p>
          email <Mail />. anything about the pack, a refund, an invoice, or a
          link that stopped working.
        </p>
      </Section>

      <p className="text-text-dim mt-12 text-sm">
        <Link
          href="/"
          className="text-text-muted hover:text-text transition-colors"
        >
          back to {siteConfig.title}
        </Link>
      </p>
    </div>
  );
}
