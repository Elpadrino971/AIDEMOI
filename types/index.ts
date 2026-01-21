import { LanguageCode, SubjectId, GradeLevel } from '@/lib/constants/languages'

export interface User {
  id: string
  email: string
  role: 'student' | 'parent' | 'teacher'
  created_at: string
  preferred_language?: LanguageCode
}

export interface StudentProfile {
  id: string
  user_id: string
  grade_level: GradeLevel
  parent_ids: string[]
  created_at: string
}

export interface ParentProfile {
  id: string
  user_id: string
  preferred_language: LanguageCode
  student_ids: string[]
  created_at: string
}

export interface HomeworkQuestion {
  id: string
  student_id: string
  subject: SubjectId
  grade_level: GradeLevel
  question: string
  context?: string
  created_at: string
  updated_at: string
}

export interface HomeworkResponse {
  id: string
  question_id: string
  original_response: string
  translated_responses: Record<LanguageCode, string>
  hints: string[]
  created_at: string
}

export interface UsageQuota {
  id: string
  user_id: string
  date: string
  questions_asked: number
  daily_limit: number
  subscription_tier: 'free' | 'premium' | 'school'
}

export interface TranslationRequest {
  text: string
  targetLanguage: LanguageCode
  sourceLanguage?: LanguageCode
}

export interface TranslationResponse {
  translatedText: string
  sourceLanguage: LanguageCode
  targetLanguage: LanguageCode
}

export interface HomeworkHelpRequest {
  question: string
  subject: SubjectId
  gradeLevel: GradeLevel
  context?: string
  studentLanguage?: LanguageCode
}

export interface HomeworkHelpResponse {
  answer: string
  hints: string[]
  explanations: string[]
  nextSteps?: string[]
}
