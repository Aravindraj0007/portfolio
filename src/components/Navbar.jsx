import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { navLinks, personalInfo } from "../data/portfolio";
import { useTheme } from "../theme";
import { icons } from "./icons";

const { Menu, Moon, Sun, X } = icons;

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-line/60 hover:text-ink"
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [targetHref, setTargetHref] = useState("");

  const closeMenu = () => setOpen(false);
  const handleNavClick = (event, href) => {
    event.preventDefault();
    setTargetHref(href);
    closeMenu();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll only after the mobile menu has closed, so its collapsing height doesn't throw off the target position.
  useEffect(() => {
    if (open || !targetHref) return;

    const target = document.getElementById(targetHref.slice(1));
    if (!target) {
      setTargetHref("");
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const navHeight = document.querySelector("header nav")?.getBoundingClientRect().height ?? 64;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

      window.history.pushState(null, "", targetHref);
      window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
      setTargetHref("");
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [open, targetHref]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        open ? "bg-paper/90 backdrop-blur-md" : scrolled ? "bg-gradient-to-b from-paper/80 to-transparent" : ""
      }`}
    >
      <nav className="section-shell relative flex h-20 items-center justify-between">
        <a href="#top" className="focus-ring flex items-center gap-2.5 rounded text-[15px] font-semibold tracking-tight text-ink" onClick={closeMenu}>
          <span className="font-mono text-accent">
            [{personalInfo.initials}
            <span className="text-ink">.</span>]
          </span>
          <span className="hidden sm:inline">{personalInfo.name}</span>
        </a>

        {/* Centered glass pill of section links */}
        <div className="glass absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full p-1 shadow-lg shadow-black/20 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              className="focus-ring rounded-full px-4 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-ink/10 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <a href={personalInfo.resumePath} target="_blank" rel="noreferrer" className="btn-accent ml-1 px-5 py-2">
            Resume
          </a>
        </div>

        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-ink"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-navigation"
            className="overflow-hidden md:hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="section-shell flex flex-col pb-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link.href)}
                  className="focus-ring border-b border-line py-3 text-[15px] font-medium text-ink"
                >
                  {link.label}
                </a>
              ))}
              <a href={personalInfo.resumePath} target="_blank" rel="noreferrer" onClick={closeMenu} className="btn-primary mt-4">
                View Resume
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
