export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = "admin" | "learner"
export type AccountStatus = "pending" | "active" | "suspended" | "archived"
export type ModuleStatus = "locked" | "active" | "done"
export type EvidenceStatus = "draft" | "submitted" | "reviewed" | "approved" | "rejected"
export type MeetingStatus = "scheduled" | "live" | "completed" | "cancelled"
export type ReviewDecision = "approved" | "changes_requested" | "rejected"

export interface Database {
  public: {
    Tables: {
      organisations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          org_id: string | null
          email: string
          full_name: string
          avatar_initials: string
          avatar_colour: string
          role: UserRole
          status: AccountStatus
          must_change_password: boolean
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          org_id?: string | null
          email: string
          full_name: string
          avatar_initials?: string
          avatar_colour?: string
          role?: UserRole
          status?: AccountStatus
          must_change_password?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          org_id?: string | null
          email?: string
          full_name?: string
          avatar_initials?: string
          avatar_colour?: string
          role?: UserRole
          status?: AccountStatus
          must_change_password?: boolean
          metadata?: Json | null
          updated_at?: string
        }
      }
      career_pathways: {
        Row: {
          id: string
          org_id: string | null
          title: string
          slug: string
          career_family: string
          target_outcome: string
          default_duration_weeks: number
          mastery_threshold: number
          is_published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
      }
      course_modules: {
        Row: {
          id: string
          pathway_id: string
          module_number: string
          title: string
          description: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          lesson_number: string
          title: string
          intro: string | null
          content_markdown: string | null
          estimated_minutes: number
          order_index: number
          created_at: string
          updated_at: string
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          score: number
          mastery_achieved: boolean
          answers_json: Json
          attempted_at: string
        }
      }
      projects: {
        Row: {
          id: string
          pathway_id: string
          company_id: string
          code: string
          title: string
          description: string
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
        }
      }
      pathway_staff: {
        Row: {
          id: string
          project_id: string
          pathway_id: string | null
          name: string
          role: string
          initials: string
          colour: string
          behaviour_instructions: string
          knowledge_scope: string | null
          is_ai: boolean
          assigned_user_id: string | null
          created_at: string
          updated_at: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          stage_id: string | null
          user_id: string
          title: string
          description: string | null
          task_kind: string
          estimated_minutes: number
          status: string
          due_date: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
      }
      meetings: {
        Row: {
          id: string
          project_id: string
          user_id: string
          title: string
          brief: string
          scheduled_at: string
          duration_minutes: number
          status: MeetingStatus
          preparation_score: number
          created_at: string
          updated_at: string
        }
      }
      evidence_items: {
        Row: {
          id: string
          project_id: string
          user_id: string
          title: string
          stage_name: string
          storage_path: string
          status: EvidenceStatus
          submitted_at: string | null
          created_at: string
          updated_at: string
        }
      }
      readiness_snapshots: {
        Row: {
          id: string
          user_id: string
          overall_score: number
          course_progress: number
          work_experience: number
          exam_readiness: number
          evidence_count: number
          consistency_score: number
          snapshot_date: string
          created_at: string
        }
      }
    }
  }
}
