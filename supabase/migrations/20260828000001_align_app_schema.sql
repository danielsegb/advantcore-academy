-- Advantcore Academy Production Database Schema Alignment Migration
-- Description: Unblocks PostgreSQL table permissions and RLS for all present and future users.

-- 1. Grant table & schema permissions to Supabase roles (anon, authenticated, service_role)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 2. Disable Row Level Security on public progress and profile tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE readiness_snapshots DISABLE ROW LEVEL SECURITY;

-- 3. Unblock ID format constraints on quiz_attempts
ALTER TABLE quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_lesson_id_fkey;
ALTER TABLE quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_user_id_fkey;
ALTER TABLE quiz_attempts ALTER COLUMN lesson_id TYPE TEXT;
ALTER TABLE quiz_attempts ALTER COLUMN user_id TYPE TEXT;

-- 4. Unblock ID format constraints on evidence_items and reviews
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_evidence_item_id_fkey;
ALTER TABLE reviews ALTER COLUMN evidence_item_id TYPE TEXT;
ALTER TABLE evidence_items ALTER COLUMN id TYPE TEXT;
ALTER TABLE reviews ADD CONSTRAINT reviews_evidence_item_id_fkey FOREIGN KEY (evidence_item_id) REFERENCES evidence_items(id) ON DELETE CASCADE;

ALTER TABLE evidence_items DROP CONSTRAINT IF EXISTS evidence_items_user_id_fkey;
ALTER TABLE evidence_items ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE evidence_items ALTER COLUMN project_id DROP NOT NULL;
ALTER TABLE evidence_items ADD COLUMN IF NOT EXISTS task_id TEXT;
ALTER TABLE evidence_items ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE evidence_items ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE evidence_items ADD COLUMN IF NOT EXISTS reviewer_decision_json JSONB;
ALTER TABLE evidence_items ALTER COLUMN stage_name DROP NOT NULL;
ALTER TABLE evidence_items ALTER COLUMN storage_path DROP NOT NULL;

-- 5. Unblock readiness_snapshots
ALTER TABLE readiness_snapshots DROP CONSTRAINT IF EXISTS readiness_snapshots_user_id_fkey;
ALTER TABLE readiness_snapshots ALTER COLUMN user_id TYPE TEXT;

-- 6. Loosen profiles foreign key
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
