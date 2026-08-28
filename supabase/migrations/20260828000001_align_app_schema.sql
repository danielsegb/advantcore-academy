-- Advantcore Academy Production Database Schema Alignment Migration
-- Description: Dynamic database-driven persistence and automatic profile provisioning for ALL present and future users.

-- 1. Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Extend evidence_status enum if needed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'in_review' AND enumtypid = 'evidence_status'::regtype) THEN
    ALTER TYPE evidence_status ADD VALUE 'in_review';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'changes_requested' AND enumtypid = 'evidence_status'::regtype) THEN
    ALTER TYPE evidence_status ADD VALUE 'changes_requested';
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 3. Adjust quiz_attempts table so lesson_id and user_id support any format without strict blocking
ALTER TABLE quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_lesson_id_fkey;
ALTER TABLE quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_user_id_fkey;
ALTER TABLE quiz_attempts ALTER COLUMN lesson_id TYPE TEXT;
ALTER TABLE quiz_attempts ALTER COLUMN user_id TYPE TEXT;

-- 4. Adjust evidence_items and reviews tables to support string deliverable IDs ('ev-...') and flexible user_ids
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

-- 5. Adjust readiness_snapshots table
ALTER TABLE readiness_snapshots DROP CONSTRAINT IF EXISTS readiness_snapshots_user_id_fkey;
ALTER TABLE readiness_snapshots ALTER COLUMN user_id TYPE TEXT;

-- 6. Loosen foreign key on profiles so account creation is never blocked
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 7. AUTOMATIC PROFILE TRIGGER FOR ALL PRESENT & FUTURE USERS
-- Whenever any user signs up or is created in auth.users, automatically create their public.profiles row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_initials, avatar_colour, role, status, must_change_password)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, 'User'), '@', 1)),
    UPPER(SUBSTRING(COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, 'US'), '@', 1)), 1, 2)),
    'blue',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'learner'::user_role),
    'active'::account_status,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE WHEN profiles.full_name IS NULL OR profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Backfill ALL existing users in auth.users into public.profiles
INSERT INTO public.profiles (id, email, full_name, avatar_initials, avatar_colour, role, status, must_change_password)
SELECT
  u.id,
  COALESCE(u.email, ''),
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(COALESCE(u.email, 'User'), '@', 1)),
  UPPER(SUBSTRING(COALESCE(u.raw_user_meta_data->>'full_name', split_part(COALESCE(u.email, 'US'), '@', 1)), 1, 2)),
  'blue',
  COALESCE((u.raw_user_meta_data->>'role')::user_role, 'learner'::user_role),
  'active'::account_status,
  false
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- 9. Seed Default Organisation & Career Pathway
INSERT INTO organisations (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000001', 'Advantcore Academy', 'advantcore-academy')
ON CONFLICT (id) DO NOTHING;

INSERT INTO career_pathways (id, org_id, title, slug, career_family, target_outcome, default_duration_weeks, mastery_threshold, is_published)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Business Analysis',
  'business-analysis',
  'Business Analysis & Consulting',
  'BCS Foundation Certificate in Business Analysis',
  12,
  80,
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO companies (id, org_id, name, industry, domain_context)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'Advantcore Ltd',
  'Professional Services',
  'B2B professional services and workflow transformation'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, pathway_id, company_id, code, title, description, start_date, end_date)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  'ADV-BA-001',
  'Enquiry-to-delivery process transformation',
  'Investigate friction across lead qualification, project hand-off and delivery mobilisation, then recommend a controlled future-state process.',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '90 days'
)
ON CONFLICT (code) DO NOTHING;
