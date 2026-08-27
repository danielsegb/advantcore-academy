import React from "react"
import type { Tone } from "./types"

interface ReadinessRingProps {
  value: number
  label: string
  tone?: Tone
}

export function ReadinessRing({ value, label, tone = "mint" }: ReadinessRingProps) {
  return (
    <div
      className={`readiness-ring ${tone}`}
      style={{ "--value": `${value * 3.6}deg` } as React.CSSProperties}
      aria-label={`${label} readiness: ${value}%`}
    >
      <div>
        <strong>{value}%</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}
