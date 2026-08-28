"use client"

import React from "react"
import { CheckCircle2, AlertCircle, Info, ChevronRight } from "lucide-react"

interface RichMarkdownViewerProps {
  content: string
  className?: string
}

export function RichMarkdownViewer({ content, className = "" }: RichMarkdownViewerProps) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []

  let inTable = false
  let tableHeader: string[] = []
  let tableRows: string[][] = []

  let inCodeBlock = false
  let codeContent: string[] = []

  function flushTable(key: string) {
    if (tableHeader.length > 0 || tableRows.length > 0) {
      elements.push(
        <div key={key} className="overflow-x-auto my-3 rounded-lg border border-border/80 bg-card">
          <table className="w-full text-xs text-left border-collapse">
            {tableHeader.length > 0 && (
              <thead className="bg-muted/60 border-b border-border text-foreground font-semibold">
                <tr>
                  {tableHeader.map((th, i) => (
                    <th key={i} className="p-2.5 px-3">{th.trim()}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-border/40 hover:bg-muted/20">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2.5 px-3 text-muted-foreground">{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      tableHeader = []
      tableRows = []
      inTable = false
    }
  }

  function flushCode(key: string) {
    if (codeContent.length > 0) {
      elements.push(
        <div key={key} className="my-3 p-3.5 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800 leading-relaxed shadow-sm">
          {codeContent.join("\n")}
        </div>
      )
      codeContent = []
      inCodeBlock = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Code blocks
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCode(`code-${i}`)
      } else {
        if (inTable) flushTable(`table-${i}`)
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeContent.push(line)
      continue
    }

    // Markdown Tables
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const parts = line.trim().slice(1, -1).split("|")
      // Check if separator line (|---|---|)
      if (parts.every(p => p.trim().match(/^:?-+:?$/))) {
        // separator line, skip
        continue
      }
      if (!inTable) {
        inTable = true
        tableHeader = parts
      } else {
        tableRows.push(parts)
      }
      continue
    } else if (inTable) {
      flushTable(`table-${i}`)
    }

    // Headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-xl sm:text-2xl font-bold text-foreground mt-4 mb-2 pb-1.5 border-b border-border">
          {line.replace("# ", "")}
        </h1>
      )
      continue
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-base sm:text-lg font-bold text-foreground mt-4 mb-2 flex items-center gap-1.5 text-primary">
          <ChevronRight className="w-4 h-4 text-primary shrink-0" />
          {line.replace("## ", "")}
        </h2>
      )
      continue
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-sm sm:text-base font-semibold text-foreground mt-3 mb-1.5">
          {line.replace("### ", "")}
        </h3>
      )
      continue
    }

    // Callout Blocks (> [!IMPORTANT], > [!NOTE], > [!TIP])
    if (line.startsWith("> [!IMPORTANT]") || line.startsWith("> [!WARNING]")) {
      elements.push(
        <div key={i} className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 my-2 text-xs flex items-start gap-2 text-amber-700 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="font-semibold">{line.replace(/^>\s*\[!.*?\]\s*/, "Important Notice:")}</div>
        </div>
      )
      continue
    }
    if (line.startsWith("> [!NOTE]") || line.startsWith("> [!TIP]")) {
      elements.push(
        <div key={i} className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/5 my-2 text-xs flex items-start gap-2 text-blue-700 dark:text-blue-300">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="font-semibold">{line.replace(/^>\s*\[!.*?\]\s*/, "Guidance & Notes:")}</div>
        </div>
      )
      continue
    }
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-primary/50 pl-3 my-2 text-xs text-muted-foreground italic">
          {line.replace(/^>\s*/, "")}
        </blockquote>
      )
      continue
    }

    // Checklists (- [x], - [ ])
    if (line.trim().startsWith("- [x] ") || line.trim().startsWith("- [X] ")) {
      elements.push(
        <div key={i} className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 my-1 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{line.trim().slice(6)}</span>
        </div>
      )
      continue
    }
    if (line.trim().startsWith("- [ ] ")) {
      elements.push(
        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground my-1">
          <div className="w-3.5 h-3.5 rounded border border-muted-foreground/50 shrink-0" />
          <span>{line.trim().slice(6)}</span>
        </div>
      )
      continue
    }

    // Bullet points
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      elements.push(
        <li key={i} className="text-xs text-muted-foreground ml-4 list-disc my-0.5 leading-relaxed">
          {formatInline(line.trim().slice(2))}
        </li>
      )
      continue
    }

    // Horizontal Rules
    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(<hr key={i} className="my-3 border-border/60" />)
      continue
    }

    // Empty lines
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-1.5" />)
      continue
    }

    // Regular paragraphs
    elements.push(
      <p key={i} className="text-xs text-muted-foreground leading-relaxed my-1">
        {formatInline(line)}
      </p>
    )
  }

  if (inTable) flushTable("table-end")
  if (inCodeBlock) flushCode("code-end")

  return <div className={`rich-markdown-body space-y-0.5 ${className}`}>{elements}</div>
}

function formatInline(text: string): React.ReactNode {
  // Bold & Italic inline formatting
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic text-foreground/90">{part.slice(1, -1)}</em>
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="px-1 py-0.5 rounded bg-muted text-primary font-mono text-[11px]">{part.slice(1, -1)}</code>
    }
    return part
  })
}
