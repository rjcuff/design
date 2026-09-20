import { RepoCard } from "@/app/components/repo-card";
import { siteConfig } from "@/app/site-config";
import styles from "@/app/components/layout.module.css";

export default function Home() {
  return (
    <div className={styles.column}>
      <section id="introduction" className="scroll-mt-20">
        <h1 className="text-text text-2xl font-medium tracking-tight">Intro</h1>

        <p className="text-text-muted mt-3 text-sm leading-6">
          A set of design engineering concepts, one idea at a time. Each one
          gets worked out by building it rather than reading about it, and
          written down short enough to borrow from.
        </p>

        <p className="text-text-muted mt-4 text-sm leading-6">
          Written by {siteConfig.author.name}, a design engineer. I like finding
          out why an interface feels the way it does.
        </p>

        <p className="text-text-muted mt-6 text-sm leading-6">
          The source is public. Corrections and additions are welcome.
        </p>

        <div className="mt-4">
          <RepoCard repo={siteConfig.repo.label} href={siteConfig.repo.href} />
        </div>

        <p className="text-text-dim mt-6 text-sm leading-6">
          Anything listed without a demo is planned, not finished. It is here so
          you can see what is coming.
        </p>
      </section>

      <section id="ease-ui" className="mt-20 scroll-mt-20">
        <h2 className="text-text text-base font-medium">Ease UI</h2>

        <p className="text-text-muted mt-3 text-sm leading-6">
          Most of this work ends up in Ease UI, a component library for React.
          These concepts are the step behind it, showing how a piece got built,
          what it took to get right, and what I threw away first.
        </p>

        <div className="mt-4">
          <a
            href="https://easeui.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="group border-line bg-surface hover:bg-surface-hover flex items-center justify-between gap-4 rounded-xl border px-4 py-3 no-underline transition-colors"
          >
            <span className="text-text flex items-center gap-3 text-sm">
              {/* easeUI's own mark, a flat-top regular octagon. */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="size-5 shrink-0"
              >
                <polygon
                  points="8.27,3 15.73,3 21,8.27 21,15.73 15.73,21 8.27,21 3,15.73 3,8.27"
                  stroke="currentColor"
                  strokeWidth={3.5}
                  strokeLinejoin="round"
                />
              </svg>
              easeui.dev
            </span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="text-text-dim group-hover:text-text-muted size-4 shrink-0 transition-colors"
            >
              <path
                d="M7 17 17 7M17 7H9M17 7v8"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
