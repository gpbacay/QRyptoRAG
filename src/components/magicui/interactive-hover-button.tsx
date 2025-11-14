"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import React from "react"

interface InteractiveHoverButtonProps {
  children: React.ReactNode
  className?: string
}

export function InteractiveHoverButton({
  children,
  className,
}: InteractiveHoverButtonProps) {
  return (
    <motion.button
      className={cn(
        "inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        className
      )}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.button>
  )
}
