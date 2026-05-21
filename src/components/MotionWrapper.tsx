/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";
import React from "react";

interface MotionWrapperProps {
  children: React.ReactNode;
  locale?: string;
  className?: string;
}

const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  locale = "en",
  className,
}) => {
  const isRTL = locale !== "en";

  const variants = {
    hidden: {
      opacity: 0,
      x: isRTL ? 40 : -40,
      y: 10,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 14,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      x: isRTL ? -40 : 40,
      y: -10,
      scale: 0.98,
      transition: { duration: 0.25, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      key={String(isRTL)}
      variants={variants as any}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
