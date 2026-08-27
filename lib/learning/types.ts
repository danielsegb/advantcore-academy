export interface LearningOutcome {
  id: string
  description: string
}

export interface QuizOption {
  key: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  prompt: string
  explanation: string
  options: QuizOption[]
}

export interface LessonBodySection {
  heading: string
  paragraphs: string[]
}

export interface Lesson {
  id: string
  moduleId: string
  lessonNumber: string
  title: string
  estimatedMinutes: number
  intro: string
  outcomes: string[]
  concepts: { number: string; title: string; description: string }[]
  bodyContent?: LessonBodySection[]
  workplaceConnection: {
    title: string
    description: string
    actionText: string
  }
  questions: QuizQuestion[]
}

export interface CourseModule {
  id: string
  moduleNumber: string
  title: string
  description: string
  lessons: Lesson[]
  progressPercentage: number
  status: "done" | "active" | "locked"
}

export interface QuizSubmissionResult {
  score: number
  totalQuestions: number
  correctCount: number
  masteryAchieved: boolean
  explanations: { questionId: string; prompt: string; selectedKey: string; isCorrect: boolean; explanation: string }[]
}
