"use client"

import React from "react"
import { motion } from "framer-motion"

export function About() {
  return (
    <section id="about" className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="mb-16 flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight mb-4"
          >
            About Me
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1 w-20 bg-primary origin-center"
          />
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-lg text-secondary leading-relaxed mb-6">
              I am a passionate Full-Stack Web Developer with a keen eye for UI/UX design. My journey in technology is driven by a desire to create impactful digital solutions that bridge the gap between user needs and technical excellence.
            </p>
            <p className="text-lg text-secondary leading-relaxed mb-6">
              With moderate knowledge in modern frameworks like PHP and Laravel, and a solid foundation in backend technologies, I thrive in building scalable applications that offer seamless user experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { title: "Design Mindset", desc: "User-centric design focusing on aesthetics and usability." },
              { title: "Technical Excellence", desc: "Writing clean, maintainable, and efficient code." },
              { title: "Continuous Learning", desc: "Always exploring new technologies and best practices." },
              { title: "Collaboration", desc: "Strong communicator and team player in agile environments." }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-card-border"
              >
                <h4 className="font-bold mb-2">{value.title}</h4>
                <p className="text-sm text-secondary">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
