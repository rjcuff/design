import { ShowcaseGrid } from "@/app/components/showcase-grid";
import { siteConfig, socialLinks } from "@/app/site-config";
import styles from "@/app/components/layout.module.css";

export default function Home() {
  return (
    <div className={styles.column}>
      <section id="introduction" className="scroll-mt-16">
        <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
          introduction
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          i&apos;m {siteConfig.author.name}, a design engineer. this is where i
          pull interfaces apart and put them back together one animation at a
          time, working out why something feels right rather than whether it
          merely works.
        </p>
        <p className="mt-4 text-sm leading-6 text-neutral-500">
          every card below started as a rough idea and got rebuilt until the
          timing sat properly. i write down what i got wrong along the way, so
          none of it arrives finished. learn along with me.
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

        <ul className="mt-6 space-y-2">
          {socialLinks.map((link) => (
            <li key={link.label} className="text-sm">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 underline underline-offset-2"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

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
