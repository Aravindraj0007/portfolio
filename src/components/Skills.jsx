import { motion } from "framer-motion";
import { skillGroups } from "../data/portfolio";
import { reveal3d } from "../motion";
import SectionHeader from "./SectionHeader";
import TiltCard from "./TiltCard";
import { icons } from "./icons";

const allSkills = [...new Set(skillGroups.flatMap((group) => group.items))];

function SkillChip({ skill, large = false }) {
  return (
    <li
      className={`rounded-lg border border-line bg-paper/60 font-medium text-ink-soft transition duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent hover:shadow-[0_0_18px_rgb(var(--accent)/0.25)] ${
        large ? "px-3.5 py-2 text-sm" : "px-3 py-1.5 text-[13px]"
      }`}
    >
      {skill}
    </li>
  );
}

function CardHeading({ group, large = false, showCount = true }) {
  const Icon = icons[group.icon];
  return (
    <div className="flex items-start justify-between gap-4 [transform:translateZ(30px)]">
      <div className="flex items-center gap-3">
        <span
          className={`flex shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent ring-1 ring-accent/20 ${
            large ? "h-12 w-12" : "h-10 w-10"
          }`}
        >
          <Icon size={large ? 24 : 19} aria-hidden="true" />
        </span>
        <h3 className={`font-semibold tracking-tight text-ink ${large ? "text-2xl" : "text-lg"}`}>{group.title}</h3>
      </div>
      {showCount ? <span className="font-mono text-xs text-ink-muted">{String(group.items.length).padStart(2, "0")}</span> : null}
    </div>
  );
}

// Infinite ticker of every skill; the list is rendered twice so the loop is seamless.
function SkillTicker() {
  return (
    <div
      className="group relative mb-10 overflow-hidden border-y border-line py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[...allSkills, ...allSkills].map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="flex items-center gap-10 pr-10 font-mono text-sm uppercase tracking-[0.15em] text-ink-muted"
          >
            {skill}
            <span className="h-1 w-1 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Skills() {
  const [featured, ...rest] = skillGroups;
  const strip = rest.pop();

  return (
    <section id="skills" className="border-t border-line py-20 sm:py-24">
      <div className="section-shell">
        <SectionHeader
          index="03"
          label="Skills"
          title="The stack I use to ship AI features."
          description="From AI agents and RAG to computer vision, APIs and real-time dashboards."
        />
      </div>

      <SkillTicker />

      <div className="section-shell">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <motion.div className="md:col-span-2 lg:col-span-1 lg:row-span-2" {...reveal3d()}>
            <TiltCard className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-accent/30 bg-surface/90 p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
              />
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent [transform:translateZ(20px)]">
                ● Core focus
              </p>
              <CardHeading group={featured} large />
              <p className="mt-4 leading-7 text-ink-soft [transform:translateZ(20px)]">{featured.description}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-8 [transform:translateZ(40px)]">
                {featured.items.map((skill) => (
                  <SkillChip key={skill} skill={skill} large />
                ))}
              </ul>
            </TiltCard>
          </motion.div>

          {rest.map((group, index) => (
            <motion.div key={group.title} {...reveal3d(0.08 * (index + 1))}>
              <TiltCard className="flex h-full flex-col rounded-2xl border border-line bg-surface/90 p-6 transition-colors hover:border-accent/40">
                <CardHeading group={group} />
                <p className="mt-3 text-sm leading-6 text-ink-muted [transform:translateZ(15px)]">{group.description}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-5 [transform:translateZ(30px)]">
                  {group.items.map((skill) => (
                    <SkillChip key={skill} skill={skill} />
                  ))}
                </ul>
              </TiltCard>
            </motion.div>
          ))}

          <motion.div className="md:col-span-2 lg:col-span-3" {...reveal3d(0.1)}>
            <TiltCard className="flex flex-col gap-4 rounded-2xl border border-line bg-surface/90 p-6 sm:flex-row sm:items-center sm:justify-between">
              <CardHeading group={strip} showCount={false} />
              <ul className="flex flex-wrap gap-2 [transform:translateZ(30px)]">
                {strip.items.map((skill) => (
                  <SkillChip key={skill} skill={skill} />
                ))}
              </ul>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
