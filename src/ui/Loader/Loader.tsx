'use client';
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./loader.module.scss";

const AnimatedLoader = () => {
  return (
    <div className={styles.container}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className={styles.loader} />
      </motion.div>
    </div>
  );
};

export default AnimatedLoader;
