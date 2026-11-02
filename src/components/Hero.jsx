import { motion } from "framer-motion";
import profileImage from "../assets/profile.jpg";
import { personalInfo, socialLinks } from "../data/portfolio";
import TiltCard from "./TiltCard";
import { icons } from "./icons";

const { ArrowRight, FileText, MapPin } = icons;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// `ready` holds the entrance animation until the intro has finished.
function Hero({ ready = true }) {
  const state = ready ? "show" : "hidden";

  return (
    <section id="top" className="pt-16">
      <div className="section-shell grid items-center gap-8 py-14 sm:py-20 md:grid-cols-[1fr_auto] lg:py-24">
        <motion.div variants={container} initial="hidden" animate={state} className="max-w-2xl">
          <motion.div variants={item} className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              {personalInfo.availability}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} aria-hidden="true" />
              {personalInfo.location}
            </span>
          </motion.div>

          <motion.p variants={item} className="mt-8 font-mono text-sm font-medium text-accent">
            {personalInfo.name} · {personalInfo.role}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]"
          >
            {personalInfo.headline}
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
            {personalInfo.heroText}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <a href="#work" className="btn-primary group">
              See my work
              <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </a>
            <a href={personalInfo.resumePath} target="_blank" rel="noreferrer" className="btn-secondary">
              <FileText size={16} />
              Resume
            </a>
          </motion.div>

          <motion.ul variants={item} className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm">
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

        <motion.figure
          className="relative mx-auto w-60 sm:w-64 md:w-72 lg:w-80"
          initial={{ opacity: 0, scale: 0.88, rotateY: -25, transformPerspective: 1200 }}
          animate={ready ? { opacity: 1, scale: 1, rotateY: 0 } : undefined}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <TiltCard as="div" className="rounded-2xl">
            <div className="relative overflow-hidden rounded-2xl border border-line shadow-2xl shadow-accent/10">
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
                transition={{ duration: 1.6, ease: "easeInOut", delay: 0.9 }}
              />
            </div>

            {/* AR targeting corners, floating above the photo in 3D */}
            <div aria-hidden="true" className="pointer-events-none absolute -inset-3 [transform:translateZ(30px)]">
              <span className="absolute left-0 top-0 h-7 w-7 rounded-tl-lg border-l-2 border-t-2 border-accent" />
              <span className="absolute right-0 top-0 h-7 w-7 rounded-tr-lg border-r-2 border-t-2 border-accent" />
              <span className="absolute bottom-0 left-0 h-7 w-7 rounded-bl-lg border-b-2 border-l-2 border-accent" />
              <span className="absolute bottom-0 right-0 h-7 w-7 rounded-br-lg border-b-2 border-r-2 border-accent" />
            </div>

            <figcaption className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface/90 px-3.5 py-1.5 font-mono text-[11px] text-ink-soft shadow-lg backdrop-blur [transform:translateZ(50px)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              ID verified · AI Engineer
            </figcaption>
          </TiltCard>
        </motion.figure>
      </div>
    </section>
  );
}

export default Hero;
