"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    title: "EventSphere",
    description: "Plan, organize, and execute events with ease. From Bookings to reports, everything you need in one place.",
    src: "/EventProj.png",
    tags: ["Laravel", "MySQL", "Tailwind", "Php", "Javascipt"],
    github: "https://github.com/KEmsss11/Event-New.git",
    live: "#"
  },
  {
    title: "Happy Birthday",
    description: "A magical digital garden designed for special moments with animated hearts and flowers.",
    src: "/Bday.png",
    tags: ["HTML", "CSS", "JS"],
    github: "https://github.com/KEmsss11/Bday.git",
    live: "https://shane-bday.vercel.app/"
  },
  {
    title: "Social Welfare System",
    description: "A comprehensive platform for managing social services and community welfare programs effectively.",
    src: "/Social_welfare.jpg",
    tags: ["C#", "SQL Server", "Bootstrap", "HTML", "CSS", "JS"],
    github: "https://github.com/KEmsss11/NEW-FINAL-16.git",
    live: "#"
  }
]

export function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="mb-16 flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight mb-4"
          >
            Featured Projects
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1 w-20 bg-primary origin-center"
          />
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 justify-center items-stretch">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-card border border-card-border p-4 transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 flex-shrink-0">
                <img
                  src={project.src}
                  alt={project.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <div className="px-2 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-secondary border border-secondary/20 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm text-secondary mb-6 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex gap-4 mt-auto">
                  <a href={project.github} className="flex items-center gap-2 text-xs font-semibold hover:text-primary transition-colors">
                    <Github size={16} /> Code
                  </a>
                  <a href={project.live} className="flex items-center gap-2 text-xs font-semibold hover:text-primary transition-colors">
                    <ExternalLink size={16} /> Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
