import { featuredSkills, pack } from "@/app/skills";
import { BuyButton } from "./buy-button";
import styles from "./skills-section.module.css";

export function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-16">
      <h2 className="text-2xl font-medium tracking-tight text-neutral-900">
        skills
      </h2>
      <p className="mt-3 text-sm leading-6 text-neutral-500">
        everything i worked out building the components above, written down as
        skills an agent can read. motion, interface detail, component apis, and
        shipping a page that looks paid for. {pack.packSize} in the full pack, a
        sneak peek at 3 below.
      </p>

      <div className="mt-6 space-y-6">
        {featuredSkills.map((skill) => (
          <div key={skill.id}>
            <p className="text-sm font-medium text-neutral-900">{skill.name}</p>
            <p
              className={`${styles.description} mt-1.5 text-sm leading-6 text-neutral-500`}
            >
              {skill.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <BuyButton />
      </div>
    </section>
  );
}
