import { motion } from "framer-motion";
import { achievements, personalInfo } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import { icons } from "./icons";

const focusAreas = [
  {
    title: "Computer Vision",
    text: "Gesture recognition, occupancy tracking, and image-based intelligence using modern CV workflows.",
    icon: "Camera",
  },
  {
    title: "Machine Learning",
    text: "Prediction systems, risk scoring, bottleneck detection, and measurable decision support.",
    icon: "BrainCircuit",
  },
  {
    title: "Automation",
    text: "Practical workflows with APIs, webhooks, real-time updates, and alerting pipelines.",
    icon: "Activity",
  },
];

function About() {
  return (
    <section id="about" className="py-24">
      <div className="section-shell">
        <SectionHeader
          eyebrow="About"
          title="Building AI that moves from prototype to practical use."
          description="A compact snapshot of my current direction, strengths, and engineering interests."
        />

        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4">
            <motion.div
              className="glass-card glow-line rounded-lg p-6 sm:p-7"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55 }}
            >
              <p className="text-lg leading-9 text-slate-200">{personalInfo.about}</p>
            </motion.div>

            {achievements.map((achievement) => {
              const Icon = icons[achievement.icon];
              return (
                <motion.article
                  key={achievement.title}
                  className="glass-card glow-line rounded-lg p-5 sm:p-6"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Achievement</p>
                  <div className="mt-4 flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-violet-300/25 bg-violet-300/10 text-violet-200">
                      <Icon size={21} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-white">{achievement.title}</h3>
                        <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                          {achievement.result}
                        </span>
                      </div>
                      <p className="mt-2 leading-7 text-slate-300">{achievement.description}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="grid gap-4">
            {focusAreas.map((area, index) => {
              const Icon = icons[area.icon];
              return (
                <motion.article
                  key={area.title}
                  className="glass-card rounded-lg p-6 transition hover:-translate-y-1 hover:border-cyan-300/35"
                  initial={{ opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
                      <Icon size={22} />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{area.title}</h3>
                      <p className="mt-2 leading-7 text-slate-300">{area.text}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
