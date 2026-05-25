import { motion } from "framer-motion";
import { codingProfiles } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import { icons } from "./icons";

const { ArrowUpRight } = icons;

function CodingProfiles() {
  return (
    <section id="profiles" className="border-y border-white/10 bg-white/[0.025] py-24">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Coding Profiles"
          title="Where my code, practice, and professional presence live."
          description="Quick links to repositories, problem-solving profiles, and professional updates."
          align="center"
        />

        <div className="grid gap-5 md:grid-cols-3">
          {codingProfiles.map((profile, index) => {
            const Icon = icons[profile.icon];
            return (
              <motion.a
                key={profile.label}
                href={profile.url}
                target="_blank"
                rel="noreferrer"
                className="focus-ring glass-card group rounded-lg p-6 transition hover:-translate-y-1 hover:border-cyan-300/30"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-violet-300/25 bg-violet-300/10 text-violet-100">
                    <Icon size={23} />
                  </span>
                  <ArrowUpRight size={18} className="text-slate-400 transition group-hover:text-cyan-200" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{profile.label}</h3>
                <p className="mt-2 break-words text-sm text-slate-300">{profile.handle}</p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CodingProfiles;
