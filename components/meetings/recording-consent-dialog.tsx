"use client"

import React, { useState } from "react"
import { CircleDot, ShieldAlert, Square, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

interface RecordingConsentDialogProps {
  recording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
}

export function RecordingConsentDialog({
  recording,
  onStartRecording,
  onStopRecording,
}: RecordingConsentDialogProps) {
  const [open, setOpen] = useState(false)
  const [consentConfirmed, setConsentConfirmed] = useState(false)

  function handleConfirm() {
    setOpen(false)
    onStartRecording()
  }

  if (recording) {
    return (
      <button
        className="round-control recording"
        onClick={onStopRecording}
        aria-label="Stop Recording"
        title="Stop Recording"
      >
        <Square className="w-4 h-4" />
      </button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="round-control"
          aria-label="Start Recording"
          title="Start Recording"
        >
          <CircleDot className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="inline-flex p-3 rounded-full bg-destructive/10 text-destructive w-fit mb-1">
            <Video className="w-6 h-6" />
          </div>
          <DialogTitle>Meeting Recording Notice & Consent</DialogTitle>
          <DialogDescription>
            You are about to record this virtual project scoping session for educational review and portfolio synthesis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg space-y-1">
            <strong className="text-amber-600 flex items-center gap-1 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" /> Privacy & Local Storage Notice:
            </strong>
            <p className="text-muted-foreground">
              To protect learner data and confidential project discussions, meeting recordings are processed locally in your browser and saved directly to your device as a WebM file. Recordings are not stored on external public servers.
            </p>
          </div>

          <label className="flex items-start gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={consentConfirmed}
              onChange={e => setConsentConfirmed(e.target.checked)}
              className="mt-0.5 rounded"
            />
            <span className="text-muted-foreground text-xs">
              I acknowledge that this session is recorded for training purposes and will be saved locally.
            </span>
          </label>
        </div>

        <DialogFooter className="flex justify-between items-center w-full pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="primary-action bg-destructive hover:bg-destructive/90 text-white"
            disabled={!consentConfirmed}
            onClick={handleConfirm}
          >
            Start recording
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
