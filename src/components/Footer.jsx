import { personalInfo } from "../data/portfolio";

function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="section-shell flex flex-col items-center justify-between gap-3 text-sm text-ink-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {personalInfo.name}
        </p>
        <a href="#top" className="focus-ring rounded transition hover:text-ink">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

export default Footer;
