'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { LanguageCode } from '@/lib/constants/languages'
import { Languages, Lightbulb, BookOpen } from 'lucide-react'

interface TranslatedResponseProps {
  questionText: string
  answerText: string
  hints: string[]
  explanations: string[]
  targetLanguage: LanguageCode
  responseId: string
}

export default function TranslatedResponse({
  questionText,
  answerText,
  hints,
  explanations,
  targetLanguage,
  responseId,
}: TranslatedResponseProps) {
  const [translatedData, setTranslatedData] = useState<{
    question: string
    answer: string
    hints: string[]
    explanations: string[]
  } | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Si la langue cible est le français, pas besoin de traduire
    if (targetLanguage === 'fr') {
      setTranslatedData({
        question: questionText,
        answer: answerText,
        hints,
        explanations,
      })
      return
    }

    // Sinon, traduire
    translateContent()
  }, [targetLanguage, questionText, answerText])

  const translateContent = async () => {
    setIsTranslating(true)
    setError('')

    try {
      // Préparer tous les textes à traduire
      const textsToTranslate = [
        questionText,
        answerText,
        ...hints,
        ...explanations,
      ]

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: textsToTranslate,
          targetLanguage,
          sourceLanguage: 'fr',
          responseId,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur de traduction')
      }

      const data = await response.json()
      const translated = data.translatedTexts

      setTranslatedData({
        question: translated[0] || questionText,
        answer: translated[1] || answerText,
        hints: translated.slice(2, 2 + hints.length),
        explanations: translated.slice(2 + hints.length),
      })
    } catch (err) {
      setError('Impossible de traduire le contenu')
      console.error(err)
    } finally {
      setIsTranslating(false)
    }
  }

  if (isTranslating) {
    return (
      <Card className="animate-pulse">
        <CardContent className="py-8 text-center text-gray-500">
          <Languages className="w-8 h-8 mx-auto mb-2 animate-spin" />
          Traduction en cours...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="py-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={translateContent} variant="primary">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!translatedData) return null

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <Languages className="w-6 h-6" />
          Question de votre enfant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Question :</h4>
          <p className="text-gray-800">{translatedData.question}</p>
        </div>

        {/* Answer */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Aide fournie :
          </h4>
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {translatedData.answer}
          </div>
        </div>

        {/* Hints */}
        {translatedData.hints && translatedData.hints.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Indices donnés :</h4>
            <ul className="space-y-2">
              {translatedData.hints.map((hint, index) => (
                <li key={index} className="text-sm text-yellow-800 flex items-start gap-2">
                  <span className="font-bold">{index + 1}.</span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Explanations */}
        {translatedData.explanations && translatedData.explanations.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Méthode suggérée :
            </h4>
            <ul className="space-y-2">
              {translatedData.explanations.map((explanation, index) => (
                <li key={index} className="text-sm text-purple-800 flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{explanation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Parent tips */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">💡 Comment aider votre enfant :</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Encouragez-le à essayer par lui-même avec les indices</li>
            <li>✓ Posez-lui des questions pour le guider dans sa réflexion</li>
            <li>✓ Félicitez ses efforts, pas seulement le résultat final</li>
            <li>✓ Si besoin, décomposez le problème en étapes plus simples</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
