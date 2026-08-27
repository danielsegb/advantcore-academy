# Advantcore Academy — Platform Owner & Administrator Guide

## Overview

Advantcore Academy operates on a strict administrative approval model. Learners cannot register independently; all accounts are provisioned and approved by the Administrator.

---

## 1. Learner Onboarding Workflow

### Creating a New Learner Account
1. Sign in with your Administrator credentials.
2. Open the **Admin Studio** from the left navigation bar.
3. In the **User Management** tab, click **Invite New Learner**.
4. Provide the learner's:
   - Full Name (e.g., `Amanda Okafor`)
   - Corporate Email (e.g., `amanda@advantcore.co`)
   - Initial Temporary Password
   - Assigned Pathway (`Business Analyst Career Accelerator`)
5. Click **Provision Account**.

### Account Approval & Activation
- New accounts remain in `pending` status until you click **Approve & Activate**.
- Upon initial sign-in, the learner is greeted with a mandatory **Change Temporary Password** modal. The system will not permit workspace access until a secure personal password is set.

---

## 2. Guided Pathway & Curriculum Management

### Authoring New Career Pathways
1. Navigate to **Admin Studio > Guided Pathway Builder**.
2. Follow the 5-Step Guided Process:
   - **Step 1: Core Pathway Metadata:** Set title, slug, target role, and accredited certification.
   - **Step 2: Company Context:** Define client industry, business domain, and challenges.
   - **Step 3: Learning Modules:** Review BCS Foundation syllabus modules and lesson outcomes.
   - **Step 4: Workplace Project Stages:** Configure the 5 project stages and deliverable tasks.
   - **Step 5: Characters & AI Team:** Configure Sarah Mitchell (Sponsor), Marcus Cole (BA Supervisor), Priya Shah (Operations), and Helen Grant (Reviewer).
3. Click **Publish Pathway**. The pathway is immediately available for learner assignment.

---

## 3. Workplace Deliverables & Independent Review

### Reviewing Learner Evidence
1. When a learner submits a deliverable (e.g., *As-Is Process Swimlane Diagram*), its status transitions to `in_review`.
2. As Administrator / Reviewer, you can inspect the deliverable in the **Workplace** view.
3. Review against the BCS acceptance criteria:
   - **Request Changes:** Provide constructive coaching feedback. The deliverable reverts to `changes_requested`.
   - **Approve:** The deliverable is marked `approved` with an immutable timestamp.
4. Only approved deliverables are included in the learner's final **Executive Case Study Portfolio Export**.

---

## 4. Grounded AI & Persona Configuration

- AI character prompts are strictly grounded in administrator-approved source documents (`[ADV-DOC-001]`, `[ADV-SOP-002]`, `[BCS-BA-001]`, `[ADV-RACI-003]`).
- Source documents are encapsulated in untrusted data delimiters to prevent prompt injection.
- If cloud AI keys (Groq/Gemini) are unavailable, the local deterministic British English rule engine handles meetings and quiz grading automatically.

---

## 5. UK GDPR & Compliance Oversight

- Access requests (DSAR) and account erasure requests are accessible via the **Privacy & Data Rights Center**.
- Uploaded files are automatically checked for magic-byte signatures and stored in quarantine until reviewed.
