import { motion } from "framer-motion";

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function SectionHeader({ eyebrow, title, description, align = "left" }) {
  return (
    <motion.div
      className={`mb-10 ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}
      variants={headerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <p className="mb-3 text-sm font-semibold uppercase text-cyan-300">{eyebrow}</p>
      <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-8 text-slate-300">{description}</p> : null}
    </motion.div>
  );
}

export default SectionHeader;
