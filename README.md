# AideMoi - Plateforme d'aide aux devoirs multilingue

Une application web qui aide les élèves avec leurs devoirs en utilisant l'IA, avec traduction pour permettre aux parents de suivre dans leur langue maternelle.

## 🎯 Vision

Faciliter l'aide aux devoirs dans les familles multilingues, particulièrement en Guyane française où coexistent de nombreuses langues (français, créole guyanais, portugais, hmong, chinois, arabe, etc.).

## ✨ Fonctionnalités

### Pour les élèves
- Poser des questions sur leurs devoirs
- Recevoir des explications pédagogiques adaptées à leur niveau
- Obtenir des indices plutôt que des réponses directes
- Support du CP à la 3ème

### Pour les parents
- Voir les questions et réponses traduites dans leur langue maternelle
- Suivre l'activité scolaire de leur enfant
- Comprendre les explications pour pouvoir aider efficacement

### Langues supportées
- 🇫🇷 Français (langue d'enseignement)
- 🇬🇫 Créole guyanais
- 🇧🇷 Portugais (brésilien)
- 🇨🇳 Chinois (mandarin)
- 🇸🇦 Arabe
- 🇬🇧 Anglais
- 🇪🇸 Espagnol
- 🇱🇦 Hmong

## 🛠️ Stack technique

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **IA**: Anthropic Claude (API)
- **Traduction**: DeepL API

## 📦 Installation

```bash
# Cloner le repo
git clone <repo-url>
cd AIDEMOI

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés API

# Configurer la base de données Supabase
# 1. Créer un projet sur supabase.com
# 2. Exécuter le script lib/supabase/schema.sql dans l'éditeur SQL

# Lancer en dev
npm run dev
```

## 🔐 Configuration

### Variables d'environnement requises

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key

# DeepL Translation API
DEEPL_API_KEY=your_deepl_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
FREE_TIER_DAILY_LIMIT=5
```

## 📊 Architecture

```
app/
├── (auth)/           # Pages d'authentification
├── student/          # Interface élève
├── parent/           # Interface parent
├── api/              # API routes
│   ├── homework/     # Génération de réponses IA
│   └── translate/    # Traduction
components/
├── ui/               # Composants UI génériques
├── student/          # Composants spécifiques élèves
├── parent/           # Composants spécifiques parents
lib/
├── supabase/         # Configuration et requêtes Supabase
├── anthropic/        # Client Anthropic Claude
└── translation/      # Service de traduction
```

## 🚀 Roadmap MVP (2 semaines)

### Semaine 1
- [x] Configuration du projet
- [x] Schéma de base de données
- [ ] Interface élève (formulaire question)
- [ ] Intégration Claude API
- [ ] Système de traduction
- [ ] Authentification basique

### Semaine 2
- [ ] Interface parent
- [ ] Système de quotas (5 questions/jour gratuit)
- [ ] Tests avec familles pilotes
- [ ] Optimisation des prompts pédagogiques
- [ ] Déploiement

## 💰 Modèle économique

### Phase 1 - Freemium
- **Gratuit**: 5 questions/jour
- **Premium**: 9,90€/mois - questions illimitées

### Phase 2 - B2B Écoles
- Licences établissement
- Tableau de bord enseignants
- Analytics pédagogiques

## 🎓 Principes pédagogiques

L'assistant IA est conçu pour :
- ✅ Guider par questions et indices
- ✅ Adapter au niveau de l'élève
- ✅ Encourager la réflexion autonome
- ❌ Ne PAS donner les réponses directement
- ❌ Ne PAS faire les devoirs à la place de l'élève

## 📝 License

Proprietary - Tous droits réservés

## 👥 Contact

Pour questions et collaborations: [votre email]

---

Fait avec ❤️ pour les familles multilingues de Guyane et d'ailleurs
