"use client"

import React, { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-card rounded-xl border border-destructive/20 my-4 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-destructive/10 text-destructive mb-2">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {this.props.fallbackTitle || "Something went wrong in this section"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            An unexpected error occurred. Please try reloading this component.
          </p>
          <Button variant="outline" onClick={this.handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" /> Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
