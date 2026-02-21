"use client"

import React from "react"
import { motion } from "framer-motion"
import { Award } from "lucide-react"

const certifications = [
  {
    title: "Database",
    issuer: "Certiport",
    date: "2024",
    description: "Information Technology Specialist: Database Design and Development.",
    src: "/Database.png"
  },
  {
    title: "HTML and CSS",
    issuer: "Certiport",
    date: "2024",
    description: "Information Technology Specialist: HTML and CSS.",
    src: "/Html and Css.png"
  },
  {
    title: "Network Security",
    issuer: "Certiport",
    date: "2025",
    description: "Information Technology Specialist: Network Security.",
    src: "/Network Security.png"
  },
   {
    title: "Networking",
    issuer: "Certiport",
    date: "2025",
    description: "Information Technology Specialist: Networking.",
    src: "/Networking.png"
  }
]

export function Certifications() {
  // Triple the items to ensure seamless loop
  const extendedCertifications = [...certifications, ...certifications, ...certifications]

  return (
    <section id="certifications" className="py-24 bg-accent/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <div className="mb-16 flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight mb-4"
          >
            Certifications
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1 w-20 bg-primary origin-center"
          />
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full">
        {/* Shadow Overlays for smooth entry/exit */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-accent/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-accent/30 to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{
            x: ["0%", "-33.333%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          className="flex gap-8 px-4 w-fit"
          style={{ willChange: "transform" }}
          whileHover={{ transition: { duration: 60 } }} // Slow down on hover for easier reading
        >
          {extendedCertifications.map((cert, index) => (
            <div
              key={`${cert.title}-${index}`}
              className="w-[350px] flex-shrink-0"
            >
              <div
                className="group overflow-hidden rounded-3xl bg-card border border-card-border transition-all hover:shadow-2xl hover:shadow-primary/5 h-full flex flex-col"
              >
                {/* Image Preview */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={cert.src}
                    alt={cert.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                    <Award className="text-white w-12 h-12 drop-shadow-lg" />
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2">{cert.title}</h3>
                  <div className="flex justify-between items-center mb-4 text-xs font-semibold uppercase tracking-widest text-secondary/60">
                    <span>{cert.issuer}</span>
                    <span>{cert.date}</span>
                  </div>
                  <p className="text-sm text-secondary">
                    {cert.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
