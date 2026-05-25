import { motion } from "framer-motion";
import { education } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import { icons } from "./icons";

const { GraduationCap, MapPin } = icons;

function Education() {
  return (
    <section id="education" className="py-24">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Education"
          title="Academic foundation in AI and data science."
          description="Currently building a strong technical base while applying it through projects, hackathons, and innovation center work."
        />

        <div className="grid gap-6">
          {education.map((item, index) => (
            <motion.article
              key={item.degree}
              className="glass-card glow-line rounded-lg p-7 sm:p-8"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-blue-300/25 bg-blue-300/10 text-blue-100">
                    <GraduationCap size={26} />
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{item.degree}</h3>
                    <p className="mt-3 flex items-center gap-2 leading-7 text-slate-300">
                      <MapPin size={18} className="shrink-0 text-cyan-300" />
                      {item.institution}
                    </p>
                    <p className="mt-4 max-w-3xl leading-8 text-slate-400">{item.focus}</p>
                  </div>
                </div>
                <div className="w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100">
                  {item.period}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;
