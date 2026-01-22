'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import QuestionForm from '@/components/student/QuestionForm'
import ResponseDisplay from '@/components/student/ResponseDisplay'
import { HomeworkHelpResponse } from '@/types'
import { ArrowLeft } from 'lucide-react'

export default function StudentPage() {
  const [response, setResponse] = useState<(HomeworkHelpResponse & { questionId: string; responseId: string }) | null>(null)
  const [showNewQuestion, setShowNewQuestion] = useState(true)

  const handleResponse = (data: HomeworkHelpResponse & { questionId: string; responseId: string }) => {
    setResponse(data)
    setShowNewQuestion(false)
  }

  const handleNewQuestion = () => {
    setResponse(null)
    setShowNewQuestion(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Accueil
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                📚 Espace Élève
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">5 questions</span> restantes aujourd'hui
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome message */}
          <div className="mb-6 p-4 bg-blue-100 border border-blue-200 rounded-lg">
            <p className="text-blue-900 text-center">
              👋 <strong>Bienvenue !</strong> Pose ta question sur tes devoirs et je t'aiderai à comprendre.
              Je ne vais pas faire ton travail à ta place, mais te guider pour que tu trouves la réponse !
            </p>
          </div>

          {/* Question form */}
          <Card>
            <CardHeader>
              <CardTitle>Pose ta question</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionForm onResponse={handleResponse} />
            </CardContent>
          </Card>

          {/* Response display */}
          {response && (
            <>
              <ResponseDisplay
                answer={response.answer}
                hints={response.hints}
                explanations={response.explanations}
                mnemonicTechniques={response.mnemonicTechniques}
              />

              {/* New question button */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleNewQuestion}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  ➕ Poser une nouvelle question
                </button>
              </div>
            </>
          )}

          {/* Tips section */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="font-semibold mb-1">Sois précis</h3>
              <p className="text-sm text-gray-600">
                Plus ta question est claire, plus je pourrai t'aider efficacement
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-semibold mb-1">Donne du contexte</h3>
              <p className="text-sm text-gray-600">
                N'hésite pas à expliquer ce que tu as déjà essayé
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Essaie d'abord</h3>
              <p className="text-sm text-gray-600">
                Utilise les indices pour réfléchir avant de demander plus d'aide
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
