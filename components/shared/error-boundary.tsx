"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by Academy ErrorBoundary:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-6 border rounded-2xl bg-card shadow-xs space-y-4">
            <div className="inline-flex p-3 rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold">Something went wrong</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                An unexpected interface error occurred. Your progress and saved evidence remain secure.
              </p>
            </div>
            {this.state.error && (
              <div className="p-2.5 rounded bg-muted/40 text-[11px] font-mono text-muted-foreground text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <Button className="primary-action w-full" onClick={this.handleReset}>
              <RefreshCw className="w-4 h-4 mr-1.5" /> Reload view
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
