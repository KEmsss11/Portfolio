"use client"

import React from "react"
import { motion } from "framer-motion"
import { Award } from "lucide-react"

const certifications = [
  {
    title: "Full-Stack Web Development",
    issuer: "Online Academy",
    date: "2023",
    description: "Comprehensive certification covering React, Node.js, and modern web architecture.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "UI/UX Design Specialist",
    issuer: "Design Institute",
    date: "2022",
    description: "Advanced course in user interface design, prototyping, and user experience research.",
    image: "https://images.unsplash.com/photo-1541462608141-ad4374ee3477?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Cloud Infrastructure Fundamental",
    issuer: "Cloud Services Inc.",
    date: "2023",
    description: "Certification in deploying and managing scalable cloud-based applications.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600"
  }
]

export function Certifications() {
  return (
    <section id="certifications" className="py-24 px-6 bg-accent/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
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
            className="h-1 w-20 bg-primary origin-left"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group overflow-hidden rounded-3xl bg-card border border-card-border transition-all hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                  <Award className="text-white w-12 h-12 drop-shadow-lg" />
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">{cert.title}</h3>
                <div className="flex justify-between items-center mb-4 text-xs font-semibold uppercase tracking-widest text-secondary/60">
                  <span>{cert.issuer}</span>
                  <span>{cert.date}</span>
                </div>
                <p className="text-sm text-secondary">
                  {cert.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
