"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("hover-trigger")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[100] pointer-events-none mix-blend-screen"
        animate={{
          x: mousePosition.x - (isHovering ? 20 : 6),
          y: mousePosition.y - (isHovering ? 20 : 6),
          scale: isHovering ? 1 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.5 }}
      >
        <div
          className={`rounded-full transition-all duration-300 ease-out ${
            isHovering
              ? "bg-cyan-400/20 w-10 h-10 border border-cyan-300/50"
              : "bg-cyan-400 w-3 h-3 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
          }`}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 z-[99] pointer-events-none mix-blend-screen"
        animate={{
          x: mousePosition.x - 30,
          y: mousePosition.y - 30,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 25, mass: 0.8 }}
      >
        <div className="w-[60px] h-[60px] rounded-full border border-cyan-500/10 opacity-50" />
      </motion.div>
    </>
  );
}
