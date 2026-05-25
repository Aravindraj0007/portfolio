import { motion } from "framer-motion";
import profileImage from "../assets/profile.jpg";
import { codingProfiles, personalInfo } from "../data/portfolio";
import { icons } from "./icons";

const { ArrowUpRight, Download, Github, Linkedin, Code2 } = icons;

const socialIcons = {
  GitHub: Github,
  LinkedIn: Linkedin,
  LeetCode: Code2,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-hero-lines pt-24">
      <div className="absolute inset-0 bg-grid bg-[length:44px_44px] opacity-40" />
      <div className="absolute inset-x-0 top-16 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />

      <div className="section-shell relative z-10 grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl">
          <motion.h1 variants={item} className="text-4xl font-black leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            {personalInfo.heroIntro}
            <span className="mt-3 block gradient-text">{personalInfo.heroTitle}</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-3xl text-lg leading-9 text-slate-200 sm:text-xl">
            {personalInfo.heroText}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#projects"
              className="focus-ring group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 via-blue-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-[1.02]"
            >
              View Projects
              <ArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={personalInfo.resumePath}
              download
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:border-cyan-300/60 hover:bg-white/15"
            >
              <Download size={18} />
              Download Resume
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            {codingProfiles.map((profile) => {
              const Icon = socialIcons[profile.label] || ArrowUpRight;
              return (
                <a
                  key={profile.label}
                  href={profile.url}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/45 hover:text-white"
                >
                  <Icon size={16} />
                  {profile.label}
                </a>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-[440px] lg:mr-0"
          initial={{ opacity: 0, scale: 0.92, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: 0.15 }}
        >
          <div className="glow-line relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-3 shadow-violetGlow backdrop-blur-xl">
            <div className="scan-line relative overflow-hidden rounded-lg">
              <img
                src={profileImage}
                alt="Aravindraj M"
                className="h-[360px] w-full object-cover object-center sm:h-[520px]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
