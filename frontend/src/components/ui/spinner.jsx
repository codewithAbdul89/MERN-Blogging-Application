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

export const Spinner = () => {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center gap-3"
            variants={containerVariants}
            initial="initial"
            animate="animate"
        >
            <motion.div
                className="h-5 w-5 rounded-full bg-blue-500"
                variants={dotVariants}
            />

            <motion.div
                className="h-5 w-5 rounded-full bg-blue-500"
                variants={dotVariants}
            />

            <motion.div
                className="h-5 w-5 rounded-full bg-blue-500"
                variants={dotVariants}
            />
        </motion.div>
    );
};

export default Spinner;