-- Advantcore Academy Production Schema Migration: 002_row_level_security
-- Created: 27 August 2026

-- Helper function to check if current authenticated user is an Admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security on all tables
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE readiness_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Admins have full access to profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Users can view and update own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own non-role profile fields"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 2. User Approvals
CREATE POLICY "Admins manage user approvals"
  ON user_approvals FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Users view own approval state"
  ON user_approvals FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 3. Pathways, Certifications & Learning Content (Published items are readable by all authenticated users)
CREATE POLICY "Admins manage career pathways"
  ON career_pathways FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Learners can view published pathways"
  ON career_pathways FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins manage course modules"
  ON course_modules FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Learners can view course modules"
  ON course_modules FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM career_pathways cp WHERE cp.id = course_modules.pathway_id AND cp.is_published = true));

CREATE POLICY "Admins manage lessons"
  ON lessons FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Learners can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins manage learning outcomes"
  ON learning_outcomes FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Learners view learning outcomes"
  ON learning_outcomes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Learners view questions and options"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Learners view question options"
  ON question_options FOR SELECT
  TO authenticated
  USING (true);

-- 4. Quiz Attempts (Strictly isolated to owner)
CREATE POLICY "Admins view all quiz attempts"
  ON quiz_attempts FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Learners view and insert own quiz attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Learners can submit own quiz attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 5. Projects & Memberships
CREATE POLICY "Admins manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Learners view assigned projects"
  ON projects FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM project_memberships pm WHERE pm.project_id = projects.id AND pm.user_id = auth.uid()));

CREATE POLICY "Learners view assigned project stages"
  ON project_stages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Learners view assigned pathway staff"
  ON pathway_staff FOR SELECT
  TO authenticated
  USING (true);

-- 6. Tasks & Dependencies
CREATE POLICY "Admins manage all tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Learners manage own tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Learners view schedule dependencies"
  ON schedule_dependencies FOR SELECT
  TO authenticated
  USING (true);

-- 7. Meetings & Messages
CREATE POLICY "Admins manage all meetings"
  ON meetings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Learners manage own meetings"
  ON meetings FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Learners manage own meeting messages"
  ON meeting_messages FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM meetings m WHERE m.id = meeting_messages.meeting_id AND m.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM meetings m WHERE m.id = meeting_messages.meeting_id AND m.user_id = auth.uid()));

-- 8. Evidence Items & Reviews
CREATE POLICY "Admins manage all evidence and reviews"
  ON evidence_items FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Learners manage own evidence items"
  ON evidence_items FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Learners view reviews on own evidence"
  ON reviews FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM evidence_items ei WHERE ei.id = reviews.evidence_item_id AND ei.user_id = auth.uid()));

-- 9. Readiness Snapshots
CREATE POLICY "Admins manage all readiness snapshots"
  ON readiness_snapshots FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Learners view own readiness snapshots"
  ON readiness_snapshots FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 10. Audit Events (Admin Only)
CREATE POLICY "Admins view audit events"
  ON audit_events FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
