"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle2 } from "lucide-react"

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    try {
      // Construct mailto URL
      const subject = encodeURIComponent(`New Portfolio Message from ${name}`)
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
      const mailtoUrl = `mailto:kemuelpaulnalagon@gmail.com?subject=${subject}&body=${body}`

      // Open mail client
      window.location.assign(mailtoUrl)
      
      // Since mailto doesn't give feedback, we show success immediately
      setIsSuccess(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 px-6 bg-muted/50 overflow-hidden">
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
          className="relative glass rounded-[2rem] p-8 md:p-12 shadow-xl min-h-[400px] flex flex-col justify-center"
        >
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6 py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
              >
                <CheckCircle2 size={40} className="text-primary" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Message Received!</h3>
                <p className="text-secondary max-w-sm mx-auto">
                  Thank you for reaching out. I'll get back to you at kemuelpaulnalagon@gmail.com as soon as possible.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSuccess(false)}
                className="text-sm font-bold text-primary hover:underline"
              >
                Send another message
              </motion.button>
            </motion.div>
          ) : (
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

              {error && (
                <div className="md:col-span-2 text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-background transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="h-5 w-5 border-2 border-background/30 border-t-background rounded-full"
                    />
                  ) : (
                    <>
                      <Send size={18} /> Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
