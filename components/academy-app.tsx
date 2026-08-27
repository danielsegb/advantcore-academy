"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Activity, ArrowRight, Bell, BookOpen, BriefcaseBusiness, CalendarDays,
  Check, CheckCircle2, ChevronRight, CircleDot, ClipboardCheck, Clock3,
  Download, FileText, Gauge, GraduationCap, LayoutDashboard, LibraryBig,
  ListChecks, MessageSquareText, Mic, MicOff, MonitorUp, MoreHorizontal,
  Pause, Play, Plus, Radio, RefreshCw, Search, Settings, ShieldCheck,
  Sparkles, Square, Target, UploadCloud, UserCheck, Users, Video,
  Volume2, VolumeX, WandSparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuBadge,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail,
  SidebarSeparator, SidebarTrigger,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type View = "dashboard" | "learning" | "workplace" | "meetings" | "calendar" | "admin"
type Tone = "mint" | "navy" | "gold"
const APP_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/academy"

const navItems = [
  { id: "dashboard" as View, label: "Home", icon: LayoutDashboard },
  { id: "learning" as View, label: "Learning studio", icon: GraduationCap },
  { id: "workplace" as View, label: "Workplace", icon: BriefcaseBusiness },
  { id: "meetings" as View, label: "Meeting room", icon: Video, badge: "1" },
  { id: "calendar" as View, label: "Plan & calendar", icon: CalendarDays, badge: "3" },
]

const team = [
  { name: "Sarah Mitchell", role: "Project Sponsor", initials: "SM", colour: "coral" },
  { name: "Marcus Cole", role: "BA Supervisor", initials: "MC", colour: "blue" },
  { name: "Priya Shah", role: "Operations Lead", initials: "PS", colour: "violet" },
  { name: "Helen Grant", role: "Independent Reviewer", initials: "HG", colour: "gold" },
]

const transcript = [
  { speaker: "Sarah", role: "Project Sponsor", time: "10:02", text: "Morning, Daniel. Today I want us to agree the scope for improving Advantcore's enquiry-to-delivery process. What do you see as the core business problem?" },
  { speaker: "Marcus", role: "BA Supervisor", time: "10:03", text: "Before proposing a solution, separate the symptoms from the underlying cause. Talk us through the evidence you would seek." },
  { speaker: "Daniel", role: "Business Analyst", time: "10:04", text: "I would validate where enquiries are lost, how hand-offs are recorded, who owns each stage, and what information is missing when work reaches delivery." },
  { speaker: "Priya", role: "Operations Lead", time: "10:05", text: "That reflects our experience. We currently use email and separate spreadsheets, so ownership becomes unclear after qualification." },
  { speaker: "Helen", role: "Independent Reviewer", time: "10:06", text: "Good start. Your next step should define measurable success and record any assumptions that still need stakeholder validation." },
]

const modules = [
  ["01", "Business analysis foundations", 100, "done"],
  ["02", "Strategy analysis", 100, "done"],
  ["03", "Stakeholder analysis", 72, "active"],
  ["04", "Business systems modelling", 0, "locked"],
  ["05", "Requirements engineering", 0, "locked"],
  ["06", "Business cases", 0, "locked"],
] as const

function formatGoogleDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

function calendarUrl(title: string, detail: string, hours = 24) {
  const start = new Date(Date.now() + hours * 3600000)
  const end = new Date(start.getTime() + 2700000)
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE", text: title, details: detail,
    dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
  }).toString()}`
}

function Ring({ value, label, tone = "mint" }: { value: number; label: string; tone?: Tone }) {
  return <div className={`readiness-ring ${tone}`} style={{ "--value": `${value * 3.6}deg` } as React.CSSProperties}><div><strong>{value}%</strong><span>{label}</span></div></div>
}

function SectionTitle({ eyebrow, title, copy, actions }: { eyebrow: string; title: string; copy: string; actions?: React.ReactNode }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="section-copy">{copy}</p></div>{actions && <div className="heading-actions">{actions}</div>}</div>
}

function StatCard({ icon: Icon, value, label, detail, tone }: { icon: React.ElementType; value: string; label: string; detail: string; tone: string }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon /></div><div><strong>{value}</strong><span>{label}</span><small>{detail}</small></div></article>
}

function Dashboard({ setView, openTour }: { setView: (v: View) => void; openTour: () => void }) {
  const tasks = [
    ["Complete stakeholder power-interest grid", "Workplace · Due today", "35 min", "workplace"],
    ["Finish lesson 3.4: Stakeholder management", "Learning · Due today", "25 min", "learning"],
    ["Prepare discovery questions for Priya", "Meeting prep · Tomorrow", "20 min", "meetings"],
  ] as const
  return <div className="page-stack">
    <section className="welcome-panel">
      <div><Badge className="status-badge"><CircleDot /> On track</Badge><h1>Good morning, Daniel.</h1><p>You are making strong progress. Complete today&apos;s two priority activities to keep your 12-week plan ahead of schedule.</p><div className="welcome-actions"><Button className="primary-action" onClick={() => setView("learning")}><Play /> Continue learning</Button><Button variant="outline" onClick={() => setView("workplace")}><BriefcaseBusiness /> Resume work</Button><Button variant="ghost" onClick={openTour}><Sparkles /> Guided tour</Button></div></div>
      <div className="hero-progress"><Ring value={68} label="Overall" /><div className="hero-meta"><span>Estimated readiness</span><strong>4 weeks, 3 days</strong><small>12 days ahead of the original plan</small></div></div>
    </section>
    <section className="stat-grid"><StatCard icon={GraduationCap} value="67%" label="Course progress" detail="3 of 6 modules active" tone="mint" /><StatCard icon={BriefcaseBusiness} value="58%" label="Work experience" detail="Discovery stage" tone="navy" /><StatCard icon={Gauge} value="74%" label="Exam readiness" detail="Up 6% this week" tone="gold" /><StatCard icon={ClipboardCheck} value="8" label="Evidence items" detail="2 awaiting review" tone="coral" /></section>
    <section className="dashboard-grid">
      <article className="panel today-panel"><div className="panel-title-row"><div><p className="eyebrow">Your priorities</p><h2>Today&apos;s focus</h2></div><span className="date-pill">Thu, 27 Aug</span></div><div className="task-list">{tasks.map((task, i) => <button className="task-row" key={task[0]} onClick={() => setView(task[3])}><span className={`task-kind k${i}`}>{i === 1 ? <BookOpen /> : i === 0 ? <BriefcaseBusiness /> : <Video />}</span><span className="task-main"><strong>{task[0]}</strong><small>{task[1]}</small></span><span className="task-time"><Clock3 /> {task[2]}</span><ChevronRight /></button>)}</div><button className="text-link" onClick={() => setView("calendar")}>View complete plan <ArrowRight /></button></article>
      <article className="panel next-meeting"><div className="meeting-kicker"><Radio /> Next live simulation</div><p className="eyebrow">Tomorrow · 10:00</p><h2>Stakeholder discovery interview</h2><p>Interview the Operations Lead, clarify pain points and test your assumptions.</p><div className="mini-people"><span className="avatar violet">PS</span><span className="avatar blue">MC</span><span className="meeting-duration">45 min</span></div><div className="meeting-actions"><Button className="primary-action" onClick={() => setView("meetings")}><Video /> Enter room</Button><Button variant="outline" asChild><a href={calendarUrl("Stakeholder discovery interview", "Advantcore Academy simulated stakeholder interview")} target="_blank" rel="noreferrer"><CalendarDays /> Add to Google</a></Button></div></article>
    </section>
    <section className="dashboard-grid lower">
      <article className="panel trajectory"><div className="panel-title-row"><div><p className="eyebrow">Adaptive pathway</p><h2>Your readiness trajectory</h2></div><Badge variant="outline">Updated today</Badge></div><div className="trajectory-content"><Ring value={74} label="Exam" /><Ring value={61} label="Career" tone="navy" /><Ring value={82} label="Consistency" tone="gold" /><div className="trajectory-note"><Sparkles /><div><strong>Academy insight</strong><span>Your stakeholder analysis is stronger than your requirements modelling. Week 6 includes one extra practice activity.</span></div></div></div></article>
      <article className="panel team-panel"><div className="panel-title-row"><div><p className="eyebrow">Advantcore project</p><h2>Your virtual team</h2></div><MoreHorizontal /></div><div className="team-list">{team.map(person => <div className="person-row" key={person.name}><span className={`avatar ${person.colour}`}>{person.initials}</span><span><strong>{person.name}</strong><small>{person.role}</small></span><span className="online-dot" /></div>)}</div></article>
    </section>
  </div>
}

function QuizDialog() {
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const correct = answer === "manage"
  return <Dialog><DialogTrigger asChild><Button className="primary-action"><ListChecks /> Take lesson quiz</Button></DialogTrigger><DialogContent className="quiz-dialog"><DialogHeader><p className="eyebrow">Module 3 · Knowledge check</p><DialogTitle>Stakeholder analysis</DialogTitle><DialogDescription>You need 90% to master this lesson. Answers are explained after submission.</DialogDescription></DialogHeader>{!submitted ? <div className="quiz-body"><div className="question-count"><span>Question 1 of 3</span><Progress value={33} /></div><h3>What is the primary purpose of a stakeholder power-interest grid?</h3>{[["identify","To identify every person in the organisation"],["manage","To determine an appropriate engagement approach"],["rank","To rank stakeholders by job seniority"],["replace","To replace stakeholder interviews"]].map(([v,l]) => <label className={`answer-option ${answer === v ? "selected" : ""}`} key={v}><input type="radio" checked={answer === v} onChange={() => setAnswer(v)} /><span>{l}</span></label>)}</div> : <div className={`quiz-result ${correct ? "correct" : "retry"}`}>{correct ? <CheckCircle2 /> : <RefreshCw />}<div><h3>{correct ? "Correct" : "Review and try again"}</h3><p>{correct ? "The grid helps tailor communication and engagement to stakeholder influence and interest." : "Consider how the model changes the way an analyst communicates with each group."}</p></div></div>}<DialogFooter>{submitted && !correct ? <Button variant="outline" onClick={() => { setSubmitted(false); setAnswer("") }}><RefreshCw /> Retake</Button> : <Button className="primary-action" disabled={!answer} onClick={() => setSubmitted(true)}>{submitted ? "Continue" : "Submit answer"}<ArrowRight /></Button>}</DialogFooter></DialogContent></Dialog>
}

function Learning() {
  return <div className="page-stack"><SectionTitle eyebrow="Learning studio" title="BCS Foundation Certificate in Business Analysis" copy="A mastery-based pathway aligned with the current 40-question, 60-minute examination format." actions={<><Button variant="outline"><LibraryBig /> Resources</Button><Button className="primary-action"><Play /> Resume lesson</Button></>} />
    <div className="learning-overview"><div className="course-progress-main"><Ring value={67} label="Complete" /><div><Badge className="status-badge"><Target /> Target: 90% mastery</Badge><h2>Week 5 of 12</h2><p>14 lessons completed · 5 quizzes passed · Current average 87%</p></div></div><div className="exam-facts"><div><strong>40</strong><span>Questions</span></div><div><strong>60</strong><span>Minutes</span></div><div><strong>65%</strong><span>Official pass mark</span></div><div><strong>90%</strong><span>Academy target</span></div></div></div>
    <section className="learning-layout"><aside className="module-panel"><div className="panel-title-row"><div><p className="eyebrow">Course map</p><h2>6 modules</h2></div><span>67%</span></div><div className="module-list">{modules.map(m => <button key={m[0]} className={`module-row ${m[3]}`} disabled={m[3] === "locked"}><span className="module-number">{m[3] === "done" ? <Check /> : m[0]}</span><span><strong>{m[1]}</strong><small>{m[3] === "done" ? "Completed" : m[3] === "active" ? `${m[2]}% complete` : "Unlocks next"}</small></span><ChevronRight /></button>)}</div><div className="mock-card"><Gauge /><div><strong>Mock practice</strong><span>Topic, mixed or full exam</span></div><Button size="sm" variant="outline">Practise</Button></div></aside>
      <article className="lesson-panel"><div className="lesson-topline"><span>Module 3 · Lesson 4 of 6</span><Badge variant="outline">25 min</Badge></div><h1>Managing stakeholder relationships</h1><p className="lesson-intro">Select engagement approaches that reflect stakeholder influence, interest, attitudes and information needs.</p><section className="objectives-card"><div className="objectives-icon"><Target /></div><div><p className="eyebrow">Learning outcomes</p><h3>By the end of this lesson, you can:</h3><ul><li><Check /> explain stakeholder management strategy</li><li><Check /> apply the power-interest grid</li><li><Check /> recommend suitable communication approaches</li></ul></div></section><div className="concept-grid"><div><span>01</span><h3>Analyse</h3><p>Assess power, interest, attitude and impact using evidence.</p></div><div><span>02</span><h3>Position</h3><p>Map each stakeholder while recognising that positions change.</p></div><div><span>03</span><h3>Engage</h3><p>Choose communications that fit the person and decision.</p></div></div><div className="lesson-example"><div><Sparkles /></div><div><p className="eyebrow">Workplace connection</p><h3>Apply this to the Advantcore project</h3><p>Classify Sarah, Marcus, Priya and Helen, then justify how you will engage each person during discovery.</p><button>Open project task <ArrowRight /></button></div></div><div className="lesson-footer"><div><strong>Lesson mastery check</strong><span>3 questions · 90% required · Retakes allowed</span></div><QuizDialog /></div></article>
    </section>
  </div>
}

function Workplace({ setView }: { setView: (v: View) => void }) {
  return <div className="page-stack"><SectionTitle eyebrow="Virtual workplace" title="Advantcore delivery workspace" copy="Complete genuine analysis activities, receive stakeholder feedback and build an employer-ready portfolio." actions={<><Select defaultValue="enquiry"><SelectTrigger className="project-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="enquiry">Enquiry-to-delivery transformation</SelectItem><SelectItem value="client" disabled>Client portal discovery · Locked</SelectItem></SelectContent></Select><Button className="primary-action" onClick={() => setView("meetings")}><Video /> Join project room</Button></>} />
    <section className="project-hero"><div className="project-mark"><Activity /></div><div className="project-info"><div className="project-tags"><Badge>Active project</Badge><span>ADV-BA-001</span></div><h2>Enquiry-to-delivery process transformation</h2><p>Investigate friction across lead qualification, project hand-off and delivery mobilisation, then recommend a controlled future-state process.</p><div className="project-facts"><span><CalendarDays /> 12 Aug to 30 Oct</span><span><Users /> 4 stakeholders</span><span><FileText /> 8 evidence items</span></div></div><div className="project-score"><Ring value={58} label="Project" tone="navy" /><span>Discovery stage</span></div></section>
    <section className="stage-panel panel"><div className="panel-title-row"><div><p className="eyebrow">Delivery pathway</p><h2>Stage 2 of 5 · Discovery</h2></div><span className="date-pill">12 days ahead</span></div><div className="stage-track">{[["1","Initiate","done"],["2","Discover","active"],["3","Analyse",""],["4","Design",""],["5","Validate",""]].map(s => <div className={`stage-step ${s[2]}`} key={s[0]}><span>{s[2] === "done" ? <Check /> : s[0]}</span><strong>{s[1]}</strong></div>)}</div></section>
    <section className="work-grid"><article className="panel sprint-panel"><div className="panel-title-row"><div><p className="eyebrow">Current sprint</p><h2>Understand people and process</h2></div><Badge variant="outline">Week 5</Badge></div><div className="work-task-list"><WorkTask icon={<Check />} title="Review current enquiry artefacts" copy="Evidence approved by BA Supervisor" action="Complete" state="done" /><WorkTask icon={<CircleDot />} title="Map and analyse stakeholders" copy="Power-interest grid · Due today" action="In progress" state="active" /><WorkTask icon="3" title="Run operations discovery interview" copy="Priya Shah · Tomorrow at 10:00" action="Prepare" onClick={() => setView("meetings")} /><WorkTask icon="4" title="Produce as-is process model" copy="Unlocks after discovery interview" action="Next" /></div></article><article className="panel evidence-panel"><div className="panel-title-row"><div><p className="eyebrow">Portfolio evidence</p><h2>Evidence locker</h2></div><Button size="sm" variant="outline"><UploadCloud /> Upload</Button></div>{[["Project charter","Approved · 12 Aug"],["Stakeholder register","Draft · Today"],["Discovery plan","Reviewed · 24 Aug"],["Meeting minutes","2 files · 24 Aug"]].map(r => <button className="evidence-row" key={r[0]}><span className="file-icon"><FileText /></span><span><strong>{r[0]}</strong><small>{r[1]}</small></span><MoreHorizontal /></button>)}<button className="text-link">View all evidence <ArrowRight /></button></article></section>
    <section className="panel people-board"><div className="panel-title-row"><div><p className="eyebrow">Project organisation</p><h2>Your Advantcore team</h2></div><span className="ai-label"><Sparkles /> Context-aware AI characters</span></div><div className="people-grid">{team.map(p => <article className="person-card" key={p.name}><span className={`avatar large ${p.colour}`}>{p.initials}<i /></span><div><strong>{p.name}</strong><span>{p.role}</span><small>{p.role === "BA Supervisor" ? "Coaches, challenges and signs off" : p.role === "Independent Reviewer" ? "Assesses evidence independently" : "Provides project-specific decisions"}</small></div><Button size="sm" variant="ghost"><MessageSquareText /> Talk</Button></article>)}</div></section>
  </div>
}

function WorkTask({ icon, title, copy, action, state = "", onClick }: { icon: React.ReactNode; title: string; copy: string; action: string; state?: string; onClick?: () => void }) {
  return <div className={`work-task ${state}`}><span>{icon}</span><div><strong>{title}</strong><small>{copy}</small>{state === "active" && <Progress value={65} />}</div>{onClick ? <Button size="sm" variant="outline" onClick={onClick}>{action}</Button> : <Badge variant={state === "done" ? "default" : "outline"}>{action}</Badge>}</div>
}

function MeetingRoom() {
  const [live, setLive] = useState(false)
  const [readAloud, setReadAloud] = useState(true)
  const [visible, setVisible] = useState(2)
  const [customLines, setCustomLines] = useState<typeof transcript>([])
  const [message, setMessage] = useState("")
  const [thinking, setThinking] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [recording, setRecording] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  useEffect(() => { if (!live || visible >= transcript.length) return; const timer = window.setTimeout(() => { const next = transcript[visible]; setVisible(v => v + 1); if (readAloud && "speechSynthesis" in window) { window.speechSynthesis.cancel(); const speech = new SpeechSynthesisUtterance(next.text); speech.rate = .98; window.speechSynthesis.speak(speech) } }, 4200); return () => window.clearTimeout(timer) }, [live, visible, readAloud])
  async function shareScreen() { try { const stream = await navigator.mediaDevices.getDisplayMedia({ video: true }); setSharing(true); stream.getVideoTracks()[0].addEventListener("ended", () => setSharing(false)) } catch { setSharing(false) } }
  async function toggleRecording() { if (recording && recorder.current) { recorder.current.stop(); setRecording(false); return } try { const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }); const r = new MediaRecorder(stream); chunks.current = []; r.ondataavailable = e => chunks.current.push(e.data); r.onstop = () => { const url = URL.createObjectURL(new Blob(chunks.current, { type: r.mimeType })); const a = document.createElement("a"); a.href = url; a.download = "advantcore-meeting-recording.webm"; a.click(); URL.revokeObjectURL(url); stream.getTracks().forEach(t => t.stop()) }; r.start(); recorder.current = r; setRecording(true) } catch { setRecording(false) } }
  async function askTeam() {
    const userMessage = message.trim()
    if (!userMessage || thinking) return
    setMessage("")
    setThinking(true)
    setCustomLines(lines => [...lines, { speaker: "Daniel", role: "Business Analyst", time: "Now", text: userMessage }])
    try {
      const response = await fetch(`${APP_BASE_PATH}/api/academy-ai`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "meetingReply", character: { name: "Marcus Cole", role: "BA Supervisor", behaviour: "Coach through questions, challenge unsupported assumptions and protect professional standards." }, project: { name: "Enquiry-to-delivery process transformation", company: "Advantcore Ltd", objective: "Reduce hand-off ambiguity and improve delivery mobilisation.", stage: "Discovery" }, context: "Confirmed: enquiry information is split across email and spreadsheets. Assumption requiring validation: ownership becomes unclear after lead qualification.", message: userMessage }) })
      const result = await response.json() as { text?: string }
      const reply = result.text || "I need more project context before I can answer that reliably."
      setCustomLines(lines => [...lines, { speaker: "Marcus", role: "BA Supervisor", time: "Now", text: reply }])
      if (readAloud && "speechSynthesis" in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(reply))
    } catch {
      setCustomLines(lines => [...lines, { speaker: "Marcus", role: "BA Supervisor", time: "Now", text: "I could not reach the AI service. Record the question and continue with the approved meeting evidence." }])
    } finally { setThinking(false) }
  }
  return <div className="page-stack meeting-page"><SectionTitle eyebrow="AI meeting room" title="Project scoping meeting" copy="A context-aware simulation with spoken responses, live transcript and evidence capture." actions={<><Badge className={live ? "live-badge" : "scheduled-badge"}><Radio /> {live ? "Live now" : "Ready to start"}</Badge><Button variant="outline" asChild><a href={calendarUrl("Project scoping meeting", "Advantcore Academy virtual BA workplace meeting", 48)} target="_blank" rel="noreferrer"><CalendarDays /> Add to Google</a></Button></>} />
    <section className="meeting-stage"><div className="meeting-video-area"><div className="video-grid">{team.map((p,i) => <div className={`video-tile ${live && i === visible % 4 ? "speaking" : ""}`} key={p.name}><span className={`avatar video-avatar ${p.colour}`}>{p.initials}</span><div className="voice-wave"><i/><i/><i/><i/></div><span className="video-name">{p.name}<small>{p.role}</small></span><Mic /></div>)}<div className="video-tile self"><span className="avatar video-avatar user">DE</span><span className="video-name">Daniel Emmanuel<small>You · Business Analyst</small></span><MicOff /></div><div className="video-tile share-tile"><MonitorUp /><strong>{sharing ? "Your screen is being shared" : "Share project evidence"}</strong><span>{sharing ? "Return here when ready" : "Present a document, process map or slide deck"}</span><Button size="sm" variant="outline" onClick={shareScreen}>{sharing ? "Sharing" : "Select screen"}</Button></div></div><div className="meeting-controls"><button className="round-control"><Mic /></button><button className="round-control"><Video /></button><button className={`round-control ${sharing ? "active" : ""}`} onClick={shareScreen}><MonitorUp /></button><button className={`round-control ${recording ? "recording" : ""}`} onClick={toggleRecording}>{recording ? <Square /> : <CircleDot />}</button><button className={`end-control ${live ? "pause" : ""}`} onClick={() => setLive(v => !v)}>{live ? <Pause /> : <Play />}{live ? "Pause simulation" : "Start meeting"}</button></div></div>
      <aside className="transcript-panel"><div className="transcript-header"><div><p className="eyebrow">Live transcript</p><h2>Conversation</h2></div><button className="icon-button" onClick={() => setReadAloud(v => !v)}>{readAloud ? <Volume2 /> : <VolumeX />}</button></div><div className="transcript-scroll">{[...transcript.slice(0, visible), ...customLines].map((l, index) => <div className="transcript-line" key={`${l.time}-${l.speaker}-${index}`}><span className="transcript-avatar">{l.speaker[0]}</span><div><div><strong>{l.speaker}</strong><small>{l.time}</small></div><span>{l.role}</span><p>{l.text}</p></div></div>)}{(live && visible < transcript.length || thinking) && <div className="typing"><i/><i/><i/><span>{thinking ? "Marcus is thinking" : `${transcript[visible].speaker} is responding`}</span></div>}</div><div className="meeting-message"><input value={message} onChange={event => setMessage(event.target.value)} onKeyDown={event => { if (event.key === "Enter") askTeam() }} placeholder="Ask the project team…" aria-label="Message the AI project team"/><Button size="sm" className="primary-action" onClick={askTeam} disabled={!message.trim() || thinking}><ArrowRight /></Button></div><div className="transcript-footer"><Button variant="outline"><Download /> Transcript</Button><Button className="primary-action"><WandSparkles /> Generate minutes</Button></div></aside></section>
    <section className="meeting-prep panel"><div><p className="eyebrow">Meeting brief</p><h2>Your objective</h2><p>Clarify the business problem, agree a realistic discovery scope and secure access to the right evidence.</p></div><div className="agenda-list"><span><Check /> Confirm desired outcomes</span><span><Check /> Test project assumptions</span><span><Check /> Agree success measures</span></div><div className="meeting-score"><strong>Preparation score</strong><Progress value={82} /><span>82% · Ready</span></div></section>
  </div>
}

function CalendarView() {
  const days = ["Monday 31", "Tuesday 1", "Wednesday 2", "Thursday 3", "Friday 4"]
  return <div className="page-stack"><SectionTitle eyebrow="Adaptive plan" title="Week 6 · Requirements discovery" copy="Finish early, reschedule safely and let Academy realign the remaining pathway without losing your target." actions={<><Button variant="outline" asChild><a href={calendarUrl("Advantcore Academy weekly plan", "Learning and virtual workplace plan", 72)} target="_blank" rel="noreferrer"><CalendarDays /> Add week to Google</a></Button><Button className="primary-action"><RefreshCw /> Realign plan</Button></>} /><section className="calendar-summary"><StatCard icon={Clock3} value="8h 20m" label="Planned this week" detail="Across work and learning" tone="mint" /><StatCard icon={CheckCircle2} value="3/11" label="Activities complete" detail="12 days ahead" tone="navy" /><StatCard icon={Target} value="30 Oct" label="Forecast finish" detail="Original date: 13 Nov" tone="gold" /></section>
    <section className="week-board">{days.map((day,i) => <div className={`day-column ${i === 3 ? "today" : ""}`} key={day}><div className="day-head"><span>{day.split(" ")[0]}</span><strong>{day.split(" ")[1]}</strong>{i === 3 && <small>Today</small>}</div>{i === 0 && <><Plan type="learn" time="09:30 · 40 min" title="Requirements foundations" label="Learning"/><Plan type="work" time="14:00 · 60 min" title="Interview planning" label="Workplace"/></>}{i === 1 && <Plan type="meeting" time="10:00 · 45 min" title="Operations interview" label="AI meeting"/>}{i === 2 && <><Plan type="work" time="09:30 · 90 min" title="As-is process model" label="Workplace"/><Plan type="learn" time="16:00 · 25 min" title="Quiz · Modelling" label="Learning"/></>}{i === 3 && <><Plan type="current" time="11:30 · 35 min" title="Stakeholder grid" label="Due today"/><button className="add-plan"><Plus /> Add activity</button></>}{i === 4 && <Plan type="review" time="15:00 · 45 min" title="Supervisor review" label="Evidence gate"/>}</div>)}</section><section className="panel realign-note"><Sparkles /><div><strong>How adaptive scheduling works</strong><p>Complete an activity early or move a deadline, and Academy proposes the smallest safe adjustment to dependent learning, meetings and project tasks. You approve every change.</p></div><Button variant="outline">View dependencies</Button></section>
  </div>
}

function Plan({ type, time, title, label }: { type: string; time: string; title: string; label: string }) { return <div className={`plan-card ${type}`}><span>{time}</span><strong>{title}</strong><small>{label}</small></div> }

function AdminStudio() {
  const [step, setStep] = useState("pathway")
  const [ai, setAi] = useState(true)
  return <div className="page-stack"><SectionTitle eyebrow="Admin studio" title="Build and govern career experiences" copy="Create pathways, companies, projects, AI colleagues and approved knowledge sources without hard-coding the platform." actions={<><Button variant="outline"><Users /> Manage users</Button><Button className="primary-action"><Plus /> New pathway</Button></>} /><section className="admin-stat-grid"><StatCard icon={GraduationCap} value="1" label="Live pathway" detail="Business Analysis" tone="mint" /><StatCard icon={BriefcaseBusiness} value="1" label="Active project" detail="Advantcore Ltd" tone="navy" /><StatCard icon={UserCheck} value="4" label="AI colleagues" detail="All approved" tone="gold" /><StatCard icon={ShieldCheck} value="2" label="Pending users" detail="Awaiting approval" tone="coral" /></section>
    <Tabs defaultValue="builder" className="admin-tabs"><TabsList><TabsTrigger value="builder">Guided builder</TabsTrigger><TabsTrigger value="content">Knowledge & resources</TabsTrigger><TabsTrigger value="users">Users & approvals</TabsTrigger><TabsTrigger value="integrations">Free integrations</TabsTrigger></TabsList><TabsContent value="builder"><section className="admin-builder"><aside className="builder-steps">{[["pathway","1","Career pathway"],["certification","2","Certification"],["project","3","Work experience"],["people","4","AI colleagues"],["review","5","Review & publish"]].map(s => <button key={s[0]} className={step === s[0] ? "active" : ""} onClick={() => setStep(s[0])}><span>{step === s[0] ? <CircleDot /> : s[1]}</span><strong>{s[2]}</strong><ChevronRight /></button>)}<div className="builder-help"><Sparkles /><strong>AI-assisted, admin-approved</strong><p>Academy proposes a structure and flags uncertainty. Nothing goes live without approval.</p></div></aside><article className="builder-form"><div className="form-heading"><div><p className="eyebrow">Step 1 of 5</p><h2>Define the career pathway</h2><p>Set the outcome and pace. You can refine every recommendation before publishing.</p></div><div className="ai-switch"><span><Sparkles /> AI recommendations</span><Switch checked={ai} onCheckedChange={setAi}/></div></div><div className="form-grid"><label><span>Pathway name</span><input defaultValue="Business Analyst Career Accelerator"/></label><label><span>Career family</span><select defaultValue="business"><option value="business">Business analysis & change</option><option>Project management</option><option>Cyber security</option><option>Data analysis</option></select></label><label className="full"><span>Target outcome</span><textarea defaultValue="Become certification-ready and job-ready through structured learning, assessed project work, an evidence portfolio and interview preparation."/></label><label><span>Default duration</span><select><option>12 weeks</option><option>8 weeks</option><option>16 weeks</option></select></label><label><span>Minimum mastery threshold</span><div className="suffix-input"><input type="number" defaultValue="90"/><span>%</span></div></label></div>{ai && <div className="recommendation-box"><WandSparkles /><div><strong>Suggested structure</strong><p>6 learning modules · 5 project stages · 4 stakeholder roles · 2 full mock exams · 1 assessed portfolio</p><span>Based on the target outcome and current BA pathway.</span></div><div><Button size="sm" className="primary-action">Apply</Button><Button size="sm" variant="ghost">Edit</Button></div></div>}<div className="builder-footer"><span>Draft saved automatically</span><Button className="primary-action" onClick={() => setStep("certification")}>Save & continue <ArrowRight /></Button></div></article></section></TabsContent>
      <TabsContent value="content"><section className="empty-admin"><UploadCloud /><h2>Build the approved knowledge base</h2><p>Upload syllabuses, textbooks, mock papers, company policies and project resources. Each source can be replaced, versioned or removed.</p><Button className="primary-action"><UploadCloud /> Add resources</Button></section></TabsContent>
      <TabsContent value="users"><section className="admin-table"><div className="table-head"><span>User</span><span>Pathway</span><span>Status</span><span>Action</span></div>{[["Amanda Okafor","Business Analysis","Pending"],["Lewis Grant","Business Analysis","Active"],["Nina Bello","Unassigned","Pending"]].map(r => <div className="table-row" key={r[0]}><span><span className="avatar small blue">{r[0].split(" ").map(x => x[0]).join("")}</span><strong>{r[0]}</strong></span><span>{r[1]}</span><Badge variant="outline">{r[2]}</Badge><Button size="sm" variant="outline">{r[2] === "Pending" ? "Review" : "Manage"}</Button></div>)}</section></TabsContent>
      <TabsContent value="integrations"><section className="integration-grid">{[["Browser speech","Read AI responses aloud","Free · Built in","ready"],["Screen capture","Presentation and recording","Free · Built in","ready"],["Google Calendar","Event links and future full sync","Free quota · OAuth for sync","setup"],["Supabase","Auth, database and file storage","Free tier · Production option","setup"]].map(r => <article className="integration-card" key={r[0]}><span className="integration-icon">{r[3] === "ready" ? <Check /> : <Settings />}</span><div><strong>{r[0]}</strong><p>{r[1]}</p><small>{r[2]}</small></div><Button size="sm" variant="outline">{r[3] === "ready" ? "Ready" : "Configure"}</Button></article>)}</section></TabsContent></Tabs>
  </div>
}

export function AcademyApp() {
  const [view, setView] = useState<View>("dashboard")
  const [tour, setTour] = useState(false)
  const title = useMemo(() => navItems.find(i => i.id === view)?.label ?? "Admin studio", [view])
  return <SidebarProvider><Sidebar collapsible="icon" className="academy-sidebar"><SidebarHeader className="brand-header"><button className="brand" onClick={() => setView("dashboard")}><span className="brand-mark"><Sparkles /></span><span><strong>Advantcore</strong><small>ACADEMY</small></span></button></SidebarHeader><SidebarSeparator/><SidebarContent><SidebarGroup><SidebarGroupLabel>My journey</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{navItems.map(item => <SidebarMenuItem key={item.id}><SidebarMenuButton tooltip={item.label} isActive={view === item.id} onClick={() => setView(item.id)}><item.icon/><span>{item.label}</span></SidebarMenuButton>{item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}</SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent></SidebarGroup><SidebarGroup><SidebarGroupLabel>Manage</SidebarGroupLabel><SidebarGroupContent><SidebarMenu><SidebarMenuItem><SidebarMenuButton tooltip="Admin studio" isActive={view === "admin"} onClick={() => setView("admin")}><Settings/><span>Admin studio</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent><SidebarFooter><div className="sidebar-user"><span className="avatar user">DE</span><span><strong>Daniel</strong><small>Learner · Admin</small></span><MoreHorizontal/></div></SidebarFooter><SidebarRail/></Sidebar>
    <SidebarInset className="app-shell"><header className="topbar"><div className="topbar-left"><SidebarTrigger/><div className="mobile-title"><span>{title}</span><small>Business Analysis pathway</small></div></div><div className="journey-selector"><span className="journey-icon"><GraduationCap/></span><div><small>Active pathway</small><strong>Business Analysis</strong></div><ChevronRight/></div><div className="top-actions"><button className="search-button"><Search/><span>Search anything</span><kbd>⌘ K</kbd></button><button className="icon-button notification"><Bell/><i/></button><Button size="sm" variant="outline" onClick={() => setTour(true)}><Sparkles/> Help</Button></div></header><main className="content-area">{view === "dashboard" && <Dashboard setView={setView} openTour={() => setTour(true)}/>} {view === "learning" && <Learning/>}{view === "workplace" && <Workplace setView={setView}/>} {view === "meetings" && <MeetingRoom/>}{view === "calendar" && <CalendarView/>}{view === "admin" && <AdminStudio/>}</main>
      <Dialog open={tour} onOpenChange={setTour}><DialogContent className="tour-dialog"><DialogHeader><Badge className="status-badge"><Sparkles/> Welcome to Advantcore Academy</Badge><DialogTitle>Learn it. Practise it. Prove it.</DialogTitle><DialogDescription>Your career journey connects structured study with a realistic Advantcore workplace.</DialogDescription></DialogHeader><div className="tour-grid"><div><span>1</span><GraduationCap/><strong>Master the knowledge</strong><p>Lessons, quizzes and adaptive exam practice.</p></div><div><span>2</span><BriefcaseBusiness/><strong>Apply it at work</strong><p>Projects, AI stakeholders and assessed evidence.</p></div><div><span>3</span><Gauge/><strong>Know when ready</strong><p>One view of certification and job readiness.</p></div></div><DialogFooter><Button variant="outline" onClick={() => setTour(false)}>Skip tour</Button><Button className="primary-action" onClick={() => { setTour(false); setView("learning") }}>Start with learning <ArrowRight/></Button></DialogFooter></DialogContent></Dialog>
    </SidebarInset></SidebarProvider>
}
