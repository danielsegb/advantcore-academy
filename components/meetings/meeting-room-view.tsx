"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  Radio, CalendarDays, Mic, MicOff, MonitorUp,
  Pause, Play, Volume2, VolumeX, ArrowRight, Video,
  Users, Check, FileText, X, AlertCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SectionTitle } from "@/components/shared/section-title"
import { buildGoogleCalendarUrl } from "@/components/shared/calendar-utils"
import { defaultTeam } from "@/components/dashboard/dashboard-view"
import { MeetingMinutesDialog } from "./meeting-minutes-dialog"
import { TranscriptExportDialog } from "./transcript-export-dialog"
import { RecordingConsentDialog } from "./recording-consent-dialog"
import { DocumentShareDialog, type SharedDocumentData } from "./document-share-dialog"
import type { TranscriptLine } from "@/components/shared/types"
import { useAuth } from "@/lib/auth/auth-context"

const APP_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/academy"

export const initialTranscript: TranscriptLine[] = [
  {
    speaker: "Sarah",
    role: "Project Sponsor",
    time: "10:00",
    text: "Good morning everyone. I've convened this scoping session to agree the boundaries for Advantcore's enquiry-to-delivery transformation [ADV-DOC-001]. What initial findings or documents do you have to present?"
  },
  {
    speaker: "Marcus",
    role: "BA Supervisor",
    time: "10:01",
    text: "Remember to separate observable symptoms from underlying root causes. Share your problem statement or ask any stakeholder questions."
  },
]

export function MeetingRoomView() {
  const { user } = useAuth()
  const [live, setLive] = useState(false)
  const [readAloud, setReadAloud] = useState(true)
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>(initialTranscript)
  const [message, setMessage] = useState("")
  const [thinking, setThinking] = useState(false)
  const [speakingCharacter, setSpeakingCharacter] = useState<string | null>(null)
  const [sharingScreen, setSharingScreen] = useState(false)
  const [sharedDocument, setSharedDocument] = useState<SharedDocumentData | null>(null)
  const [recording, setRecording] = useState(false)
  const [selectedSpeaker, setSelectedSpeaker] = useState("Marcus Cole")
  
  // Microphone & Speech Recognition state
  const [isListening, setIsListening] = useState(false)
  const isListeningRef = useRef(false)
  const [speechError, setSpeechError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const autoSendTimerRef = useRef<NodeJS.Timeout | null>(null)
  const currentTranscriptRef = useRef("")

  const recorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])

  const currentSpeakerObj = defaultTeam.find(p => p.name === selectedSpeaker) || defaultTeam[1]

  const activeUtterancesRef = useRef<SpeechSynthesisUtterance[]>([])
  const speechKeepAliveRef = useRef<number | null>(null)
  const askTeamRef = useRef<((explicitText?: string) => Promise<void>) | null>(null)

  // Speak aloud text helper with sentence chunking and Chrome keepalive
  function speakText(text: string, characterName?: string) {
    if (!readAloud || typeof window === "undefined" || !("speechSynthesis" in window)) return

    window.speechSynthesis.cancel()
    if (speechKeepAliveRef.current) {
      clearInterval(speechKeepAliveRef.current)
      speechKeepAliveRef.current = null
    }

    const cleanText = text
      .replace(/\[ADV-[^\]]+\]/g, "")
      .replace(/\[BCS-[^\]]+\]/g, "")
      .replace(/\[[A-Za-z0-9_-]*$/, "")
      .replace(/[*#_]/g, "")
      .trim()

    if (!cleanText) return

    // Split text into natural sentence chunks to prevent Chromium speech buffer cutoff
    const sentences = cleanText.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [cleanText]

    if (characterName) {
      setSpeakingCharacter(characterName)
    }

    const voices = window.speechSynthesis.getVoices()
    const ukVoice = voices.find(v => v.lang === "en-GB" || v.name.includes("UK") || v.name.includes("British"))

    activeUtterancesRef.current = []

    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim()
      if (!trimmed) return

      const utterance = new SpeechSynthesisUtterance(trimmed)
      utterance.rate = 0.98
      if (ukVoice) utterance.voice = ukVoice

      if (index === sentences.length - 1) {
        utterance.onend = () => {
          setSpeakingCharacter(null)
          if (speechKeepAliveRef.current) {
            clearInterval(speechKeepAliveRef.current)
            speechKeepAliveRef.current = null
          }
        }
        utterance.onerror = () => {
          setSpeakingCharacter(null)
          if (speechKeepAliveRef.current) {
            clearInterval(speechKeepAliveRef.current)
            speechKeepAliveRef.current = null
          }
        }
      }

      activeUtterancesRef.current.push(utterance)
      window.speechSynthesis.speak(utterance)
    })

    // Chrome keepalive interval to prevent speech engine sleeping during long playback
    speechKeepAliveRef.current = window.setInterval(() => {
      if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      } else if (speechKeepAliveRef.current) {
        clearInterval(speechKeepAliveRef.current)
        speechKeepAliveRef.current = null
      }
    }, 8000)
  }

  // Handle Meeting Start / Pause
  function toggleMeetingLive() {
    if (!live) {
      setLive(true)
      // Welcome speech from Sarah
      const welcomeLine: TranscriptLine = {
        speaker: "Sarah",
        role: "Project Sponsor",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: `Welcome ${user?.fullName ? user.fullName.split(" ")[0] : "Amanda"}. The floor is yours. Feel free to speak via your microphone, present a document, or ask questions to any stakeholder.`,
      }
      setTranscriptLines(prev => [...prev, welcomeLine])
      speakText(welcomeLine.text, "Sarah Mitchell")
    } else {
      setLive(false)
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
      setSpeakingCharacter(null)
    }
  }

  // Speech Recognition setup (Continuous mode + Auto-send on silence)
  useEffect(() => {
    if (typeof window === "undefined") return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-GB"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let fullTranscript = ""
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript + " "
      }
      const cleaned = fullTranscript.trim()
      if (cleaned) {
        currentTranscriptRef.current = cleaned
        setMessage(cleaned)

        // Reset auto-send silence timer
        if (autoSendTimerRef.current) {
          clearTimeout(autoSendTimerRef.current)
          autoSendTimerRef.current = null
        }

        // Auto-send after 2.2 seconds of silence if user has spoken a complete thought
        if (cleaned.length >= 6) {
          autoSendTimerRef.current = setTimeout(() => {
            if (isListeningRef.current) {
              const textToSend = currentTranscriptRef.current.trim()
              if (textToSend) {
                if (recognitionRef.current) {
                  try { recognitionRef.current.stop() } catch {}
                }
                setIsListening(false)
                isListeningRef.current = false
                currentTranscriptRef.current = ""
                askTeamRef.current?.(textToSend)
              }
            }
          }, 2200)
        }
      }
    }

    recognition.onerror = () => {
      // Ignore non-fatal aborts
    }

    recognition.onend = () => {
      // If user still intends to speak, restart continuous listening
      if (isListeningRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch {
          setIsListening(false)
          isListeningRef.current = false
        }
      } else {
        setIsListening(false)
        isListeningRef.current = false
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current)
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch {}
      }
    }
  }, [])

  function toggleMicrophone() {
    if (isListening) {
      if (autoSendTimerRef.current) {
        clearTimeout(autoSendTimerRef.current)
        autoSendTimerRef.current = null
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch {}
      }
      setIsListening(false)
      isListeningRef.current = false

      // Instant Auto-Send on mic button click if speech was captured
      const pendingMessage = (message.trim() || currentTranscriptRef.current.trim())
      if (pendingMessage.length > 0) {
        currentTranscriptRef.current = ""
        askTeamRef.current?.(pendingMessage)
      }
    } else {
      setSpeechError(null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRec) {
        setSpeechError("Speech recognition is not supported in this browser. Please type in the chat box.")
        setTimeout(() => setSpeechError(null), 5000)
        return
      }

      try {
        if (recognitionRef.current) {
          currentTranscriptRef.current = ""
          setMessage("")
          recognitionRef.current.start()
          setIsListening(true)
          isListeningRef.current = true
        }
      } catch {
        setIsListening(false)
        isListeningRef.current = false
      }
    }
  }

  // Share screen functionality
  async function shareScreen() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      setSharingScreen(true)
      stream.getVideoTracks()[0].addEventListener("ended", () => setSharingScreen(false))
    } catch {
      setSharingScreen(false)
    }
  }

  // Document sharing handler
  function handleShareDocument(doc: SharedDocumentData) {
    setSharedDocument(doc)
    const learnerName = user?.fullName ? user.fullName.split(" ")[0] : "Amanda"
    const announceLine: TranscriptLine = {
      speaker: "System",
      role: "Workspace",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: `📄 ${learnerName} presented document: "${doc.title}" (${doc.version})`,
    }
    setTranscriptLines(lines => [...lines, announceLine])

    // Trigger active stakeholder to review document
    if (live) {
      triggerDocumentReview(doc)
    }
  }

  function handleUnshareDocument() {
    if (sharedDocument) {
      const announceLine: TranscriptLine = {
        speaker: "System",
        role: "Workspace",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: `📄 Stopped presenting "${sharedDocument.title}"`,
      }
      setTranscriptLines(lines => [...lines, announceLine])
    }
    setSharedDocument(null)
  }

  // Trigger automatic AI review of shared document
  async function triggerDocumentReview(doc: SharedDocumentData) {
    setThinking(true)
    try {
      const response = await fetch(`${APP_BASE_PATH}/api/academy-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "meetingReply",
          character: {
            name: currentSpeakerObj.name,
            role: currentSpeakerObj.role,
          },
          project: {
            name: "Enquiry-to-delivery process transformation (ADV-BA-001)",
            company: "Advantcore Ltd",
            objective: "Reduce hand-off ambiguity and cycle time from 14 to 4 days.",
            stage: "Discovery",
          },
          sharedDocument: {
            title: doc.title,
            deliverable: doc.deliverable,
            content: doc.content,
          },
          message: "",
        }),
      })

      const result = (await response.json()) as { text?: string }
      const reply = result.text || `I see ${doc.title} on screen. Let us review how this addresses our 14-day cycle time baseline [ADV-DOC-001].`
      const speakerShort = currentSpeakerObj.name.split(" ")[0]
      const replyLine: TranscriptLine = {
        speaker: speakerShort,
        role: currentSpeakerObj.role,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: reply,
      }
      setTranscriptLines(lines => [...lines, replyLine])
      speakText(reply, currentSpeakerObj.name)
    } catch {
      // ignore
    } finally {
      setThinking(false)
    }
  }

  // Send message from user to team (supports text input or hands-free voice)
  async function askTeam(explicitText?: string) {
    const userMessage = (explicitText ?? message).trim()
    if (!userMessage || thinking) return
    setMessage("")
    currentTranscriptRef.current = ""
    setThinking(true)
    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
      setIsListening(false)
      isListeningRef.current = false
    }

    const learnerName = user?.fullName ? user.fullName.split(" ")[0] : "Amanda"
    const userLine: TranscriptLine = {
      speaker: learnerName,
      role: "Business Analyst",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: userMessage,
    }

    setTranscriptLines(lines => [...lines, userLine])

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
          sharedDocument: sharedDocument
            ? {
                title: sharedDocument.title,
                deliverable: sharedDocument.deliverable,
                content: sharedDocument.content,
              }
            : undefined,
          message: userMessage,
        }),
      })

      const result = (await response.json()) as { text?: string }
      let reply = result.text || "I understand. Let us review how this addresses the project baseline [ADV-DOC-001]."
      // Sanitize any trailing unclosed brackets or punctuation
      reply = reply.replace(/\[[A-Za-z0-9_-]*$/, "").trim()
      if (!/[.!?)"']$/.test(reply)) {
        reply = reply.replace(/[,;:\-\s]+$/, "") + "."
      }

      const speakerShort = currentSpeakerObj.name.split(" ")[0]
      const replyLine: TranscriptLine = {
        speaker: speakerShort,
        role: currentSpeakerObj.role,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: reply,
      }
      setTranscriptLines(lines => [...lines, replyLine])
      speakText(reply, currentSpeakerObj.name)
    } catch {
      setTranscriptLines(lines => [
        ...lines,
        {
          speaker: currentSpeakerObj.name.split(" ")[0],
          role: currentSpeakerObj.role,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "I could not reach the live AI service. Record the question in your meeting notes.",
        },
      ])
    } finally {
      setThinking(false)
    }
  }

  useEffect(() => {
    askTeamRef.current = askTeam
  })

  // Screen recording
  async function startRecordingDirectly() {
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

  function stopRecordingDirectly() {
    if (recorder.current) {
      recorder.current.stop()
      setRecording(false)
    }
  }

  return (
    <div className="page-stack meeting-page">
      <SectionTitle
        eyebrow="Meeting room"
        title="Project scoping meeting"
        copy="A context-aware simulation with spoken responses, live transcript, microphone voice capture, document sharing, and grounded project stakeholders."
        actions={
          <>
            <Badge className={live ? "live-badge" : "scheduled-badge"}>
              <Radio className={live ? "animate-pulse text-red-500" : ""} /> {live ? "Live now" : "Ready to start"}
            </Badge>
            <Button variant="outline" asChild>
              <a
                href={buildGoogleCalendarUrl("Project scoping meeting", "Advantcore Academy virtual BA workplace meeting", 48)}
                target="_blank"
                rel="noreferrer"
              >
                <CalendarDays className="w-4 h-4 mr-1" /> Add to Google
              </a>
            </Button>
          </>
        }
      />

      <section className="meeting-stage">
        <div className="meeting-video-area">
          {/* Main Stage Grid or Document Presentation */}
          {sharedDocument ? (
            <div className="flex-1 flex flex-col gap-3">
              {/* Document Header Bar */}
              <div className="p-3 bg-card border rounded-xl flex items-center justify-between text-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-sm leading-none">{sharedDocument.title}</h3>
                    <span className="text-[11px] text-muted-foreground">
                      Presented by {sharedDocument.author} · {sharedDocument.version} · {sharedDocument.deliverable}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DocumentShareDialog
                    currentSharedDoc={sharedDocument}
                    onShareDocument={handleShareDocument}
                    onUnshareDocument={handleUnshareDocument}
                  />
                  <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" onClick={handleUnshareDocument}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Document Content Scroll View */}
              <div className="flex-1 min-h-[300px] max-h-[380px] p-5 bg-background border rounded-xl overflow-y-auto text-xs leading-relaxed font-sans text-foreground whitespace-pre-wrap">
                {sharedDocument.content}
              </div>

              {/* Participant Bar below presented doc */}
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {defaultTeam.map(p => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setSelectedSpeaker(p.name)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all ${p.name === selectedSpeaker ? "ring-2 ring-primary bg-primary/20 text-white" : "bg-card/60 text-muted-foreground hover:bg-card"}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${p.colour}`}>
                      {p.initials}
                    </span>
                    <span>{p.name.split(" ")[0]} ({p.role.split(" ")[0]})</span>
                    {speakingCharacter === p.name && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="video-grid">
              {defaultTeam.map(p => (
                <button
                  type="button"
                  className={`video-tile text-left cursor-pointer transition-all ${p.name === selectedSpeaker ? "ring-2 ring-primary" : ""} ${speakingCharacter === p.name ? "speaking ring-2 ring-emerald-400" : ""}`}
                  key={p.name}
                  onClick={() => setSelectedSpeaker(p.name)}
                >
                  <span className={`avatar video-avatar ${p.colour}`}>{p.initials}</span>
                  <div className="voice-wave"><i /><i /><i /><i /></div>
                  <span className="video-name">{p.name}<small>{p.role}</small></span>
                  <Mic className={speakingCharacter === p.name ? "text-emerald-400 animate-pulse" : ""} />
                </button>
              ))}
              <div className={`video-tile self ${isListening ? "ring-2 ring-red-500 bg-red-950/20" : ""}`}>
                <span className="avatar video-avatar user">{user?.fullName ? user.fullName[0] : "A"}</span>
                <span className="video-name">{user?.fullName || "Amanda Okafor"}<small>You · Business Analyst</small></span>
                {isListening ? (
                  <span className="absolute top-2 right-2 flex items-center gap-1 bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded text-[9px] font-bold animate-pulse">
                    <Mic className="w-3 h-3 text-red-400" /> Speaking...
                  </span>
                ) : (
                  <MicOff />
                )}
              </div>
              <div className="video-tile share-tile">
                <FileText className="w-8 h-8 text-primary opacity-80" />
                <strong>Present Document</strong>
                <span>Share a Problem Statement, Charter, Process Map or Business Case</span>
                <DocumentShareDialog
                  currentSharedDoc={sharedDocument}
                  onShareDocument={handleShareDocument}
                  onUnshareDocument={handleUnshareDocument}
                />
              </div>
            </div>
          )}

          {/* Meeting Bottom Controls */}
          <div className="meeting-controls">
            <button
              className={`round-control transition-all ${isListening ? "bg-red-600 text-white ring-4 ring-red-500/40 animate-pulse" : ""}`}
              onClick={toggleMicrophone}
              aria-label={isListening ? "Mute Microphone" : "Unmute Microphone"}
              title={isListening ? "Click to stop listening" : "Click to speak with your voice"}
            >
              {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
            </button>
            <button className="round-control" aria-label="Toggle Video"><Video /></button>
            <button
              className={`round-control ${sharingScreen ? "active" : ""}`}
              onClick={shareScreen}
              aria-label="Toggle Screen Share"
              title="Share external desktop screen"
            >
              <MonitorUp />
            </button>
            <DocumentShareDialog
              currentSharedDoc={sharedDocument}
              onShareDocument={handleShareDocument}
              onUnshareDocument={handleUnshareDocument}
            />
            <RecordingConsentDialog
              recording={recording}
              onStartRecording={startRecordingDirectly}
              onStopRecording={stopRecordingDirectly}
            />
            <button
              className={`end-control ${live ? "pause" : ""}`}
              onClick={toggleMeetingLive}
            >
              {live ? <Pause /> : <Play />}
              {live ? "Pause simulation" : "Start meeting"}
            </button>
          </div>
          {speechError && (
            <p className="text-[11px] text-amber-400 text-center mt-2 flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {speechError}
            </p>
          )}
        </div>

        {/* Live Conversation Transcript Panel */}
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
              title={readAloud ? "Spoken audio ON" : "Spoken audio MUTED"}
            >
              {readAloud ? <Volume2 className="text-primary" /> : <VolumeX className="text-muted-foreground" />}
            </button>
          </div>

          <div className="transcript-scroll">
            {transcriptLines.map((l, index) => (
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
            {thinking && (
              <div className="typing">
                <i /><i /><i />
                <span>{currentSpeakerObj.name} is reviewing and thinking…</span>
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

          {/* User Message / Voice Input Form */}
          <div className="p-2 border-t bg-muted/10 space-y-1.5">
            {isListening && (
              <div className="px-2 py-1 bg-red-500/10 border border-red-500/30 rounded text-[11px] text-red-500 font-semibold flex items-center justify-between animate-pulse">
                <span className="flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" /> Speaking into microphone...
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Auto-sends on 2s pause or tap mic
                </span>
              </div>
            )}
            <div className="meeting-message flex items-center gap-1.5 p-1 border rounded-lg bg-card">
              <button
                type="button"
                className={`p-2 rounded-md transition-all ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={toggleMicrophone}
                title={isListening ? "Listening (tap to finish & send)" : "Speak via microphone (auto-sends on pause)"}
                aria-label="Toggle Microphone"
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                value={message}
                onChange={event => setMessage(event.target.value)}
                onKeyDown={event => {
                  if (event.key === "Enter") askTeam()
                }}
                placeholder={isListening ? "Listening to your voice..." : `Ask ${currentSpeakerObj.name.split(" ")[0]}…`}
                className="flex-1 bg-transparent text-base sm:text-xs text-foreground placeholder:text-muted-foreground focus:outline-none px-1"
                aria-label="Message the AI project team"
              />
              <Button
                size="sm"
                className="primary-action shrink-0 h-8 w-8 p-0"
                onClick={() => askTeam()}
                disabled={!message.trim() || thinking}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="transcript-footer flex gap-2">
            <TranscriptExportDialog transcript={transcriptLines} />
            <MeetingMinutesDialog transcript={transcriptLines} />
          </div>
        </aside>
      </section>

      <section className="meeting-prep panel">
        <div>
          <p className="eyebrow">Meeting brief</p>
          <h2>Your objective</h2>
          <p>Clarify the business problem, agree a realistic discovery scope, present your initial document, and secure access to the right evidence.</p>
        </div>
        <div className="agenda-list">
          <span><Check /> Confirm desired outcomes</span>
          <span><Check /> Present draft deliverable</span>
          <span><Check /> Test project assumptions</span>
        </div>
        <div className="meeting-score">
          <strong>Preparation score</strong>
          <Progress value={sharedDocument ? 95 : 75} />
          <span>{sharedDocument ? "95% · Document Presented" : "75% · Ready"}</span>
        </div>
      </section>
    </div>
  )
}
