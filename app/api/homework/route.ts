import { NextRequest, NextResponse } from 'next/server'
import anthropic from '@/lib/anthropic/client'
import { buildHomeworkAssistantPrompt } from '@/lib/anthropic/prompts'
import {
  createHomeworkQuestion,
  createHomeworkResponse,
  checkUsageQuota,
  incrementUsageQuota,
  getStudentProfile
} from '@/lib/supabase/queries'
import { HomeworkHelpRequest, HomeworkHelpResponse } from '@/types'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: HomeworkHelpRequest = await request.json()
    const { question, subject, gradeLevel, context, studentLanguage } = body

    // Validation
    if (!question || !subject || !gradeLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: question, subject, gradeLevel' },
        { status: 400 }
      )
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get student profile
    const studentProfile = await getStudentProfile(user.id)

    if (!studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    // Check usage quota
    const canAsk = await checkUsageQuota(user.id)

    if (!canAsk) {
      return NextResponse.json(
        { error: 'Daily limit reached. Please upgrade to premium or try again tomorrow.' },
        { status: 429 }
      )
    }

    // Build the system prompt
    const systemPrompt = buildHomeworkAssistantPrompt(gradeLevel, subject)

    // Build user message
    const userMessage = context
      ? `Question de l'élève : ${question}\n\nContexte supplémentaire : ${context}`
      : `Question de l'élève : ${question}`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    // Extract response
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    // Parse response into structured format
    const structuredResponse = parseAssistantResponse(responseText)

    // Save to database
    const savedQuestion = await createHomeworkQuestion(studentProfile.id, {
      subject,
      grade_level: gradeLevel,
      question,
      context,
    })

    const savedResponse = await createHomeworkResponse(savedQuestion.id, {
      original_response: responseText,
      hints: structuredResponse.hints,
      explanations: structuredResponse.explanations,
      mnemonic_techniques: structuredResponse.mnemonicTechniques,
    })

    // Increment usage quota
    await incrementUsageQuota(user.id)

    // Return response
    return NextResponse.json({
      questionId: savedQuestion.id,
      responseId: savedResponse.id,
      answer: responseText,
      hints: structuredResponse.hints,
      explanations: structuredResponse.explanations,
      mnemonicTechniques: structuredResponse.mnemonicTechniques,
    })

  } catch (error) {
    console.error('Homework API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to parse the assistant's response
function parseAssistantResponse(text: string): {
  hints: string[]
  explanations: string[]
  mnemonicTechniques: string[]
} {
  const hints: string[] = []
  const explanations: string[] = []
  const mnemonicTechniques: string[] = []

  // Simple parsing - look for numbered points or bullet points
  const lines = text.split('\n')

  let inHintsSection = false
  let inExplanationSection = false
  let inMnemonicSection = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    // Detect sections
    if (trimmedLine.toLowerCase().includes('indice') ||
        trimmedLine.toLowerCase().includes('hint')) {
      inHintsSection = true
      inExplanationSection = false
      inMnemonicSection = false
      continue
    }

    if (trimmedLine.toLowerCase().includes('explication') ||
        trimmedLine.toLowerCase().includes('méthode') ||
        trimmedLine.toLowerCase().includes('étape')) {
      inExplanationSection = true
      inHintsSection = false
      inMnemonicSection = false
      continue
    }

    if (trimmedLine.toLowerCase().includes('mnémotechnique') ||
        trimmedLine.toLowerCase().includes('mnemonic') ||
        trimmedLine.toLowerCase().includes('pour retenir') ||
        trimmedLine.toLowerCase().includes('pour mémoriser')) {
      inMnemonicSection = true
      inHintsSection = false
      inExplanationSection = false
      continue
    }

    // Extract numbered or bulleted items
    if (trimmedLine.match(/^[\d\-•*]/)) {
      const content = trimmedLine.replace(/^[\d\-•*.\)]+\s*/, '')

      if (content) {
        if (inHintsSection) {
          hints.push(content)
        } else if (inMnemonicSection) {
          mnemonicTechniques.push(content)
        } else if (inExplanationSection) {
          explanations.push(content)
        } else {
          // Default to explanations if no section detected
          explanations.push(content)
        }
      }
    }
  }

  // If no structured parsing worked, split into sentences as fallback
  if (hints.length === 0 && explanations.length === 0) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
    explanations.push(...sentences.slice(0, 3))
  }

  return { hints, explanations, mnemonicTechniques }
}
