import { motion } from "framer-motion";
import { skillGroups } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import { icons } from "./icons";

function Skills() {
  return (
    <section id="skills" className="border-y border-white/10 bg-white/[0.025] py-24">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Skills"
          title="Technical stack for AI products and data-driven apps."
          description="A practical mix of programming, ML, computer vision, backend, database, automation, and frontend fundamentals."
          align="center"
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((group, index) => {
            const Icon = icons[group.icon];
            return (
              <motion.article
                key={group.title}
                className="glass-card glow-line rounded-lg p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-300/25 bg-blue-300/10 text-blue-100">
                    <Icon size={21} />
                  </span>
                  <h3 className="text-xl font-bold text-white">{group.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/35 hover:text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Skills;
