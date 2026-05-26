import { motion } from "framer-motion";
import { personalInfo } from "../data/portfolio";
import { icons } from "./icons";

const { Mail, MapPin, Send } = icons;

function Contact() {
  const location = personalInfo.location.includes("India") ? personalInfo.location : `${personalInfo.location}, India`;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim() || "Portfolio visitor";
    const email = formData.get("email")?.toString().trim() || "";
    const message = formData.get("message")?.toString().trim() || "";
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="border-t border-white/10 py-14 lg:flex lg:min-h-[calc(100vh-4rem)] lg:items-center lg:py-8">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            className="pt-2"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-4xl font-black uppercase leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              <span className="block">Let's</span>
              <span className="block">Work</span>
              <span className="block bg-gradient-to-r from-violet-400 to-violet-500 bg-clip-text text-transparent">Together</span>
            </h2>

            <div className="mt-10 space-y-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">Currently based in</p>
                <p className="mt-4 flex items-center gap-3 text-xl font-bold leading-7 text-white">
                  <MapPin size={24} className="shrink-0 text-violet-400" />
                  {location}
                </p>
                <p className="mt-3 text-base leading-7 text-slate-300">Open to remote opportunities and freelance projects.</p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">Direct email</p>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="focus-ring mt-4 inline-flex items-center gap-3 rounded break-all text-xl font-bold leading-7 text-white transition hover:text-violet-200"
                >
                  <Mail size={24} className="shrink-0 text-violet-400" />
                  {personalInfo.email}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="glass-card rounded-lg border-white/10 bg-night-950/50 p-5 shadow-violetGlow sm:p-6 lg:p-7"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-black text-white sm:text-3xl">
                Get in <span className="text-violet-400">Touch</span>
              </h3>
              <p className="mt-2 text-base leading-7 text-slate-300">Have an idea or project? Let's collaborate.</p>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-200">Name</span>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="focus-ring mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-night-950/80 px-4 text-base font-medium text-white outline-none transition placeholder:text-slate-600 hover:border-white/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-200">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  className="focus-ring mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-night-950/80 px-4 text-base font-medium text-white outline-none transition placeholder:text-slate-600 hover:border-white/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-200">Message</span>
                <textarea
                  name="message"
                  required
                  rows="5"
                  placeholder="Tell me about your project..."
                  className="focus-ring mt-2 w-full resize-none rounded-lg border border-white/10 bg-night-950/80 px-4 py-3 text-base font-medium leading-7 text-white outline-none transition placeholder:text-slate-600 hover:border-white/20"
                />
              </label>

              <button
                type="submit"
                className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-violet-500 to-violet-400 px-6 text-base font-black text-white shadow-violetGlow transition hover:scale-[1.01]"
              >
                Send Message
                <Send size={19} />
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
