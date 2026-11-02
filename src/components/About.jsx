import { motion } from "framer-motion";
import { highlights, personalInfo } from "../data/portfolio";
import { reveal3d } from "../motion";
import SectionHeader from "./SectionHeader";
import { icons } from "./icons";

function About() {
  return (
    <section id="about" className="border-t border-line py-20 sm:py-24">
      <div className="section-shell">
        <SectionHeader index="02" label="About" title="An AI engineer who builds end to end." />

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <motion.div className="space-y-5 text-[17px] leading-8 text-ink-soft" {...reveal3d()}>
            {personalInfo.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>

          <motion.ul className="flex flex-col gap-3" {...reveal3d(0.1)}>
            {highlights.map((highlight) => {
              const Icon = icons[highlight.icon];
              return (
                <li key={highlight.title} className="flex flex-1 items-center gap-4 rounded-xl border border-line bg-surface/90 p-5">
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
    </section>
  );
}

export default About;
