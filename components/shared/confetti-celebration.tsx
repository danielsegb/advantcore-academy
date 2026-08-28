"use client"

import React, { useEffect, useRef } from "react"

interface ConfettiCelebrationProps {
  active: boolean
  durationMs?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  vRot: number
  alpha: number
  shape: "rect" | "circle" | "star"
}

export function ConfettiCelebration({ active, durationMs = 3000 }: ConfettiCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ["#0f766e", "#14b8a6", "#f59e0b", "#3b82f6", "#10b981", "#ec4899", "#8b5cf6", "#fbbf24"]
    const particles: Particle[] = []

    // Spawn 120 particles from top-center and side cannons
    for (let i = 0; i < 120; i++) {
      const angle = (Math.random() * Math.PI) - Math.PI / 2
      const speed = 4 + Math.random() * 9
      particles.push({
        x: canvas.width / 2 + (Math.random() * 200 - 100),
        y: canvas.height * 0.25,
        vx: Math.sin(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.cos(angle) * speed - (2 + Math.random() * 4),
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        alpha: 1,
        shape: Math.random() > 0.7 ? "star" : Math.random() > 0.4 ? "circle" : "rect",
      })
    }

    const startTime = Date.now()

    function render() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / durationMs, 1)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.22 // gravity
        p.vx *= 0.98 // air resistance
        p.rotation += p.vRot
        p.alpha = Math.max(0, 1 - progress * 1.2)

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5)
        } else if (p.shape === "circle") {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Star shape
          ctx.beginPath()
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size, -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size)
            ctx.lineTo(Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size / 2), -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size / 2))
          }
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(render)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [active, durationMs])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  )
}
