-- Advantcore Academy Fictional Demonstration Seed Script
-- Created: 27 August 2026

DO $$
DECLARE
  v_org_id UUID;
  v_company_id UUID;
  v_pathway_id UUID;
  v_project_id UUID;
  v_module_3_id UUID;
  v_lesson_4_id UUID;
  v_qbank_id UUID;
  v_question_1_id UUID;
  v_stage_1_id UUID;
  v_stage_2_id UUID;
BEGIN
  -- 1. Create Default Organisation
  INSERT INTO organisations (name, slug)
  VALUES ('Advantcore Group', 'advantcore-group')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_org_id;

  -- 2. Create Company
  INSERT INTO companies (org_id, name, industry, domain_context)
  VALUES (v_org_id, 'Advantcore Ltd', 'Technology Consulting & Digital Operations', 'Enterprise digital delivery and workflow solutions.')
  RETURNING id INTO v_company_id;

  -- 3. Create Career Pathway (Business Analysis)
  INSERT INTO career_pathways (org_id, title, slug, career_family, target_outcome, default_duration_weeks, mastery_threshold, is_published)
  VALUES (
    v_org_id,
    'Business Analyst Career Accelerator',
    'business-analyst',
    'business',
    'Become certification-ready and job-ready through structured learning, assessed project work, an evidence portfolio and interview preparation.',
    12,
    90,
    true
  )
  ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_pathway_id;

  -- 4. Create Certification
  INSERT INTO certifications (pathway_id, title, awarding_body, exam_format, question_count, duration_minutes, pass_percentage, academy_target_percentage, source_url)
  VALUES (
    v_pathway_id,
    'BCS Foundation Certificate in Business Analysis',
    'BCS, The Chartered Institute for IT',
    'Multiple Choice',
    40,
    60,
    65,
    90,
    'https://www.bcs.org/qualifications-and-certifications/certifications-for-professionals/business-analysis/foundation-certificate-in-business-analysis/'
  );

  -- 5. Create Course Modules
  INSERT INTO course_modules (pathway_id, module_number, title, description, order_index) VALUES
    (v_pathway_id, '01', 'Business analysis foundations', 'Role, competencies, strategic context and lifecycle.', 1),
    (v_pathway_id, '02', 'Strategy analysis', 'External environment, internal capability and SWOT.', 2),
    (v_pathway_id, '03', 'Stakeholder analysis', 'Stakeholder identification, power-interest grid and engagement.', 3),
    (v_pathway_id, '04', 'Business systems modelling', 'Process modelling, POPIT and system boundaries.', 4),
    (v_pathway_id, '05', 'Requirements engineering', 'Elicitation, analysis, documentation and validation.', 5),
    (v_pathway_id, '06', 'Business cases', 'Options evaluation, cost-benefit analysis and risk.', 6)
  RETURNING id INTO v_module_3_id;

  -- 6. Create Lesson for Module 3
  INSERT INTO lessons (module_id, lesson_number, title, intro, content_markdown, estimated_minutes, order_index)
  VALUES (
    v_module_3_id,
    '3.4',
    'Managing stakeholder relationships',
    'Select engagement approaches that reflect stakeholder influence, interest, attitudes and information needs.',
    '# Managing Stakeholder Relationships\n\nStakeholder management ensures that individuals and groups impacted by a business change are engaged effectively throughout the project lifecycle.',
    25,
    4
  )
  RETURNING id INTO v_lesson_4_id;

  -- 7. Create Learning Outcomes
  INSERT INTO learning_outcomes (lesson_id, description, order_index) VALUES
    (v_lesson_4_id, 'Explain stakeholder management strategy', 1),
    (v_lesson_4_id, 'Apply the power-interest grid', 2),
    (v_lesson_4_id, 'Recommend suitable communication approaches', 3);

  -- 8. Create Question Bank & Quiz Questions
  INSERT INTO question_banks (lesson_id, title)
  VALUES (v_lesson_4_id, 'Stakeholder Analysis Mastery Check')
  RETURNING id INTO v_qbank_id;

  INSERT INTO questions (question_bank_id, prompt, explanation, order_index)
  VALUES (
    v_qbank_id,
    'What is the primary purpose of a stakeholder power-interest grid?',
    'The power-interest grid categorises stakeholders by their level of influence and interest to determine the most effective communication and management strategy.',
    1
  )
  RETURNING id INTO v_question_1_id;

  INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index) VALUES
    (v_question_1_id, 'identify', 'To identify every person in the organisation', false, 1),
    (v_question_1_id, 'manage', 'To determine an appropriate engagement approach', true, 2),
    (v_question_1_id, 'rank', 'To rank stakeholders by job seniority', false, 3),
    (v_question_1_id, 'replace', 'To replace stakeholder interviews', false, 4);

  -- 9. Create Project (Enquiry-to-delivery transformation)
  INSERT INTO projects (pathway_id, company_id, code, title, description, start_date, end_date)
  VALUES (
    v_pathway_id,
    v_company_id,
    'ADV-BA-001',
    'Enquiry-to-delivery process transformation',
    'Investigate friction across lead qualification, project hand-off and delivery mobilisation, then recommend a controlled future-state process.',
    '2026-08-12',
    '2026-10-30'
  )
  RETURNING id INTO v_project_id;

  -- 10. Create Project Stages
  INSERT INTO project_stages (project_id, stage_number, name, order_index) VALUES
    (v_project_id, 1, 'Initiate', 1),
    (v_project_id, 2, 'Discover', 2),
    (v_project_id, 3, 'Analyse', 3),
    (v_project_id, 4, 'Design', 4),
    (v_project_id, 5, 'Validate', 5);

  -- 11. Create Pathway Staff / AI Characters
  INSERT INTO pathway_staff (project_id, pathway_id, name, role, initials, colour, behaviour_instructions, knowledge_scope, is_ai) VALUES
    (v_project_id, v_pathway_id, 'Sarah Mitchell', 'Project Sponsor', 'SM', 'coral', 'Set strategic direction, protect commercial value and approve project charter.', 'Project objectives, budget and business outcomes', true),
    (v_project_id, v_pathway_id, 'Marcus Cole', 'BA Supervisor', 'MC', 'blue', 'Coach through questions, challenge unsupported assumptions and protect professional standards.', 'Business analysis methodology, BCS standards and evidence quality', true),
    (v_project_id, v_pathway_id, 'Priya Shah', 'Operations Lead', 'PS', 'violet', 'Explain day-to-day operational pain points, spreadsheet hand-offs and delivery constraints.', 'Lead qualification, delivery mobilisation and internal tooling', true),
    (v_project_id, v_pathway_id, 'Helen Grant', 'Independent Reviewer', 'HG', 'gold', 'Conduct independent evidence audits and ensure evidence meets rigorous assessment criteria.', 'Independent quality standards and rubric compliance', true);

END $$;
