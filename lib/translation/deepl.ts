import * as deepl from 'deepl-node'
import { SUPPORTED_LANGUAGES, LanguageCode } from '@/lib/constants/languages'

const translator = new deepl.Translator(process.env.DEEPL_API_KEY!)

export async function translateText(
  text: string,
  targetLanguage: LanguageCode,
  sourceLanguage: LanguageCode = 'fr'
): Promise<string> {
  try {
    // Pour les langues non supportées par DeepL, on retourne le texte original
    const targetLangConfig = SUPPORTED_LANGUAGES[targetLanguage]
    const sourceLangConfig = SUPPORTED_LANGUAGES[sourceLanguage]

    if (!targetLangConfig || !sourceLangConfig) {
      console.warn(`Language not configured: ${targetLanguage} or ${sourceLanguage}`)
      return text
    }

    // Pour le créole et le hmong (non supportés par DeepL), on garde le français
    if (targetLanguage === 'gcr' || targetLanguage === 'hmn') {
      console.warn(`Language ${targetLanguage} not supported by DeepL, returning original text`)
      return text
    }

    const result = await translator.translateText(
      text,
      sourceLangConfig.deepLCode as deepl.SourceLanguageCode,
      targetLangConfig.deepLCode as deepl.TargetLanguageCode
    )

    return result.text
  } catch (error) {
    console.error('Translation error:', error)
    // En cas d'erreur, on retourne le texte original
    return text
  }
}

export async function translateTexts(
  texts: string[],
  targetLanguage: LanguageCode,
  sourceLanguage: LanguageCode = 'fr'
): Promise<string[]> {
  try {
    const targetLangConfig = SUPPORTED_LANGUAGES[targetLanguage]
    const sourceLangConfig = SUPPORTED_LANGUAGES[sourceLanguage]

    if (!targetLangConfig || !sourceLangConfig) {
      return texts
    }

    // Pour les langues non supportées, retourner les textes originaux
    if (targetLanguage === 'gcr' || targetLanguage === 'hmn') {
      return texts
    }

    const results = await translator.translateText(
      texts,
      sourceLangConfig.deepLCode as deepl.SourceLanguageCode,
      targetLangConfig.deepLCode as deepl.TargetLanguageCode
    )

    return Array.isArray(results) ? results.map(r => r.text) : [results.text]
  } catch (error) {
    console.error('Translation error:', error)
    return texts
  }
}

export async function getUsageStats() {
  try {
    const usage = await translator.getUsage()
    return {
      characterCount: usage.character?.count || 0,
      characterLimit: usage.character?.limit || 0,
      percentageUsed: usage.character
        ? ((usage.character.count / usage.character.limit) * 100).toFixed(2)
        : 0,
    }
  } catch (error) {
    console.error('Error getting DeepL usage stats:', error)
    return null
  }
}
