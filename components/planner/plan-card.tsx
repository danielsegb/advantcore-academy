import React from "react"

interface PlanCardProps {
  type: string
  time: string
  title: string
  label: string
}

export function PlanCard({ type, time, title, label }: PlanCardProps) {
  return (
    <div className={`plan-card ${type}`}>
      <span>{time}</span>
      <strong>{title}</strong>
      <small>{label}</small>
    </div>
  )
}
