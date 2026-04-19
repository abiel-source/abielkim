"use client";

import { useLayoutEffect, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";

const Sections = ({ children }) => {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <SmoothScroll>
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto max-w-4xl px-6 py-16 md:py-24"
      >
        {children}
      </motion.article>
    </SmoothScroll>
  );
};

export default Sections;
