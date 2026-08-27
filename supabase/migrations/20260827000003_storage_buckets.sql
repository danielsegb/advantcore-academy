-- Advantcore Academy Production Schema Migration: 003_storage_buckets
-- Created: 27 August 2026

-- Create Storage Buckets (Private by default)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('knowledge-sources', 'knowledge-sources', false, 15728640, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown']),
  ('project-resources', 'project-resources', false, 15728640, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'text/plain']),
  ('user-evidence', 'user-evidence', false, 15728640, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'text/plain']),
  ('meeting-recordings', 'meeting-recordings', false, 52428800, ARRAY['video/webm', 'video/mp4', 'audio/webm', 'audio/mp3']),
  ('exports', 'exports', false, 15728640, ARRAY['application/pdf', 'application/zip', 'text/csv'])
ON CONFLICT (id) DO NOTHING;

-- Storage Bucket Policies
CREATE POLICY "Admins have full access to storage objects"
  ON storage.objects FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Learners can upload to user-evidence folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'user-evidence' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Learners can read own user-evidence"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'user-evidence' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Learners can read knowledge sources and project resources"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id IN ('knowledge-sources', 'project-resources'));
