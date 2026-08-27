import React from "react"

interface SectionTitleProps {
  eyebrow: string
  title: string
  copy: string
  actions?: React.ReactNode
}

export function SectionTitle({ eyebrow, title, copy, actions }: SectionTitleProps) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="section-copy">{copy}</p>
      </div>
      {actions && <div className="heading-actions">{actions}</div>}
    </div>
  )
}
