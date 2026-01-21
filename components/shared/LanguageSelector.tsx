'use client'

import { SUPPORTED_LANGUAGES, LanguageCode } from '@/lib/constants/languages'
import Select from '@/components/ui/Select'

interface LanguageSelectorProps {
  value: LanguageCode
  onChange: (language: LanguageCode) => void
  label?: string
}

export default function LanguageSelector({
  value,
  onChange,
  label = 'Langue',
}: LanguageSelectorProps) {
  return (
    <Select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as LanguageCode)}
    >
      {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
        <option key={code} value={code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </Select>
  )
}
