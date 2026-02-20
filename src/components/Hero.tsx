"use client"

import React, { useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import { WaveBackground } from "./WaveBackground"

import {
  SiPhp,
  SiMysql,
  SiFigma,
  SiTailwindcss,
  SiCss3,
  SiHtml5,
  SiJavascript,
} from "react-icons/si"

const techStack = [
  { name: "PHP",        color: "#777BB4", bg: "#777BB420", Icon: SiPhp },
  { name: "MySQL",      color: "#4479A1", bg: "#4479A120", Icon: SiMysql },
  { name: "Figma",      color: "#F24E1E", bg: "#F24E1E20", Icon: SiFigma },
  { name: "Tailwind",   color: "#38B2AC", bg: "#38B2AC20", Icon: SiTailwindcss },
  { name: "CSS",        color: "#1572B6", bg: "#1572B620", Icon: SiCss3 },
  { name: "HTML",       color: "#E34F26", bg: "#E34F2620", Icon: SiHtml5 },
  { name: "JavaScript", color: "#F7DF1E", bg: "#F7DF1E20", Icon: SiJavascript },
]

const heroName = "Kemuel Paul Nalagon"
const paragraph = "A web developer who perceives user needs with clarity and is eager to craft beautiful, functional digital experiences."

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}
const letterContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.045, delayChildren: 0.9 } },
}
const letterVariant = {
  hidden: { opacity: 0, y: 20, rotateX: -90 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}
const wordContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 1.6 } },
}
const wordVariant = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
}

// Floating particles data
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1,
  delay: Math.random() * 4,
  duration: Math.random() * 6 + 6,
}))

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  
  // Smooth spring-based mouse position (0–100% of section)
  const rawX = useMotionValue(50)
  const rawY = useMotionValue(50)
  const mouseX = useSpring(rawX, { stiffness: 80, damping: 20 })
  const mouseY = useSpring(rawY, { stiffness: 80, damping: 20 })
  // Convert to percentage strings for CSS
  const pctX = useTransform(mouseX, (v) => `${v}%`)
  const pctY = useTransform(mouseY, (v) => `${v}%`)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      rawX.set(((e.clientX - rect.left) / rect.width) * 100)
      rawY.set(((e.clientY - rect.top) / rect.height) * 100)
    }

    section.addEventListener("mousemove", handleMove)
    return () => {
      section.removeEventListener("mousemove", handleMove)
    }
  }, [rawX, rawY])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-6 pt-24"
    >
      {/* Wave Background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-60">
        <WaveBackground />
      </div>

      {/* Parallax Background Layers (remaining layers) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Layer 2: Floating Blobs (medium speed) */}
        <motion.div
           style={{ 
             x: useTransform(mouseX, [0, 100], [20, -20]),
             y: useTransform(mouseY, [0, 100], [20, -20]),
           }}
           className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-20"
        >
           <div className="absolute top-[20%] left-[10%] h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
           <div className="absolute bottom-[20%] right-[10%] h-80 w-80 rounded-full bg-secondary/10 blur-[100px]" />
        </motion.div>

        {/* Layer 3: Mouse spotlight (fast) */}
        <div className="absolute inset-0 z-[1]">
          <motion.div
            className="absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full dark:hidden"
            style={{
              left: pctX,
              top: pctY,
              background:
                "radial-gradient(circle at center, rgba(0,0,0,0.09) 0%, rgba(0,0,0,0.03) 40%, transparent 70%)",
            }}
          />
          <motion.div
            className="absolute hidden h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full dark:block"
            style={{
              left: pctX,
              top: pctY,
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)",
            }}
          />
        </div>

        {/* Layer 4: Floating ambient particles (interactive) */}
        <motion.div 
          style={{ 
            x: useTransform(mouseX, [0, 100], [-30, 30]),
            y: useTransform(mouseY, [0, 100], [-30, 30]),
          }}
          className="absolute inset-0 z-[1] overflow-hidden"
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-primary/20 dark:bg-primary/10"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.4, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: p.duration,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          y: useTransform(mouseY, [0, 100], [-5, 5]),
          x: useTransform(mouseX, [0, 100], [-5, 5]),
        }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-10 text-center"
      >
        {/* Profile picture */}
        <motion.div variants={itemVariants} className="relative">
          <div className="relative h-44 w-44 overflow-hidden rounded-full ring-4 ring-primary/10 shadow-2xl">
            <Image
              src="/Profile.png"
              alt="Profile photo"
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback to gradient avatar if no image
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
            {/* Fallback gradient avatar */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/20 text-5xl font-bold text-primary select-none">
              
            </div>
          </div>
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 rounded-full ring-2 ring-primary/30"
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Tag line */}
        <motion.div variants={itemVariants}>
          <span className="inline-block rounded-full border border-primary/20 bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-widest text-secondary">
            Available for hire
          </span>
        </motion.div>

        {/* Animated Name — letter by letter */}
        <motion.h1
          variants={letterContainer}
          initial="hidden"
          animate="visible"
          className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl flex flex-wrap justify-center"
          style={{ perspective: "600px" }}
        >
          {heroName.split("").map((char: string, i: number) => (
            <motion.span
              key={i}
              variants={letterVariant}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Animated Paragraph — word by word */}
        <motion.p
          variants={wordContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-xl text-lg text-secondary md:text-xl flex flex-wrap justify-center gap-x-[0.3em]"
        >
          {paragraph.split(" ").map((word, i) => (
            <motion.span key={i} variants={wordVariant}>
              {word}
            </motion.span>
          ))}
        </motion.p>

        {/* Tech stack pills */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3"
        >
          {techStack.map((tech, i) => (
            <motion.span
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.1, y: -2 }}
              style={{ color: tech.color, background: tech.bg, borderColor: tech.color + "40" }}
              className="flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold cursor-default"
            >
              <tech.Icon size={16} />
              {tech.name}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div variants={itemVariants} className="flex gap-4 flex-wrap justify-center">
          <a
            href="#projects"
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-background shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-full border border-primary/30 bg-accent px-8 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-background hover:scale-105 active:scale-95"
          >
            Contact Me
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="h-10 w-[2px] bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  )
}
