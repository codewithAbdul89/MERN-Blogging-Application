import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect } from "react";

function AnimatedNumber({ value }) {
  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default AnimatedNumber;