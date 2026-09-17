"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, Eye } from "lucide-react"
import { Skeleton } from "./ui/Skeleton"
import { ImageModal } from "./ui/ImageModal"

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
    title: "Social Welfare System",
    description: "A comprehensive platform for managing social services and community welfare programs effectively.",
    src: "/Social_welfare.jpg",
    tags: ["C#", "SQL Server", "Bootstrap", "HTML", "CSS", "JS"],
    github: "https://github.com/KEmsss11/NEW-FINAL-16.git",
    live: "#"
  },
  {
    title: "ECA-IS",
    description: "Internship project for the National Commission of Senior Citizens (NCSC) - Region 11 (Davao Region). The system is designed to provide a robust and efficient platform for managing beneficiary records, end-to-end processing workflows, AI-assisted data entry, and regional reporting.",
    src: "/eca.png",
    tags: ["PHP", "Xampp", "Tailwind", "HTML", "CSS", "JS", "Laravel", "MySQL", "Azure"],
    github: "https://github.com/KEmsss11/ECA-IS.git",
    live: "https://eca11.site/login"
  }
]

const ProjectSkeleton = () => (
  <div className="rounded-3xl bg-card border border-card-border p-4 flex flex-col h-full">
    <Skeleton className="aspect-[16/10] rounded-2xl mb-6" />
    <div className="px-2 flex flex-col flex-grow">
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-7 w-3/4 mb-3" />
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex gap-4 mt-auto">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
)

export function Projects() {
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<{
    src: string
    title: string
    description: string
    live?: string
  } | null>(null)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

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

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 justify-center items-stretch w-full">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeletons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="contents"
              >
                {[1, 2, 3].map((i) => (
                  <ProjectSkeleton key={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="contents"
              >
                {projects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-3xl bg-card border border-card-border p-4 transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full"
                  >
                    <div
                      onClick={() =>
                        setSelectedImage({
                          src: project.src,
                          title: project.title,
                          description: project.description,
                          live: project.live,
                        })
                      }
                      className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 flex-shrink-0 cursor-pointer"
                    >
                      <img
                        src={project.src}
                        alt={project.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2 text-white font-semibold text-xs tracking-wider uppercase backdrop-blur-[2px]">
                        <Eye size={20} />
                        <span>View Image</span>
                      </div>
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
                        <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-semibold hover:text-primary transition-colors">
                          <Github size={16} /> Code
                        </a>
                        <a href={project.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-semibold hover:text-primary transition-colors">
                          <ExternalLink size={16} /> Demo
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        src={selectedImage?.src || null}
        title={selectedImage?.title}
        description={selectedImage?.description}
        link={selectedImage?.live}
      />
    </section>
  )
}
