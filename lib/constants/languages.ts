export const SUPPORTED_LANGUAGES = {
  fr: { code: 'fr', name: 'Français', flag: '🇫🇷', deepLCode: 'FR' },
  en: { code: 'en', name: 'English', flag: '🇬🇧', deepLCode: 'EN-GB' },
  es: { code: 'es', name: 'Español', flag: '🇪🇸', deepLCode: 'ES' },
  pt: { code: 'pt', name: 'Português', flag: '🇧🇷', deepLCode: 'PT-BR' },
  ar: { code: 'ar', name: 'العربية', flag: '🇸🇦', deepLCode: 'AR' },
  zh: { code: 'zh', name: '中文', flag: '🇨🇳', deepLCode: 'ZH' },
  // Langues de Guyane
  gcr: { code: 'gcr', name: 'Kreyòl Gwiyanè', flag: '🇬🇫', deepLCode: 'FR' }, // Créole guyanais (via FR)
  hmn: { code: 'hmn', name: 'Hmoob', flag: '🇱🇦', deepLCode: 'EN-GB' }, // Hmong (via EN)
} as const

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES

export const DEFAULT_LANGUAGE: LanguageCode = 'fr'

// Matières scolaires
export const SUBJECTS = {
  math: { id: 'math', name: 'Mathématiques', icon: '📐' },
  french: { id: 'french', name: 'Français', icon: '📚' },
  history: { id: 'history', name: 'Histoire-Géo', icon: '🗺️' },
  science: { id: 'science', name: 'Sciences', icon: '🔬' },
  english: { id: 'english', name: 'Anglais', icon: '🇬🇧' },
  other: { id: 'other', name: 'Autre', icon: '📖' },
} as const

export type SubjectId = keyof typeof SUBJECTS

// Niveaux scolaires
export const GRADE_LEVELS = {
  cp: { id: 'cp', name: 'CP', order: 1 },
  ce1: { id: 'ce1', name: 'CE1', order: 2 },
  ce2: { id: 'ce2', name: 'CE2', order: 3 },
  cm1: { id: 'cm1', name: 'CM1', order: 4 },
  cm2: { id: 'cm2', name: 'CM2', order: 5 },
  sixieme: { id: 'sixieme', name: '6ème', order: 6 },
  cinquieme: { id: 'cinquieme', name: '5ème', order: 7 },
  quatrieme: { id: 'quatrieme', name: '4ème', order: 8 },
  troisieme: { id: 'troisieme', name: '3ème', order: 9 },
} as const

export type GradeLevel = keyof typeof GRADE_LEVELS
