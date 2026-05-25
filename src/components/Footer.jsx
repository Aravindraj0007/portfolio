import { personalInfo } from "../data/portfolio";

function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="section-shell flex flex-col items-center justify-between gap-4 text-center text-sm text-slate-400 sm:flex-row sm:text-left">
        <p>© {new Date().getFullYear()} {personalInfo.name}. AI/ML Portfolio.</p>
        <a href="#home" className="focus-ring rounded-full px-4 py-2 text-slate-300 transition hover:bg-white/10 hover:text-white">
          Back to top
        </a>
      </div>
    </footer>
  );
}

export default Footer;
