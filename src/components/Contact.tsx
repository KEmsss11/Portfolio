"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Mail, ExternalLink, Copy, Check, Sparkles } from "lucide-react"
import { SiInstagram, SiGithub, SiLinkedin } from "react-icons/si"

export function Contact() {
  const [copied, setCopied] = useState(false)
  const emailAddress = "kemuelpaulnalagon@gmail.com"

  const socialLinks = [
    {
      name: "Instagram",
      handle: "@taco.kp",
      url: "https://www.instagram.com/taco.kp/",
      icon: SiInstagram,
      color: "#E4405F",
      bg: "#E4405F15",
    },
    {
      name: "GitHub",
      handle: "KEmsss11",
      url: "https://github.com/KEmsss11",
      icon: SiGithub,
      color: "#181717",
      bg: "#18171715",
    },
    {
      name: "LinkedIn",
      handle: "Kemuel Paul Nalagon",
      url: "https://www.linkedin.com/in/kemuel-paul-nalagon-83a73439a/",
      icon: SiLinkedin,
      color: "#0A66C2",
      bg: "#0A66C215",
    },
  ]

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="py-24 px-6 bg-muted/50 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-widest text-secondary mb-4"
          >
            <Sparkles size={14} className="text-primary" />
            <span>Let's Connect</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight mb-4"
          >
            Get in Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-secondary max-w-lg mx-auto"
          >
            Have a project in mind, an opportunity, or just want to connect? Reach out via email or any of my social profiles!
          </motion.p>
        </div>

        {/* Main Hub Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Main Direct Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 glass rounded-[2rem] p-8 shadow-xl border border-card-border flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Mail size={28} />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary/70">
                  Direct Email
                </span>
                <h3 className="text-lg font-bold text-foreground truncate">
                  {emailAddress}
                </h3>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handleCopyEmail}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 rounded-xl border border-card-border bg-background px-5 py-3 text-xs font-semibold hover:border-primary/40 transition-colors shadow-sm"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Email
                  </>
                )}
              </button>
              <a
                href={`mailto:${emailAddress}`}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-semibold text-background hover:opacity-90 transition-all shadow-sm"
              >
                <ExternalLink size={14} /> Send Email
              </a>
            </div>
          </motion.div>

          {/* Social Links Cards */}
          {socialLinks.map((social, index) => {
            const IconComp = social.icon
            return (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="glass rounded-3xl p-6 border border-card-border flex items-center justify-between transition-all hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98] shadow-sm group"
              >
                <div className="flex items-center gap-4">
                  <div
                    style={{ color: social.color, backgroundColor: social.bg }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  >
                    <IconComp size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold">{social.name}</h4>
                    <p className="text-xs text-secondary">{social.handle}</p>
                  </div>
                </div>
                <ExternalLink size={18} className="text-secondary opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
