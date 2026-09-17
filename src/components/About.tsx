"use client"

import React from "react"
import { motion } from "framer-motion"
import { Code2, Database, Server, Palette, CheckCircle2 } from "lucide-react"

export function About() {
  const pillars = [
    {
      icon: Code2,
      title: "Full-Stack Development",
      desc: "Building responsive web applications using Next.js, React, TypeScript, and PHP/Laravel.",
    },
    {
      icon: Database,
      title: "Database & Backend",
      desc: "Architecting efficient database schemas with PostgreSQL, MySQL, and scalable Node.js API services.",
    },
    {
      icon: Server,
      title: "DevOps & Tooling",
      desc: "Containerizing apps with Docker, setting up automated CI/CD workflows, and version control with Git/GitHub.",
    },
    {
      icon: Palette,
      title: "UI/UX & Styling",
      desc: "Designing clean, accessible interfaces with Tailwind CSS and Figma with focus on high usability.",
    },
  ]

  const highlights = [
    "Next.js & TypeScript Specialist",
    "PHP & Laravel Frameworks",
    "PostgreSQL & MySQL Systems",
    "Docker & CI/CD Pipelines",
  ]

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

        <div className="grid gap-12 lg:grid-cols-12 items-stretch">
          {/* Bio Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-between rounded-3xl bg-card border border-card-border p-8 shadow-sm"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Hi, I'm <span className="text-primary">Kemuel Paul Nalagon</span>
              </h3>
              <p className="text-base text-secondary leading-relaxed mb-6">
                I am a dedicated Full-Stack Web Developer passionate about crafting modern, high-performance web applications that bridge user needs with robust software engineering.
              </p>
              <p className="text-base text-secondary leading-relaxed mb-6">
                My technical stack spans frontend frameworks like <strong className="text-foreground">Next.js</strong> and <strong className="text-foreground">TypeScript</strong>, backend development with <strong className="text-foreground">Node.js</strong> and <strong className="text-foreground">PHP/Laravel</strong>, as well as database design with <strong className="text-foreground">PostgreSQL</strong> and <strong className="text-foreground">MySQL</strong>.
              </p>
              <p className="text-base text-secondary leading-relaxed mb-8">
                I also leverage containerization with <strong className="text-foreground">Docker</strong> and continuous integration with <strong className="text-foreground">CI/CD</strong> pipelines to deliver scalable, production-ready software efficiently.
              </p>
            </div>

            {/* Quick Highlight Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-card-border">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs font-semibold text-secondary">
                  <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pillars Cards Column */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((value, index) => {
              const IconComp = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="p-6 rounded-3xl bg-card border border-card-border flex flex-col justify-between transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 group"
                >
                  <div className="mb-4 rounded-2xl bg-primary/10 w-12 h-12 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <IconComp size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{value.title}</h4>
                    <p className="text-xs text-secondary leading-relaxed">{value.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
