"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    title: "E-Commerce Reimagined",
    description: "A luxury shopping experience with seamless transitions and 3D product views.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800",
    tags: ["React", "Three.js", "Tailwind"],
    github: "#",
    live: "#"
  },
  {
    title: "AI Interior Designer",
    description: "Generative AI tool for visualizing interior design concepts from simple sketches.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
    tags: ["Next.js", "OpenAI", "Prisma"],
    github: "#",
    live: "#"
  },
  {
    title: "Future of Finance",
    description: "A secure, high-performance crypto dashboard with real-time analytics.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    tags: ["TypeScript", "D3.js", "PostgreSQL"],
    github: "#",
    live: "#"
  }
]

export function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
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
            className="h-1 w-20 bg-primary origin-left"
          />
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-card border border-card-border p-4 transition-all hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <div className="px-2">
                <div className="flex gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-secondary border border-secondary/20 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm text-secondary mb-6 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex gap-4">
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
