'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Search,
  HelpCircle,
  FileText,
  Calculator,
  TrendingUp,
  Users,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const faqData: FAQItem[] = [
    {
      question: "Comment calculer mes émissions Scope 1 ?",
      answer: "Les émissions Scope 1 correspondent aux émissions directes de votre organisation. Cela inclut la combustion de combustibles, les procédés industriels et les émissions fugitives. Utilisez l'onglet 'Scope 1' dans la section émissions pour saisir vos données.",
      category: "emissions"
    },
    {
      question: "Comment utiliser la calculatrice d'émissions ?",
      answer: "La calculatrice vous permet d'estimer vos émissions à partir de données d'activité. Sélectionnez le type d'activité, saisissez la quantité et l'unité, puis le système calculera automatiquement les émissions équivalentes en CO₂.",
      category: "calculator"
    },
    {
      question: "Comment générer un rapport d'émissions ?",
      answer: "Rendez-vous dans la section 'Rapports', cliquez sur 'Nouveau rapport', sélectionnez la période et les scopes souhaités, puis générez votre rapport au format PDF, Excel ou CSV.",
      category: "reports"
    },
    {
      question: "Comment comparer mes performances avec mon secteur ?",
      answer: "Utilisez la page 'Benchmark sectoriel' pour comparer vos émissions avec les moyennes de votre secteur d'activité. Sélectionnez votre secteur pour obtenir des comparaisons détaillées.",
      category: "benchmark"
    },
    {
      question: "Comment modifier mes informations personnelles ?",
      answer: "Accédez à la section 'Mon profil' depuis le dashboard pour modifier vos informations personnelles, coordonnées et paramètres de compte.",
      category: "account"
    }
  ];

  const categories = [
    { id: 'all', label: 'Toutes les catégories', icon: HelpCircle },
    { id: 'emissions', label: 'Émissions', icon: TrendingUp },
    { id: 'calculator', label: 'Calculatrice', icon: Calculator },
    { id: 'reports', label: 'Rapports', icon: FileText },
    { id: 'benchmark', label: 'Benchmark', icon: Users },
    { id: 'account', label: 'Compte', icon: Users }
  ];

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Centre d'aide
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Trouvez des réponses à vos questions
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Recherche */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher dans l'aide..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Catégories */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Catégories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <category.icon className="h-4 w-4" />
                      {category.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Questions fréquentes
                  </CardTitle>
                  <CardDescription>
                    {filteredFAQ.length} résultat{filteredFAQ.length > 1 ? 's' : ''} trouvé{filteredFAQ.length > 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {filteredFAQ.map((item, index) => (
                    <div key={index} className="border-b border-slate-200 dark:border-slate-700 last:border-0 pb-6 last:pb-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                        {item.question}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {item.answer}
                      </p>
                      <div className="mt-3">
                        <Badge variant="outline" className="text-xs">
                          {categories.find(cat => cat.id === item.category)?.label}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {filteredFAQ.length === 0 && (
                    <div className="text-center py-8">
                      <HelpCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        Aucune question trouvée
                      </h3>
                      <p className="text-slate-500 dark:text-slate-500">
                        Essayez de modifier votre recherche ou sélectionnez une autre catégorie
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Support */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Besoin d'aide supplémentaire ?
              </CardTitle>
              <CardDescription>
                Notre équipe support est là pour vous accompagner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Email</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    support@carbonos.fr
                  </p>
                  <Button size="sm" variant="outline">
                    Envoyer un email
                  </Button>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <Phone className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Téléphone</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    +33 1 23 45 67 89
                  </p>
                  <Button size="sm" variant="outline">
                    Appeler maintenant
                  </Button>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Chat en ligne</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Réponse sous 2 minutes
                  </p>
                  <Button size="sm" variant="outline">
                    Démarrer le chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}