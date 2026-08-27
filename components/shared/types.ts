export type View = "dashboard" | "learning" | "workplace" | "meetings" | "calendar" | "admin"
export type Tone = "mint" | "navy" | "gold" | "coral"

export interface PathwayStaff {
  name: string
  role: string
  initials: string
  colour: string
}

export interface TranscriptLine {
  speaker: string
  role: string
  time: string
  text: string
}
