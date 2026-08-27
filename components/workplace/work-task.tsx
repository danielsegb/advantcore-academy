import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface WorkTaskProps {
  icon: React.ReactNode
  title: string
  copy: string
  action: string
  state?: string
  onClick?: () => void
}

export function WorkTask({ icon, title, copy, action, state = "", onClick }: WorkTaskProps) {
  return (
    <div className={`work-task ${state}`}>
      <span>{icon}</span>
      <div>
        <strong>{title}</strong>
        <small>{copy}</small>
        {state === "active" && <Progress value={65} />}
      </div>
      {onClick ? (
        <Button size="sm" variant="outline" onClick={onClick}>
          {action}
        </Button>
      ) : (
        <Badge variant={state === "done" ? "default" : "outline"}>
          {action}
        </Badge>
      )}
    </div>
  )
}
