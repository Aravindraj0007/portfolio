import { motion } from "framer-motion";
import { reveal3d } from "../motion";

function SectionHeader({ index, label, title, description }) {
  return (
    <motion.div className="mb-10 max-w-2xl" {...reveal3d()}>
      <p className="section-label">
        {index ? <span className="text-accent">{index} </span> : null}
        {label}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 leading-7 text-ink-soft">{description}</p> : null}
    </motion.div>
  );
}

export default SectionHeader;
