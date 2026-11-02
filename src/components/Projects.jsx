import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { projects } from "../data/portfolio";
import { reveal3d } from "../motion";
import ProjectModal from "./ProjectModal";
import SectionHeader from "./SectionHeader";
import TiltCard from "./TiltCard";
import { icons } from "./icons";

const { ArrowRight, Github } = icons;

function Projects() {
  const [activeSlug, setActiveSlug] = useState(null);
  const activeProject = projects.find((project) => project.slug === activeSlug) ?? null;
  const closeModal = useCallback(() => setActiveSlug(null), []);

  return (
    <section id="work" className="border-t border-line py-20 sm:py-24">
      <div className="section-shell">
        <SectionHeader
          index="01"
          label="Selected work"
          title="Projects that take AI from model to working product."
          description="Each one pairs a model or automation with the backend and interface around it. Open a case study for the problem, approach and result."
        />

        <ol className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.li key={project.slug} className="flex" {...reveal3d((index % 2) * 0.1)}>
              <TiltCard className="flex w-full flex-col rounded-2xl border border-line bg-surface/90 p-6 transition-colors hover:border-accent/50 sm:p-7">
                <div className="flex items-center justify-between gap-4 [transform:translateZ(20px)]">
                  <p className="section-label">{project.category}</p>
                  <span className="font-mono text-sm text-ink-muted">{String(index + 1).padStart(2, "0")}</span>
                </div>

                <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink [transform:translateZ(40px)] sm:text-2xl">
                  <button
                    type="button"
                    onClick={() => setActiveSlug(project.slug)}
                    className="focus-ring rounded text-left transition hover:text-accent"
                  >
                    {project.title}
                  </button>
                </h3>
                <p className="mt-2 flex-1 leading-7 text-ink-soft [transform:translateZ(25px)]">{project.summary}</p>

                <ul className="mt-5 flex flex-wrap gap-1.5 [transform:translateZ(25px)]" aria-label="Tech stack">
                  {project.techStack.map((tech) => (
                    <li key={tech} className="chip">
                      {tech}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2 [transform:translateZ(35px)]">
                  <button type="button" onClick={() => setActiveSlug(project.slug)} className="btn-primary group/btn px-4 py-2">
                    Case study
                    <ArrowRight size={15} className="transition group-hover/btn:translate-x-0.5" />
                  </button>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary px-4 py-2"
                    aria-label={`${project.title} source code on GitHub`}
                  >
                    <Github size={15} />
                    Code
                  </a>
                </div>
              </TiltCard>
            </motion.li>
          ))}
        </ol>
      </div>

      <ProjectModal project={activeProject} onClose={closeModal} />
    </section>
  );
}

export default Projects;
