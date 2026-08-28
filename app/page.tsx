import { ShowcaseGrid } from "@/app/components/showcase-grid";
import { SkillsSection } from "@/app/components/skills-section";
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
      </section>

      <div className="mt-12">
        <ShowcaseGrid />
      </div>

      <div className="mt-32">
        <SkillsSection />
      </div>
    </div>
  );
}
