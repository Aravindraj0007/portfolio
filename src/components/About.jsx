import { motion } from "framer-motion";
import { highlights, personalInfo } from "../data/portfolio";
import { reveal3d } from "../motion";
import CodeBlock, { CodeWindow } from "./CodeBlock";
import SectionHeader from "./SectionHeader";
import TiltCard from "./TiltCard";
import { icons } from "./icons";

const PROFILE_CODE = `class Aravindraj(Engineer):
    role   = "${personalInfo.role}"
    base   = "${personalInfo.location}"
    focus  = ["AI agents", "RAG", "computer vision"]
    status = "${personalInfo.availability.toLowerCase()}"

    def ship(self, idea):
        # data -> model -> product -> production
        return deploy(build(train(collect(idea))))`;

function About() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeader index="01" label="About" title="An AI engineer who builds end to end." />

        <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
          <motion.div className="glass min-w-0 space-y-5 rounded-2xl p-6 text-[17px] leading-8 text-ink-soft sm:p-8" {...reveal3d()}>
            {personalInfo.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>

          <div className="flex min-w-0 flex-col gap-4">
            <motion.div {...reveal3d(0.1)}>
              <TiltCard as="div" className="rounded-xl">
                <CodeWindow filename="aravindraj.py">
                  <CodeBlock code={PROFILE_CODE} className="p-4 text-[11.5px] sm:text-[12.5px]" />
                </CodeWindow>
              </TiltCard>
            </motion.div>

            <motion.ul className="flex flex-col gap-3" {...reveal3d(0.15)}>
              {highlights.map((highlight) => {
                const Icon = icons[highlight.icon];
                return (
                  <li key={highlight.title} className="glass flex items-center gap-4 rounded-xl p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-medium leading-6 text-ink">{highlight.title}</p>
                      <p className="mt-0.5 text-sm text-ink-muted">{highlight.detail}</p>
                    </div>
                  </li>
                );
              })}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
