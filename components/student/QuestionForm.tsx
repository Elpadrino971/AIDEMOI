'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { SUBJECTS, GRADE_LEVELS, SubjectId, GradeLevel } from '@/lib/constants/languages'
import { HomeworkHelpRequest, HomeworkHelpResponse } from '@/types'

interface QuestionFormProps {
  onResponse: (response: HomeworkHelpResponse & { questionId: string; responseId: string }) => void
  initialGradeLevel?: GradeLevel
}

export default function QuestionForm({ onResponse, initialGradeLevel = 'cm1' }: QuestionFormProps) {
  const [subject, setSubject] = useState<SubjectId>('math')
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(initialGradeLevel)
  const [question, setQuestion] = useState('')
  const [context, setContext] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!question.trim()) {
      setError('Merci de poser une question')
      return
    }

    setIsLoading(true)

    try {
      const requestBody: HomeworkHelpRequest = {
        question: question.trim(),
        subject,
        gradeLevel,
        context: context.trim() || undefined,
      }

      const response = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Une erreur est survenue')
      }

      const data = await response.json()
      onResponse(data)

      // Reset form
      setQuestion('')
      setContext('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Select
          label="Matière"
          value={subject}
          onChange={(e) => setSubject(e.target.value as SubjectId)}
        >
          {Object.entries(SUBJECTS).map(([id, subj]) => (
            <option key={id} value={id}>
              {subj.icon} {subj.name}
            </option>
          ))}
        </Select>

        <Select
          label="Niveau"
          value={gradeLevel}
          onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
        >
          {Object.entries(GRADE_LEVELS).map(([id, level]) => (
            <option key={id} value={id}>
              {level.name}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Ta question"
        placeholder="Exemple : Je ne comprends pas comment faire une division à 2 chiffres..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        required
        error={error}
      />

      <Textarea
        label="Contexte (optionnel)"
        placeholder="Tu peux ajouter des détails supplémentaires, comme l'exercice complet ou ce que tu as déjà essayé..."
        value={context}
        onChange={(e) => setContext(e.target.value)}
        rows={3}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        {isLoading ? 'Réflexion en cours...' : 'Obtenir de l\'aide 🤔'}
      </Button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </form>
  )
}
