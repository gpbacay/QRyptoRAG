"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ShineBorderProps {
  shineColor?: string[]
  className?: string
  children?: React.ReactNode
}

export function ShineBorder({
  shineColor = ["#A07CFE", "#FE8FB5", "#FFBE7B"],
  className,
  children,
}: ShineBorderProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg",
        className
      )}
      whileHover={{
        boxShadow: `0 0 20px ${shineColor[0]}33, 0 0 40px ${shineColor[1]}22, 0 0 60px ${shineColor[2]}11`,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0"
        style={{
          background: `linear-gradient(45deg, ${shineColor.join(", ")})`,
          backgroundSize: "200% 200%",
        }}
        whileHover={{
          opacity: 0.1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(45deg, transparent, ${shineColor[0]}40, transparent)`,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        whileHover={{
          opacity: 1,
        }}
        initial={{
          opacity: 0,
        }}
      />
      {children}
    </motion.div>
  )
}
