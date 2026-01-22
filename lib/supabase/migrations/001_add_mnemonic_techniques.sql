-- Migration pour ajouter les techniques mnémotechniques
-- Exécuter ce script si vous avez déjà créé la base de données avec le schéma initial

-- Ajouter la colonne mnemonic_techniques à la table homework_responses
ALTER TABLE homework_responses
ADD COLUMN IF NOT EXISTS mnemonic_techniques TEXT[] DEFAULT '{}';

-- Ajouter la colonne translated_mnemonic_techniques à la table translations
ALTER TABLE translations
ADD COLUMN IF NOT EXISTS translated_mnemonic_techniques TEXT[] DEFAULT '{}';

-- Commentaire pour documentation
COMMENT ON COLUMN homework_responses.mnemonic_techniques IS 'Techniques mnémotechniques générées par l''IA pour aider à la mémorisation';
COMMENT ON COLUMN translations.translated_mnemonic_techniques IS 'Techniques mnémotechniques traduites dans la langue cible';
