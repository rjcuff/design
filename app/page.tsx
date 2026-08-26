import { ShowcaseGrid } from "@/app/components/showcase-grid";
import { siteConfig } from "@/app/site-config";
import styles from "@/app/components/layout.module.css";

export default function Home() {
  return (
    <div className={styles.column}>
      <section id="introduction" className="scroll-mt-16">
        <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
          introduction
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          i&apos;m {siteConfig.author.name}, a design engineer. i like to build
          cool animatioons so take a peak into my mind.
        </p>

        <div className="mt-12">
          <ShowcaseGrid />
        </div>
      </section>

      <section id="contact" className="mt-32 scroll-mt-16">
        <h2 className="text-2xl font-medium tracking-tight text-neutral-900">
          contact
        </h2>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          get in touch about any of the components here.
        </p>

        <p className="mt-8 text-sm text-neutral-500">
          made by{" "}
          <a
            href={siteConfig.author.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 underline underline-offset-2"
          >
            {siteConfig.author.name}
          </a>
        </p>
      </section>
    </div>
  );
}
