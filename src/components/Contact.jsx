import { motion } from "framer-motion";
import { contactLinks, personalInfo } from "../data/portfolio";
import SectionHeader from "./SectionHeader";
import { icons } from "./icons";

const { ArrowUpRight, Mail } = icons;

function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader
            eyebrow="Contact"
            title="Open to AI/ML collaboration, internships, and project discussions."
            description="No backend form here, just direct links that make it easy to reach me."
          />

          <motion.div
            className="glass-card glow-line rounded-lg p-6 sm:p-8"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                <Mail size={23} />
              </span>
              <div>
                <p className="text-sm text-slate-400">Primary email</p>
                <a href={`mailto:${personalInfo.email}`} className="focus-ring rounded break-all text-lg font-bold text-white hover:text-cyan-200 sm:break-normal">
                  {personalInfo.email}
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {contactLinks.map((link, index) => {
                const Icon = icons[link.icon];
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    className="focus-ring group rounded-lg border border-white/10 bg-white/[0.045] p-4 transition hover:border-cyan-300/35 hover:bg-white/[0.07]"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-night-900/80 text-cyan-200">
                        <Icon size={19} />
                      </span>
                      <ArrowUpRight size={17} className="shrink-0 text-slate-500 transition group-hover:text-cyan-200" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-400">{link.label}</p>
                    <p className="mt-1 break-words text-sm font-medium text-white">{link.value}</p>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
