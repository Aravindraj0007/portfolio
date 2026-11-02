import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { icons } from "./icons";

const { ArrowUpRight, Github, X } = icons;

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ProjectModal({ project, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!project) return;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      // Keep keyboard focus inside the dialog while it's open.
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(FOCUSABLE);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          key={project.slug}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-line bg-surface shadow-xl sm:rounded-2xl"
            initial={{ y: 40, opacity: 0, rotateX: 12, transformPerspective: 1200 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 40, opacity: 0, rotateX: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-line bg-surface/95 px-6 py-4 backdrop-blur sm:px-8">
              <p className="section-label">Case study</p>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="focus-ring -mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition hover:bg-line/60 hover:text-ink"
                aria-label="Close case study"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 pb-8 pt-6 sm:px-8">
              <p className="font-mono text-xs font-medium text-accent">{project.category}</p>
              <h2 id="case-study-title" className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {project.title}
              </h2>
              <p className="mt-1 text-ink-muted">{project.subtitle}</p>
              {project.caseStudy.context ? (
                <p className="mt-4 text-sm text-ink-soft">{project.caseStudy.context}</p>
              ) : null}

              <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {project.outcomes.map((outcome) => (
                  <div key={outcome} className="rounded-lg border border-line bg-paper px-3.5 py-3">
                    <dt className="sr-only">Highlight</dt>
                    <dd className="text-sm font-medium text-ink">{outcome}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 space-y-7">
                <section>
                  <h3 className="section-label">The problem</h3>
                  <p className="mt-2 leading-7 text-ink-soft">{project.caseStudy.problem}</p>
                </section>

                <section>
                  <h3 className="section-label">What I built</h3>
                  <ul className="mt-3 space-y-2.5">
                    {project.caseStudy.approach.map((step) => (
                      <li key={step} className="flex gap-3 leading-7 text-ink-soft">
                        <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="section-label">Result</h3>
                  <p className="mt-2 leading-7 text-ink-soft">{project.caseStudy.result}</p>
                </section>

                <section>
                  <h3 className="section-label">Stack</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="mt-9 flex flex-wrap gap-3 border-t border-line pt-6">
                <a href={project.github} target="_blank" rel="noreferrer" className="btn-primary">
                  <Github size={16} />
                  View source on GitHub
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default ProjectModal;
