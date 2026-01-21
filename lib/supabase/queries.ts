import { supabase } from './client'
import { supabaseAdmin } from './server'
import type {
  HomeworkQuestion,
  HomeworkResponse,
  UsageQuota,
  StudentProfile,
  ParentProfile
} from '@/types'

// User and Profile queries
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function getStudentProfile(userId: string) {
  const { data, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data as StudentProfile
}

export async function getParentProfile(userId: string) {
  const { data, error } = await supabase
    .from('parent_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data as ParentProfile
}

// Homework questions
export async function createHomeworkQuestion(
  studentId: string,
  question: Partial<HomeworkQuestion>
) {
  const { data, error } = await supabase
    .from('homework_questions')
    .insert({
      student_id: studentId,
      ...question,
    })
    .select()
    .single()

  if (error) throw error
  return data as HomeworkQuestion
}

export async function getStudentQuestions(studentId: string, limit = 20) {
  const { data, error } = await supabase
    .from('homework_questions')
    .select('*, homework_responses(*)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// Homework responses
export async function createHomeworkResponse(
  questionId: string,
  response: Partial<HomeworkResponse>
) {
  const { data, error } = await supabase
    .from('homework_responses')
    .insert({
      question_id: questionId,
      ...response,
    })
    .select()
    .single()

  if (error) throw error
  return data as HomeworkResponse
}

export async function getQuestionWithResponse(questionId: string) {
  const { data, error } = await supabase
    .from('homework_questions')
    .select(`
      *,
      homework_responses (
        *,
        translations (*)
      )
    `)
    .eq('id', questionId)
    .single()

  if (error) throw error
  return data
}

// Translations
export async function saveTranslation(
  responseId: string,
  targetLanguage: string,
  translation: {
    translated_response: string
    translated_hints?: string[]
    translated_explanations?: string[]
  }
) {
  const { data, error } = await supabase
    .from('translations')
    .insert({
      response_id: responseId,
      target_language: targetLanguage,
      ...translation,
    })
    .select()
    .single()

  if (error) {
    // If translation already exists, update it
    if (error.code === '23505') {
      const { data: updated, error: updateError } = await supabase
        .from('translations')
        .update(translation)
        .eq('response_id', responseId)
        .eq('target_language', targetLanguage)
        .select()
        .single()

      if (updateError) throw updateError
      return updated
    }
    throw error
  }

  return data
}

// Usage quotas
export async function checkUsageQuota(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin.rpc('check_usage_quota', {
    p_user_id: userId,
  })

  if (error) throw error
  return data as boolean
}

export async function incrementUsageQuota(userId: string) {
  const { error } = await supabaseAdmin.rpc('increment_usage_quota', {
    p_user_id: userId,
  })

  if (error) throw error
}

export async function getUserQuota(userId: string): Promise<UsageQuota | null> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('usage_quotas')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as UsageQuota | null
}

// Parent-Student relationships
export async function getParentStudents(parentId: string) {
  const { data, error } = await supabase
    .from('student_parent_links')
    .select(`
      student_id,
      student_profiles (
        *,
        profiles (email, preferred_language)
      )
    `)
    .eq('parent_id', parentId)

  if (error) throw error
  return data
}

export async function getStudentRecentActivity(studentId: string, limit = 10) {
  const { data, error } = await supabase
    .from('homework_questions')
    .select(`
      *,
      homework_responses (*)
    `)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
