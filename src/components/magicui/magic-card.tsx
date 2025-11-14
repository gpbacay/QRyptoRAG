"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

import { cn } from "@/lib/utils";

export interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#392259", // Using background color
  gradientOpacity = 0.8,
  gradientFrom = "#D91480", // Using primary color
  gradientTo = "#44238C", // Using accent color
}: MagicCardProps) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  // Call all hooks at the top level before any conditional returns
  const background1 = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
  `;
  
  const background2 = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, 
      ${gradientFrom}, 
      ${gradientTo}, 
      transparent 100%)
  `;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { left, top } = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [mouseX, mouseY, gradientSize]);

  useEffect(() => {
    setMounted(true);
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [mouseX, mouseY, gradientSize]);

  // Prevent hydration mismatch by not rendering motion elements on server
  if (!mounted) {
    return (
      <div
        className={cn(
          "group relative flex size-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border text-black dark:text-white",
          className
        )}
      >
        <div className="relative z-10 size-full">{children}</div>
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex size-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border text-black dark:text-white",
        className
      )}
    >
      <div className="relative z-10 size-full">{children}</div>
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: background1,
          opacity: gradientOpacity,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: background2,
          opacity: 0.3,
        }}
      />
    </div>
  );
}

