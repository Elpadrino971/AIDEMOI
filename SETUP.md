# Guide de Configuration - AideMoi

Ce guide vous aidera à configurer l'application AideMoi de A à Z.

## 🚀 Démarrage rapide

### 1. Prérequis

- Node.js 18+ installé
- Un compte Supabase (gratuit)
- Une clé API Anthropic Claude
- Une clé API DeepL

### 2. Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

### 3. Configuration de Supabase

#### A. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez l'URL et les clés API

#### B. Configurer la base de données

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Copiez le contenu de `lib/supabase/schema.sql`
3. Exécutez le script SQL
4. Vérifiez que toutes les tables sont créées

#### C. Configurer l'authentification

1. Dans **Authentication > Providers**
2. Activez "Email" provider
3. Configurez les URL de redirection si nécessaire

### 4. Configuration des variables d'environnement

Éditez le fichier `.env` avec vos clés :

```env
# Supabase (récupérez depuis Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Anthropic Claude API (récupérez depuis console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-...

# DeepL Translation API (récupérez depuis deepl.com/pro)
DEEPL_API_KEY=...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
FREE_TIER_DAILY_LIMIT=5
```

### 5. Obtenir les clés API

#### Anthropic Claude API

1. Allez sur [console.anthropic.com](https://console.anthropic.com)
2. Créez un compte (5$ de crédits gratuits)
3. Générez une clé API dans **Settings > API Keys**

#### DeepL API

1. Allez sur [deepl.com/pro](https://www.deepl.com/pro-api)
2. Inscrivez-vous au plan gratuit (500,000 caractères/mois)
3. Récupérez votre clé API dans **Account > API Keys**

### 6. Lancer l'application

```bash
# Mode développement
npm run dev

# L'app sera disponible sur http://localhost:3000
```

### 7. Tester l'application

1. Créez un compte sur `/register`
2. Choisissez "Élève" et sélectionnez un niveau
3. Allez sur `/student`
4. Posez une question test
5. Vérifiez que la réponse de l'IA s'affiche

## 📋 Configuration avancée

### Ajouter des langues supplémentaires

Éditez `lib/constants/languages.ts` pour ajouter de nouvelles langues :

```typescript
export const SUPPORTED_LANGUAGES = {
  // ... langues existantes
  newlang: {
    code: 'newlang',
    name: 'Nom de la langue',
    flag: '🏴',
    deepLCode: 'XX' // Code DeepL
  },
}
```

### Configurer les limites de quota

Dans `.env`, modifiez :

```env
FREE_TIER_DAILY_LIMIT=5  # Nombre de questions gratuites par jour
```

### Personnaliser les prompts pédagogiques

Éditez `lib/anthropic/prompts.ts` pour ajuster le comportement de l'IA selon vos besoins pédagogiques.

## 🔒 Sécurité

### Policies RLS (Row Level Security)

Les policies sont définies dans `schema.sql`. Vérifiez qu'elles sont bien activées :

```sql
-- Vérifier les policies
SELECT * FROM pg_policies WHERE tablename IN (
  'profiles', 'student_profiles', 'homework_questions'
);
```

### Variables d'environnement sensibles

⚠️ **IMPORTANT** : Ne commitez JAMAIS le fichier `.env` dans Git !

## 🐛 Résolution des problèmes

### Erreur de connexion Supabase

- Vérifiez que les URL et clés sont correctes
- Assurez-vous que le projet Supabase est actif
- Vérifiez les policies RLS

### Erreur d'API Claude

- Vérifiez votre clé API
- Assurez-vous d'avoir des crédits disponibles
- Vérifiez les limites de rate limiting

### Erreur de traduction DeepL

- Vérifiez votre quota mensuel
- Assurez-vous que la langue cible est supportée par DeepL

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Anthropic](https://docs.anthropic.com)
- [Documentation DeepL](https://www.deepl.com/docs-api)

## 🤝 Support

Pour toute question, consultez le README.md ou ouvrez une issue.
