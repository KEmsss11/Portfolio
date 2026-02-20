"use client"

import React, { useRef, useEffect } from "react"
import { useTheme } from "next-themes"

interface Point {
  x: number
  y: number
  ox: number
  oy: number
  vx: number
  vy: number
}

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const mouse = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let points: Point[] = []
    const spacing = 30
    const rows = 35
    const cols = 60

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      points = []

      const startX = (canvas.width - cols * spacing) / 2
      const startY = (canvas.height - rows * spacing) / 2

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = startX + j * spacing
          const y = startY + i * spacing
          points.push({
            x,
            y,
            ox: x,
            oy: y,
            vx: 0,
            vy: 0,
          })
        }
      }
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const isDark = theme === "dark"
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.4)"

      const t = time / 1000

      points.forEach((p, i) => {
        // Wave logic
        const waveX = Math.sin(t + p.ox * 0.01) * 15
        const waveY = Math.cos(t + p.oy * 0.01) * 15
        
        // Mouse interaction
        let mouseX = p.ox
        let mouseY = p.oy

        if (mouse.current.active) {
          const dx = mouse.current.x - p.ox
          const dy = mouse.current.y - p.oy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 200

          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist
            mouseX -= dx * force * 0.5
            mouseY -= dy * force * 0.5
          }
        }

        p.x = mouseX + waveX
        p.y = mouseY + waveY

        // Draw dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => init()
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      mouse.current.active = true
    }
    const handleMouseLeave = () => {
      mouse.current.active = false
    }

    init()
    animate(0)

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
