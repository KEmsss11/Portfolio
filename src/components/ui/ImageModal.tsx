"use client"

import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink } from "lucide-react"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  src: string | null
  title?: string
  description?: string
  link?: string
}

export function ImageModal({
  isOpen,
  onClose,
  src,
  title,
  description,
  link,
}: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !src) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 max-h-[90vh] max-w-5xl overflow-hidden rounded-3xl bg-card border border-card-border shadow-2xl flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2.5 text-white/80 hover:text-white hover:bg-black/90 transition-all shadow-lg"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Image Container */}
          <div className="relative flex items-center justify-center overflow-auto max-h-[75vh] bg-black/40">
            <img
              src={src}
              alt={title || "View image"}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-t-3xl"
            />
          </div>

          {/* Info footer */}
          {(title || description) && (
            <div className="p-6 bg-card border-t border-card-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                {title && <h3 className="text-xl font-bold">{title}</h3>}
                {description && (
                  <p className="text-sm text-secondary mt-1">{description}</p>
                )}
              </div>
              {link && link !== "#" && (
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  <ExternalLink size={14} /> Open Link
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
