'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import LanguageSelector from '@/components/shared/LanguageSelector'
import TranslatedResponse from '@/components/parent/TranslatedResponse'
import { LanguageCode } from '@/lib/constants/languages'
import { ArrowLeft, Users, Calendar } from 'lucide-react'

// Mock data for demonstration
const MOCK_QUESTIONS = [
  {
    id: '1',
    responseId: 'r1',
    studentName: 'Marie',
    date: '2026-01-21',
    subject: 'Mathématiques',
    question: 'Je ne comprends pas comment faire une division à 2 chiffres',
    answer: 'Pour faire une division à 2 chiffres, voici la méthode :\n\n1. Regarde combien de fois le diviseur entre dans les premiers chiffres du dividende\n2. Écris ce nombre au quotient\n3. Multiplie et soustrais\n4. Descends le chiffre suivant\n5. Recommence jusqu\'à la fin\n\nEssaie avec un exemple simple d\'abord, comme 156 ÷ 12.',
    hints: [
      'Commence par regarder si 12 entre dans 15',
      'Une fois que tu as trouvé combien de fois, multiplie et soustrais',
      'N\'oublie pas de descendre le chiffre suivant avant de continuer',
    ],
    explanations: [
      'Diviser les deux premiers chiffres par le diviseur',
      'Multiplier le résultat par le diviseur',
      'Soustraire du nombre de départ',
      'Descendre le chiffre suivant',
    ],
  },
]

export default function ParentPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('fr')
  const [selectedStudent, setSelectedStudent] = useState<string>('all')

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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
                👨‍👩‍👧‍👦 Espace Parent
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Welcome and language selector */}
          <div className="mb-6 grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Vos enfants</h3>
                    <p className="text-sm text-gray-600">
                      Suivez l'activité de vos enfants
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <LanguageSelector
                  value={selectedLanguage}
                  onChange={setSelectedLanguage}
                  label="Choisir votre langue"
                />
              </CardContent>
            </Card>
          </div>

          {/* Info banner */}
          <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg">
            <p className="text-green-900 text-center">
              🌍 <strong>Traduction automatique</strong> - Toutes les questions et réponses
              sont traduites dans votre langue pour vous aider à suivre les devoirs de votre enfant.
            </p>
          </div>

          {/* Student filter */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Filtrer par enfant :
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Tous les enfants</option>
                  <option value="marie">Marie (CM1)</option>
                  <option value="jean">Jean (CE2)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Activité récente
            </h2>
          </div>

          {/* Questions list */}
          <div className="space-y-6">
            {MOCK_QUESTIONS.map((question) => (
              <div key={question.id}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="font-semibold">{question.studentName}</span>
                    <span>•</span>
                    <span>{question.subject}</span>
                    <span>•</span>
                    <span>{question.date}</span>
                  </div>
                </div>
                <TranslatedResponse
                  questionText={question.question}
                  answerText={question.answer}
                  hints={question.hints}
                  explanations={question.explanations}
                  targetLanguage={selectedLanguage}
                  responseId={question.responseId}
                />
              </div>
            ))}
          </div>

          {/* Empty state (if no questions) */}
          {MOCK_QUESTIONS.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">
                  Aucune question récente de vos enfants
                </p>
                <p className="text-sm text-gray-400">
                  Les questions apparaîtront ici dès que vos enfants utiliseront l'application
                </p>
              </CardContent>
            </Card>
          )}

          {/* Help section for parents */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="py-6">
                <h3 className="font-semibold text-lg mb-2">💡 Conseils</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Encouragez l'autonomie de votre enfant</li>
                  <li>• Posez des questions plutôt que donner les réponses</li>
                  <li>• Félicitez les efforts, pas seulement les résultats</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <h3 className="font-semibold text-lg mb-2">📊 Statistiques</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Questions cette semaine :</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Matière la plus demandée :</span>
                    <span className="font-semibold">Mathématiques</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
