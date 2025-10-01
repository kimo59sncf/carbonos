'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Save,
  Download,
  FileText,
  Calendar,
  Target
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function NewReportPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    period: '',
    scope: 'all',
    format: 'pdf',
    description: '',
    deadline: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Création d\'un nouveau rapport:', formData);
    // Ici on pourrait envoyer les données à l'API
    // Pour l'instant, on redirige vers la page des rapports
    router.push('/reports');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
                onClick={() => router.push('/reports')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux rapports
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Nouveau rapport
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Générer un nouveau rapport d'émissions carbone
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Configuration du rapport
                  </CardTitle>
                  <CardDescription>
                    Définissez les paramètres de votre rapport d'émissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Titre */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du rapport *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Rapport d'émissions Q4 2024 - Entreprise XYZ"
                    />
                  </div>

                  {/* Type de rapport */}
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de rapport *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type de rapport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regulatory">Rapport réglementaire</SelectItem>
                        <SelectItem value="internal">Rapport interne</SelectItem>
                        <SelectItem value="stakeholder">Rapport pour parties prenantes</SelectItem>
                        <SelectItem value="summary">Rapport de synthèse</SelectItem>
                        <SelectItem value="detailed">Rapport détaillé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Période */}
                  <div className="space-y-2">
                    <Label htmlFor="period">Période couverte *</Label>
                    <Select value={formData.period} onValueChange={(value) => handleInputChange('period', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez la période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="q1-2024">Q1 2024</SelectItem>
                        <SelectItem value="q2-2024">Q2 2024</SelectItem>
                        <SelectItem value="q3-2024">Q3 2024</SelectItem>
                        <SelectItem value="q4-2024">Q4 2024</SelectItem>
                        <SelectItem value="2024">Année 2024 complète</SelectItem>
                        <SelectItem value="custom">Période personnalisée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Scope */}
                  <div className="space-y-2">
                    <Label htmlFor="scope">Scope à inclure</Label>
                    <Select value={formData.scope} onValueChange={(value) => handleInputChange('scope', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez les scopes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les scopes (1, 2, 3)</SelectItem>
                        <SelectItem value="1-2">Scopes 1 et 2 uniquement</SelectItem>
                        <SelectItem value="1">Scope 1 uniquement</SelectItem>
                        <SelectItem value="2">Scope 2 uniquement</SelectItem>
                        <SelectItem value="3">Scope 3 uniquement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Format */}
                  <div className="space-y-2">
                    <Label htmlFor="format">Format de sortie</Label>
                    <Select value={formData.format} onValueChange={(value) => handleInputChange('format', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="word">Word</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description/Objectif</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Décrivez l'objectif de ce rapport et son contexte..."
                      rows={3}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  {/* Date limite */}
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Date limite souhaitée</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panneau latéral */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-blue-600" />
                    Aperçu du rapport
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {formData.title || 'Titre du rapport'}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      {formData.type && `Type: ${formData.type}`}
                      {formData.period && <div>Période: {formData.period}</div>}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-medium">{formData.format?.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scopes:</span>
                      <span className="font-medium">
                        {formData.scope === 'all' ? 'Tous' : formData.scope}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
                    <Button
                      type="submit"
                      className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      <Save className="h-4 w-4" />
                      Générer le rapport
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Informations d'aide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Formats disponibles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>PDF: Rapport formaté avec graphiques</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Excel: Données brutes et tableaux</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>CSV: Format pour analyses externes</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}