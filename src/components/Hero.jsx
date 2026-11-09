import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import profileImage from "../assets/profile.jpg";
import { personalInfo, services, socialLinks } from "../data/portfolio";
import TiltCard from "./TiltCard";
import { icons } from "./icons";

const { ArrowRight, FileText, MapPin } = icons;

// Types each focus area out, holds it, deletes it, then moves to the next.
function TypedFocus({ words }) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const word = words[index];

  useEffect(() => {
    if (reducedMotion) return undefined;
    let delay = deleting ? 40 : 85;
    if (!deleting && length === word.length) delay = 1600;
    const id = window.setTimeout(() => {
      if (!deleting && length === word.length) setDeleting(true);
      else if (deleting && length === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else setLength((n) => n + (deleting ? -1 : 1));
    }, delay);
    return () => window.clearTimeout(id);
  }, [deleting, length, word, words.length, reducedMotion]);

  return (
    <span aria-label={`Building ${words.join(", ")}`}>
      <span aria-hidden="true">
        <span className="text-ink-muted">&gt; building:</span> {reducedMotion ? word : word.slice(0, length)}
        <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-accent motion-reduce:animate-none" />
      </span>
    </span>
  );
}

const ease = [0.22, 1, 0.36, 1];
const rise = (delay) => ({
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, delay, ease } },
});

// The portrait sits inside the background particle cube; MorphField tracks #hero-portrait to keep them aligned.
function Portrait({ ready }) {
  return (
    <motion.figure
      id="hero-portrait"
      className="relative mx-auto w-56 sm:w-64 lg:w-[17rem]"
      initial={{ opacity: 0, scale: 0.88, rotateY: -25, transformPerspective: 1200 }}
      animate={ready ? { opacity: 1, scale: 1, rotateY: 0 } : undefined}
      transition={{ duration: 1.1, ease, delay: 0.3 }}
    >
      <TiltCard as="div" className="rounded-2xl">
        <div className="relative overflow-hidden rounded-2xl border border-accent/30 shadow-[0_0_60px_-10px_rgb(var(--accent)/0.55)]">
          <img
            src={profileImage}
            alt={`Portrait of ${personalInfo.name}`}
            className="aspect-[4/5] w-full object-cover object-[center_30%]"
          />
          {/* One AR scan pass over the photo as the hero appears. */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-accent/25 to-transparent"
            initial={{ top: "-15%", opacity: 0 }}
            animate={ready ? { top: "105%", opacity: [0, 1, 1, 0] } : undefined}
            transition={{ duration: 1.6, ease: "easeInOut", delay: 1 }}
          />
        </div>

        {/* AR targeting corners, floating above the photo in 3D */}
        <div aria-hidden="true" className="pointer-events-none absolute -inset-3 [transform:translateZ(30px)]">
          <span className="absolute left-0 top-0 h-7 w-7 rounded-tl-lg border-l-2 border-t-2 border-accent" />
          <span className="absolute right-0 top-0 h-7 w-7 rounded-tr-lg border-r-2 border-t-2 border-accent" />
          <span className="absolute bottom-0 left-0 h-7 w-7 rounded-bl-lg border-b-2 border-l-2 border-accent" />
          <span className="absolute bottom-0 right-0 h-7 w-7 rounded-br-lg border-b-2 border-r-2 border-accent" />
        </div>

        <figcaption className="absolute -bottom-4 left-1/2 flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface/90 px-3.5 py-1.5 font-mono text-[11px] text-ink-soft shadow-lg backdrop-blur [transform:translateX(-50%)_translateZ(50px)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          ID verified · {personalInfo.role}
        </figcaption>
      </TiltCard>
    </motion.figure>
  );
}

// Full-screen hero: intro text on the left, the portrait inside the particle cube on the right,
// and four glass cards along the bottom. `ready` holds the entrance animation until the intro has finished.
function Hero({ ready = true }) {
  const state = ready ? "show" : "hidden";

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col pt-24 sm:pt-28">
      <div className="section-shell flex flex-1 flex-col">
        <div className="grid flex-1 items-center gap-14 pb-14 lg:grid-cols-[1fr_auto] lg:gap-16 lg:pr-12">
          <motion.div initial="hidden" animate={state} className="min-w-0">
            <motion.div variants={rise(0)} className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-700 backdrop-blur dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {personalInfo.availability}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} aria-hidden="true" />
                {personalInfo.location}
              </span>
            </motion.div>

            <motion.h1
              variants={rise(0.1)}
              className="mt-7 font-display text-[2.9rem] font-light leading-[0.98] tracking-[-0.04em] text-ink sm:text-7xl lg:text-[5.4rem]"
            >
              Intelligence
              <br />
              <span className="text-ink-soft">that ships.</span>
            </motion.h1>

            <motion.p variants={rise(0.2)} className="mt-6 font-mono text-sm font-medium text-accent">
              {personalInfo.name} · {personalInfo.role}
            </motion.p>
            <motion.p variants={rise(0.25)} className="mt-1.5 h-5 font-mono text-sm text-ink">
              <TypedFocus words={personalInfo.focusAreas} />
            </motion.p>

            <motion.p variants={rise(0.3)} className="mt-6 max-w-xl text-base leading-7 text-ink-soft sm:text-[17px]">
              {personalInfo.headline}
            </motion.p>

            <motion.div variants={rise(0.4)} className="mt-8 flex flex-wrap gap-3">
              <a href="#work" className="btn-accent group">
                See my work
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </a>
              <a href={personalInfo.resumePath} target="_blank" rel="noreferrer" className="btn-secondary">
                <FileText size={16} />
                Resume
              </a>
            </motion.div>
            <motion.ul variants={rise(0.5)} className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {socialLinks.map((link) => {
                const Icon = icons[link.icon];
                return (
                  <li key={link.label}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring inline-flex items-center gap-2 rounded font-medium text-ink-soft transition hover:text-ink"
                    >
                      <Icon size={16} aria-hidden="true" />
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </motion.ul>
          </motion.div>

          <Portrait ready={ready} />
        </div>

        <ol className="grid gap-3 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.li
              key={service.title}
              className="flex"
              initial={{ opacity: 0, y: 50, rotateX: 25, transformPerspective: 1000 }}
              animate={ready ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
              transition={{ duration: 0.9, delay: 0.55 + index * 0.1, ease }}
            >
              <TiltCard as="div" className="glass flex min-h-[8.5rem] w-full sm:min-h-[11.5rem] flex-col rounded-2xl p-5 transition-colors hover:border-accent/50">
                <span className="self-end font-mono text-sm text-ink-muted [transform:translateZ(20px)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-auto text-[17px] font-semibold leading-snug text-ink [transform:translateZ(35px)]">{service.title}</h2>
                <p className="mt-2 text-[13px] leading-5 text-ink-soft [transform:translateZ(25px)]">{service.text}</p>
              </TiltCard>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Hero;
