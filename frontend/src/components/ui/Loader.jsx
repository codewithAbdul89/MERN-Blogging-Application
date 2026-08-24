import { motion } from "framer-motion";

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const dotVariants = {
  animate: {
    y: -30,
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  },
};

export const Loader = () => {
  return (
    <div
      className="
            fixed
            inset-0
            z-100
            flex
            items-center
            justify-center
            bg-black/80
        "
    >
      <motion.div
        className="flex items-center justify-center gap-3"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="h-5 w-5 rounded-full bg-primary"
          variants={dotVariants}
        />

        <motion.div
          className="h-5 w-5 rounded-full bg-primary"
          variants={dotVariants}
        />

        <motion.div
          className="h-5 w-5 rounded-full bg-primary  "
          variants={dotVariants}
        />
      </motion.div>
    </div>
  );
};

export default Loader;
