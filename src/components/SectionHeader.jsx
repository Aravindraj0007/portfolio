import { motion } from "framer-motion";
import { reveal3d } from "../motion";

// Section intro in the "01 / LABEL ———" style.
function SectionHeader({ index, label, title, description }) {
  return (
    <motion.div className="mb-10 max-w-2xl" {...reveal3d()}>
      <p className="section-label flex items-center gap-2.5">
        {index ? (
          <>
            <span className="text-accent">{index}</span>
            <span aria-hidden="true">/</span>
          </>
        ) : null}
        {label}
        <span aria-hidden="true" className="h-px w-16 bg-gradient-to-r from-accent/70 to-transparent" />
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-4xl">{title}</h2>
      {description ? <p className="mt-3 leading-7 text-ink-soft">{description}</p> : null}
    </motion.div>
  );
}

export default SectionHeader;
