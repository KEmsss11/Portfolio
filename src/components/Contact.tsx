"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle2 } from "lucide-react"
import { submitContactForm } from "@/lib/actions"

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await submitContactForm(formData)
    
    setIsSubmitting(false)
    if (result.success) {
      setIsSuccess(true)
      // Reset after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000)
    }
  }

  return (
    <section id="contact" className="py-24 px-6 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
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
            Have a project in mind? Let's build something extraordinary together.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass rounded-[2rem] p-8 md:p-12 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-secondary/70">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                required
                placeholder="John Doe"
                className="w-full rounded-2xl bg-background border border-card-border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-secondary/70">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                className="w-full rounded-2xl bg-background border border-card-border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-secondary/70">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder="Tell me about your project..."
                className="w-full rounded-2xl bg-background border border-card-border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/10 resize-none"
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-background transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-5 w-5 border-2 border-background/30 border-t-background rounded-full"
                  />
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={18} /> Sent Successfully
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
