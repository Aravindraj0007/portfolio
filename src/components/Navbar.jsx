import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { navLinks, personalInfo } from "../data/portfolio";
import { icons } from "./icons";

const { Menu, X, Download } = icons;

function Navbar() {
  const [open, setOpen] = useState(false);
  const [targetHref, setTargetHref] = useState("");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  const closeMenu = () => setOpen(false);
  const handleNavClick = (event, href) => {
    event.preventDefault();
    setTargetHref(href);
    closeMenu();
  };

  useEffect(() => {
    if (open || !targetHref) return;

    const target = document.getElementById(targetHref.slice(1));
    if (!target) {
      setTargetHref("");
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const navHeight = document.querySelector("header nav")?.getBoundingClientRect().height ?? 64;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.history.pushState(null, "", targetHref);
      window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
      setTargetHref("");
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [open, targetHref]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-night-950/72 backdrop-blur-xl">
      <motion.div className="absolute bottom-0 left-0 h-px origin-left bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400" style={{ scaleX }} />
      <nav className="section-shell flex h-16 items-center justify-between">
        <a href="#home" className="focus-ring flex items-center gap-3 rounded-full" onClick={closeMenu}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-sm font-bold text-cyan-200 shadow-glow">
            AM
          </span>
          <span className="hidden text-sm font-semibold text-white sm:block">{personalInfo.name}</span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              className="focus-ring rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={personalInfo.resumePath}
            download
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/20"
          >
            <Download size={16} />
            Resume
          </a>
        </div>

        <button
          type="button"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-navigation"
            className="border-t border-white/10 bg-night-950/95 px-5 py-5 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link.href)}
                  className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={personalInfo.resumePath}
                download
                onClick={closeMenu}
                className="focus-ring mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100"
              >
                <Download size={16} />
                Download Resume
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
