import { featuredSkills, pack } from "@/app/skills";
import { BuyButton } from "./buy-button";
import styles from "./skills-section.module.css";

export function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-16">
      <h2 className="text-text text-2xl font-medium tracking-tight">skills</h2>
      <p className="text-text-muted mt-3 text-sm leading-6">
        everything i worked out building the components above, written down as
        skills an agent can read. motion, interface detail, component apis, and
        shipping a page that looks paid for. {pack.packSize} in the full pack, a
        sneak peek at 3 below.
      </p>

      <div className="mt-6 space-y-6">
        {featuredSkills.map((skill) => (
          <div key={skill.id}>
            <p className="text-text text-sm font-medium">{skill.name}</p>
            <p
              className={`${styles.description} text-text-muted mt-1.5 text-sm leading-6`}
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
