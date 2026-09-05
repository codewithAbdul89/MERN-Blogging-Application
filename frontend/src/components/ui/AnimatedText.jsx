import { motion } from "framer-motion";

function AnimatedText({ text }) {
  const containerVariants = {
    hidden: {},

    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },

    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {text?.split("").map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default AnimatedText;