import Link from 'next/link'
import { BookOpen, Users, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AideMoi 📚
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Aide aux devoirs intelligente et multilingue
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Une plateforme qui aide les élèves avec leurs devoirs et permet aux parents
            de suivre et comprendre dans leur langue maternelle.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-2">Pour les Élèves</h3>
            <p className="text-gray-600 mb-4">
              Pose tes questions sur tes devoirs et reçois des explications claires
              adaptées à ton niveau.
            </p>
            <Link
              href="/student"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Commencer
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-semibold mb-2">Pour les Parents</h3>
            <p className="text-gray-600 mb-4">
              Suivez les devoirs de votre enfant traduits dans votre langue maternelle.
            </p>
            <Link
              href="/parent"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Espace Parent
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Multilingue</h3>
            <p className="text-gray-600 mb-4">
              Support de 8+ langues : français, créole, portugais, hmong, chinois, arabe, anglais, espagnol.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8">Comment ça marche ?</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">L'élève pose sa question</h4>
                <p className="text-gray-600">
                  Il indique sa matière, son niveau et décrit son problème
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">L'IA analyse et répond</h4>
                <p className="text-gray-600">
                  Notre assistant pédagogique génère des explications adaptées sans donner la réponse directement
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Les parents suivent dans leur langue</h4>
                <p className="text-gray-600">
                  Traduction automatique pour permettre aux parents d'accompagner leur enfant
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Essai gratuit : 5 questions par jour</p>
          <Link
            href="/student"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Essayer maintenant
          </Link>
        </div>
      </div>
    </main>
  )
}
