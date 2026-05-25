import { motion } from "framer-motion";
import { projects } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import { icons } from "./icons";

const { ArrowUpRight, Github } = icons;

function Projects() {
  return (
    <section id="projects" className="py-24">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Projects"
          title="AI, automation, and full-stack work with real-world shape."
          description="Each project is organized around a practical problem, a concrete stack, and a working implementation path."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => {
            const Icon = icons[project.icon];
            return (
              <motion.article
                key={project.title}
                className="glass-card glow-line group flex min-h-full flex-col rounded-lg p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 sm:p-7"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                    <Icon size={23} />
                  </span>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
                    aria-label={`Open ${project.title} on GitHub`}
                  >
                    <Github size={19} />
                  </a>
                </div>

                <h3 className="mt-6 text-2xl font-bold leading-8 text-white">{project.title}</h3>
                <p className="mt-4 flex-1 leading-8 text-slate-300">{project.description}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {project.outcomes.map((outcome) => (
                    <div key={outcome} className="rounded-lg border border-white/10 bg-night-900/70 p-3">
                      <p className="text-sm font-semibold text-cyan-100">{outcome}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-violet-300/30 bg-violet-300/10 px-4 py-2 text-sm font-semibold text-violet-100 transition hover:border-violet-200 hover:bg-violet-300/20"
                >
                  View Repository
                  <ArrowUpRight size={16} />
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Projects;
