'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Lightbulb, BookOpen, CheckCircle, Brain } from 'lucide-react'

interface ResponseDisplayProps {
  answer: string
  hints?: string[]
  explanations?: string[]
  mnemonicTechniques?: string[]
}

export default function ResponseDisplay({ answer, hints, explanations, mnemonicTechniques }: ResponseDisplayProps) {
  return (
    <Card className="mt-6 border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Voici de l'aide pour toi !
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Full answer */}
        <div className="prose prose-blue max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {answer}
          </div>
        </div>

        {/* Hints section */}
        {hints && hints.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5" />
              Indices
            </h4>
            <ul className="space-y-2">
              {hints.map((hint, index) => (
                <li key={index} className="text-sm text-yellow-800 flex items-start gap-2">
                  <span className="font-bold">{index + 1}.</span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Explanations section */}
        {explanations && explanations.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5" />
              Méthode à suivre
            </h4>
            <ul className="space-y-2">
              {explanations.map((explanation, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{explanation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mnemonic Techniques section */}
        {mnemonicTechniques && mnemonicTechniques.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5" />
              Techniques pour retenir 🧠
            </h4>
            <ul className="space-y-3">
              {mnemonicTechniques.map((technique, index) => (
                <li key={index} className="text-sm text-purple-800 bg-white rounded p-3 border border-purple-100">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">✨</span>
                    <span className="font-medium">{technique}</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs text-purple-700 mt-3 italic">
              💡 Ces techniques t'aideront à mieux mémoriser et comprendre !
            </p>
          </div>
        )}

        {/* Encouragement */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-sm text-green-800">
            💪 <strong>N'oublie pas :</strong> Essaie d'abord par toi-même avec ces indices.
            Tu peux revenir poser une autre question si tu bloques encore !
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
