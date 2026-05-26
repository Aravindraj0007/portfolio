import { motion } from "framer-motion";
import { achievements } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import { icons } from "./icons";

function Achievements() {
  return (
    <section id="achievements" className="border-y border-white/10 bg-white/[0.025] py-24">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Achievements"
          title="Recognition and selected memberships."
          description="A few milestones from my resume that reflect practical AI/ML involvement and competitive project work."
          align="center"
        />

        <div className="grid gap-5 md:grid-cols-2">
          {achievements.map((achievement, index) => {
            const Icon = icons[achievement.icon];
            return (
              <motion.article
                key={achievement.title}
                className="glass-card glow-line rounded-lg p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 sm:p-7"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.24 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                    <Icon size={23} />
                  </span>
                  <span className="rounded-full border border-violet-300/30 bg-violet-300/10 px-4 py-2 text-sm font-bold text-violet-100">
                    {achievement.result}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold leading-8 text-white">{achievement.title}</h3>
                <p className="mt-4 leading-8 text-slate-300">{achievement.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Achievements;
