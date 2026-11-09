import { motion } from "framer-motion";
import { useState } from "react";
import { personalInfo, socialLinks } from "../data/portfolio";
import { reveal3d } from "../motion";
import SectionHeader from "./SectionHeader";
import { icons } from "./icons";

const { ArrowUpRight, CheckCircle2, Loader2, Mail, Send, TriangleAlert } = icons;

// Set VITE_FORMSPREE_ID (e.g. in Vercel env vars) to deliver messages through Formspree.
// Without it, the form falls back to opening the visitor's email client.
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;


function openMailClient(formData) {
  const name = formData.get("name")?.toString().trim() || "Portfolio visitor";
  const email = formData.get("email")?.toString().trim() || "";
  const message = formData.get("message")?.toString().trim() || "";
  const subject = encodeURIComponent(`Message from ${name} via portfolio`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
}

function Contact() {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!FORMSPREE_ID) {
      openMailClient(formData);
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="section-shell grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeader
            index="04"
            label="Contact"
            title="Let's build something useful."
            description="Hiring for an AI or ML engineering role, or have a project in mind? Send a message and I'll get back to you."
          />

          <a
            href={`mailto:${personalInfo.email}`}
            className="focus-ring inline-flex items-center gap-2.5 break-all rounded text-lg font-medium text-ink underline decoration-line decoration-2 underline-offset-4 transition hover:decoration-accent"
          >
            <Mail size={18} className="shrink-0 text-accent" aria-hidden="true" />
            {personalInfo.email}
          </a>

          <ul className="mt-8 space-y-3">
            {socialLinks.map((link) => {
              const Icon = icons[link.icon];
              return (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring group inline-flex items-center gap-3 rounded text-ink-soft transition hover:text-ink"
                  >
                    <Icon size={17} aria-hidden="true" />
                    <span className="font-medium">{link.label}</span>
                    <span className="text-sm text-ink-muted">{link.handle}</span>
                    <ArrowUpRight size={14} className="opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>

        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="self-start glass rounded-2xl p-6 sm:p-8 lg:sticky lg:top-24"
          {...reveal3d(0.1)}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-ink">Name</span>
              <input name="name" type="text" required autoComplete="name" placeholder="Your name" className="field" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="field"
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-medium text-ink">Message</span>
            <textarea
              name="message"
              required
              rows="5"
              placeholder="Tell me about the role or project..."
              className="field resize-y leading-7"
            />
          </label>

          {/* Honeypot field: hidden from people, filled in by bots, rejected by Formspree. */}
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="submit" className="btn-primary" disabled={status === "sending"}>
              {status === "sending" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send message
                  <Send size={15} />
                </>
              )}
            </button>

            <p role="status" aria-live="polite" className="text-sm">
              {status === "sent" ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 size={16} />
                  Thanks, your message was sent.
                </span>
              ) : null}
              {status === "error" ? (
                <span className="inline-flex items-center gap-1.5 text-red-700 dark:text-red-400">
                  <TriangleAlert size={16} />
                  Something went wrong. Please email me directly.
                </span>
              ) : null}
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

export default Contact;
