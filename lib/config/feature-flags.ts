export interface FeatureFlags {
  enableSupabaseAuth: boolean
  enablePersistentCurriculum: boolean
  enableLiveMeetingAI: boolean
  enableSpeechSynthesis: boolean
  enableScreenCapture: boolean
  enableEvidenceUploads: boolean
  enableMockExams: boolean
  enableAdaptiveCalendarSync: boolean
  enableAdminPathwayBuilder: boolean
}

export const defaultFeatureFlags: FeatureFlags = {
  enableSupabaseAuth: false, // Step 2
  enablePersistentCurriculum: false, // Step 4
  enableLiveMeetingAI: true, // Active
  enableSpeechSynthesis: true, // Active (Browser native)
  enableScreenCapture: true, // Active (Browser native)
  enableEvidenceUploads: false, // Step 8
  enableMockExams: false, // Step 4
  enableAdaptiveCalendarSync: false, // Step 7
  enableAdminPathwayBuilder: false, // Step 3
}

export function getFeatureFlag(flag: keyof FeatureFlags): boolean {
  return defaultFeatureFlags[flag] ?? false
}
