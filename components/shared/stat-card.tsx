import React from "react"

interface StatCardProps {
  icon: React.ElementType
  value: string | number
  label: string
  detail: string
  tone: string
}

export function StatCard({ icon: Icon, value, label, detail, tone }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`} aria-hidden="true">
        <Icon />
      </div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        <small>{detail}</small>
      </div>
    </article>
  )
}
