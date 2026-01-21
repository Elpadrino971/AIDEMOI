import { NextRequest, NextResponse } from 'next/server'
import { translateText, translateTexts } from '@/lib/translation/deepl'
import { saveTranslation } from '@/lib/supabase/queries'
import { LanguageCode } from '@/lib/constants/languages'
import { TranslationRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: TranslationRequest & {
      responseId?: string
      texts?: string[]
    } = await request.json()

    const {
      text,
      texts,
      targetLanguage,
      sourceLanguage = 'fr',
      responseId
    } = body

    // Validation
    if (!targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required field: targetLanguage' },
        { status: 400 }
      )
    }

    if (!text && (!texts || texts.length === 0)) {
      return NextResponse.json(
        { error: 'Missing required field: text or texts' },
        { status: 400 }
      )
    }

    // Handle single text translation
    if (text) {
      const translatedText = await translateText(
        text,
        targetLanguage as LanguageCode,
        sourceLanguage as LanguageCode
      )

      return NextResponse.json({
        translatedText,
        sourceLanguage,
        targetLanguage,
      })
    }

    // Handle multiple texts translation
    if (texts && texts.length > 0) {
      const translatedTexts = await translateTexts(
        texts,
        targetLanguage as LanguageCode,
        sourceLanguage as LanguageCode
      )

      // If responseId provided, save to database
      if (responseId && translatedTexts.length > 0) {
        await saveTranslation(responseId, targetLanguage, {
          translated_response: translatedTexts[0] || '',
          translated_hints: translatedTexts.slice(1, 4),
          translated_explanations: translatedTexts.slice(4),
        })
      }

      return NextResponse.json({
        translatedTexts,
        sourceLanguage,
        targetLanguage,
      })
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve cached translations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const responseId = searchParams.get('responseId')
    const targetLanguage = searchParams.get('targetLanguage')

    if (!responseId || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required parameters: responseId, targetLanguage' },
        { status: 400 }
      )
    }

    // This would query the translations table
    // For now, return a not implemented response
    return NextResponse.json(
      { error: 'GET endpoint not fully implemented yet' },
      { status: 501 }
    )

  } catch (error) {
    console.error('Translation GET error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve translation' },
      { status: 500 }
    )
  }
}
