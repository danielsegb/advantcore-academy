"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  Radio, CalendarDays, Mic, MicOff, MonitorUp, Square, CircleDot,
  Pause, Play, Volume2, VolumeX, ArrowRight, Download, WandSparkles, Check, Video,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SectionTitle } from "@/components/shared/section-title"
import { buildGoogleCalendarUrl } from "@/components/shared/calendar-utils"
import { defaultTeam } from "@/components/dashboard/dashboard-view"
import type { TranscriptLine } from "@/components/shared/types"
import { useAuth } from "@/lib/auth/auth-context"

const APP_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/academy"

export const initialTranscript: TranscriptLine[] = [
  { speaker: "Sarah", role: "Project Sponsor", time: "10:02", text: "Morning, Amanda. Today I want us to agree the scope for improving Advantcore's enquiry-to-delivery process. What do you see as the core business problem?" },
  { speaker: "Marcus", role: "BA Supervisor", time: "10:03", text: "Before proposing a solution, separate the symptoms from the underlying cause [ADV-DOC-001]. Talk us through the evidence you would seek." },
  { speaker: "Amanda", role: "Business Analyst", time: "10:04", text: "I would validate where enquiries are lost, how hand-offs are recorded, who owns each stage, and what information is missing when work reaches delivery." },
  { speaker: "Priya", role: "Operations Lead", time: "10:05", text: "That reflects our experience. We currently use email and separate spreadsheets [ADV-SOP-002], so ownership becomes unclear after qualification." },
  { speaker: "Helen", role: "Independent Reviewer", time: "10:06", text: "Good start. Your next step should define measurable success [BCS-BA-001] and record any assumptions that still need stakeholder validation." },
]

export function MeetingRoomView() {
  const { user } = useAuth()
  const [live, setLive] = useState(false)
  const [readAloud, setReadAloud] = useState(true)
  const [visible, setVisible] = useState(2)
  const [customLines, setCustomLines] = useState<TranscriptLine[]>([])
  const [message, setMessage] = useState("")
  const [thinking, setThinking] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [recording, setRecording] = useState(false)
  const [selectedSpeaker, setSelectedSpeaker] = useState("Marcus Cole")
  const recorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])

  const currentSpeakerObj = defaultTeam.find(p => p.name === selectedSpeaker) || defaultTeam[1]

  useEffect(() => {
    if (!live || visible >= initialTranscript.length) return
    const timer = window.setTimeout(() => {
      const next = initialTranscript[visible]
      setVisible(v => v + 1)
      if (readAloud && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
        const speech = new SpeechSynthesisUtterance(next.text)
        speech.rate = 0.98
        window.speechSynthesis.speak(speech)
      }
    }, 4200)
    return () => window.clearTimeout(timer)
  }, [live, visible, readAloud])

  async function shareScreen() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      setSharing(true)
      stream.getVideoTracks()[0].addEventListener("ended", () => setSharing(false))
    } catch {
      setSharing(false)
    }
  }

  async function toggleRecording() {
    if (recording && recorder.current) {
      recorder.current.stop()
      setRecording(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      const r = new MediaRecorder(stream)
      chunks.current = []
      r.ondataavailable = e => chunks.current.push(e.data)
      r.onstop = () => {
        const url = URL.createObjectURL(new Blob(chunks.current, { type: r.mimeType }))
        const a = document.createElement("a")
        a.href = url
        a.download = "advantcore-meeting-recording.webm"
        a.click()
        URL.revokeObjectURL(url)
        stream.getTracks().forEach(t => t.stop())
      }
      r.start()
      recorder.current = r
      setRecording(true)
    } catch {
      setRecording(false)
    }
  }

  async function askTeam() {
    const userMessage = message.trim()
    if (!userMessage || thinking) return
    setMessage("")
    setThinking(true)
    const learnerName = user?.fullName || "Amanda"

    setCustomLines(lines => [
      ...lines,
      { speaker: learnerName, role: "Business Analyst", time: "Now", text: userMessage },
    ])

    try {
      const response = await fetch(`${APP_BASE_PATH}/api/academy-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "meetingReply",
          character: {
            name: currentSpeakerObj.name,
            role: currentSpeakerObj.role,
            behaviour: currentSpeakerObj.role === "BA Supervisor"
              ? "Coach through questions, challenge unsupported assumptions and protect professional standards."
              : "Provide realistic workplace stakeholder feedback.",
          },
          project: {
            name: "Enquiry-to-delivery process transformation (ADV-BA-001)",
            company: "Advantcore Ltd",
            objective: "Reduce hand-off ambiguity and reduce delivery cycle time from 14 to 4 days.",
            stage: "Discovery",
          },
          message: userMessage,
        }),
      })

      const result = (await response.json()) as { text?: string }
      const reply = result.text || "I need more project context before I can answer that reliably."
      setCustomLines(lines => [
        ...lines,
        { speaker: currentSpeakerObj.name.split(" ")[0], role: currentSpeakerObj.role, time: "Now", text: reply },
      ])
      if (readAloud && "speechSynthesis" in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(reply))
      }
    } catch {
      setCustomLines(lines => [
        ...lines,
        {
          speaker: currentSpeakerObj.name.split(" ")[0],
          role: currentSpeakerObj.role,
          time: "Now",
          text: "I could not reach the AI service. Record the question in your notes and continue with the approved meeting evidence.",
        },
      ])
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className="page-stack meeting-page">
      <SectionTitle
        eyebrow="AI meeting room"
        title="Project scoping meeting"
        copy="A context-aware simulation with spoken responses, live transcript, and document-grounded AI characters."
        actions={
          <>
            <Badge className={live ? "live-badge" : "scheduled-badge"}>
              <Radio /> {live ? "Live now" : "Ready to start"}
            </Badge>
            <Button variant="outline" asChild>
              <a
                href={buildGoogleCalendarUrl("Project scoping meeting", "Advantcore Academy virtual BA workplace meeting", 48)}
                target="_blank"
                rel="noreferrer"
              >
                <CalendarDays /> Add to Google
              </a>
            </Button>
          </>
        }
      />

      <section className="meeting-stage">
        <div className="meeting-video-area">
          <div className="video-grid">
            {defaultTeam.map((p, i) => (
              <button
                type="button"
                className={`video-tile text-left cursor-pointer transition-all ${p.name === selectedSpeaker ? "ring-2 ring-primary" : ""} ${live && i === visible % 4 ? "speaking" : ""}`}
                key={p.name}
                onClick={() => setSelectedSpeaker(p.name)}
              >
                <span className={`avatar video-avatar ${p.colour}`}>{p.initials}</span>
                <div className="voice-wave"><i /><i /><i /><i /></div>
                <span className="video-name">{p.name}<small>{p.role}</small></span>
                <Mic />
              </button>
            ))}
            <div className="video-tile self">
              <span className="avatar video-avatar user">{user?.fullName ? user.fullName[0] : "A"}</span>
              <span className="video-name">{user?.fullName || "Amanda Okafor"}<small>You · Business Analyst</small></span>
              <MicOff />
            </div>
            <div className="video-tile share-tile">
              <MonitorUp />
              <strong>{sharing ? "Your screen is being shared" : "Share project evidence"}</strong>
              <span>{sharing ? "Return here when ready" : "Present a document, process map or slide deck"}</span>
              <Button size="sm" variant="outline" onClick={shareScreen}>
                {sharing ? "Sharing" : "Select screen"}
              </Button>
            </div>
          </div>

          <div className="meeting-controls">
            <button className="round-control" aria-label="Toggle Microphone"><Mic /></button>
            <button className="round-control" aria-label="Toggle Video"><Video /></button>
            <button
              className={`round-control ${sharing ? "active" : ""}`}
              onClick={shareScreen}
              aria-label="Toggle Screen Share"
            >
              <MonitorUp />
            </button>
            <button
              className={`round-control ${recording ? "recording" : ""}`}
              onClick={toggleRecording}
              aria-label={recording ? "Stop Recording" : "Start Recording"}
            >
              {recording ? <Square /> : <CircleDot />}
            </button>
            <button
              className={`end-control ${live ? "pause" : ""}`}
              onClick={() => setLive(v => !v)}
            >
              {live ? <Pause /> : <Play />}
              {live ? "Pause simulation" : "Start meeting"}
            </button>
          </div>
        </div>

        <aside className="transcript-panel">
          <div className="transcript-header">
            <div>
              <p className="eyebrow">Live transcript</p>
              <h2>Conversation</h2>
            </div>
            <button
              className="icon-button"
              onClick={() => setReadAloud(v => !v)}
              aria-label={readAloud ? "Mute speech" : "Enable speech"}
            >
              {readAloud ? <Volume2 /> : <VolumeX />}
            </button>
          </div>

          <div className="transcript-scroll">
            {[...initialTranscript.slice(0, visible), ...customLines].map((l, index) => (
              <div className="transcript-line" key={`${l.time}-${l.speaker}-${index}`}>
                <span className="transcript-avatar">{l.speaker[0]}</span>
                <div>
                  <div>
                    <strong>{l.speaker}</strong>
                    <small>{l.time}</small>
                  </div>
                  <span>{l.role}</span>
                  <p>{l.text}</p>
                </div>
              </div>
            ))}
            {((live && visible < initialTranscript.length) || thinking) && (
              <div className="typing">
                <i /><i /><i />
                <span>{thinking ? `${currentSpeakerObj.name} is thinking` : `${initialTranscript[visible]?.speaker || "Character"} is responding`}</span>
              </div>
            )}
          </div>

          {/* Character Target Selector */}
          <div className="px-3 py-1.5 border-t bg-muted/20 flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Directing to:
            </span>
            <select
              value={selectedSpeaker}
              onChange={e => setSelectedSpeaker(e.target.value)}
              className="px-2 py-0.5 text-xs font-semibold rounded bg-background border"
            >
              {defaultTeam.map(p => (
                <option key={p.name} value={p.name}>{p.name} ({p.role})</option>
              ))}
            </select>
          </div>

          <div className="meeting-message">
            <input
              value={message}
              onChange={event => setMessage(event.target.value)}
              onKeyDown={event => {
                if (event.key === "Enter") askTeam()
              }}
              placeholder={`Ask ${currentSpeakerObj.name.split(" ")[0]}…`}
              aria-label="Message the AI project team"
            />
            <Button size="sm" className="primary-action" onClick={askTeam} disabled={!message.trim() || thinking}>
              <ArrowRight />
            </Button>
          </div>

          <div className="transcript-footer">
            <Button variant="outline">
              <Download /> Transcript
            </Button>
            <Button className="primary-action">
              <WandSparkles /> Generate minutes
            </Button>
          </div>
        </aside>
      </section>

      <section className="meeting-prep panel">
        <div>
          <p className="eyebrow">Meeting brief</p>
          <h2>Your objective</h2>
          <p>Clarify the business problem, agree a realistic discovery scope and secure access to the right evidence.</p>
        </div>
        <div className="agenda-list">
          <span><Check /> Confirm desired outcomes</span>
          <span><Check /> Test project assumptions</span>
          <span><Check /> Agree success measures</span>
        </div>
        <div className="meeting-score">
          <strong>Preparation score</strong>
          <Progress value={82} />
          <span>82% · Ready</span>
        </div>
      </section>
    </div>
  )
}
