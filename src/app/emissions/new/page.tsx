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
  Calculator,
  Leaf,
  Factory,
  Activity,
  Target
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function NewEmissionPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    scope: '',
    category: '',
    activity: '',
    value: '',
    unit: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
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
    console.log('Création d\'une nouvelle émission:', formData);
    // Ici on pourrait envoyer les données à l'API
    // Pour l'instant, on redirige vers la page des émissions
    router.push('/emissions');
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
                onClick={() => router.push('/emissions')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux émissions
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Nouvelle émission
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Ajouter une nouvelle mesure d'émission carbone
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
                    <Calculator className="h-5 w-5" />
                    Informations de l'émission
                  </CardTitle>
                  <CardDescription>
                    Renseignez les détails de votre mesure d'émission
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Scope */}
                  <div className="space-y-2">
                    <Label htmlFor="scope">Scope d'émission *</Label>
                    <Select value={formData.scope} onValueChange={(value) => handleInputChange('scope', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          <div className="flex items-center gap-2">
                            <Factory className="h-4 w-4" />
                            Scope 1 - Émissions directes
                          </div>
                        </SelectItem>
                        <SelectItem value="2">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Scope 2 - Émissions indirectes (énergie)
                          </div>
                        </SelectItem>
                        <SelectItem value="3">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Scope 3 - Autres émissions indirectes
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Catégorie */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fuel">Combustibles</SelectItem>
                        <SelectItem value="electricity">Électricité</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="waste">Déchets</SelectItem>
                        <SelectItem value="materials">Matériaux</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Activité */}
                  <div className="space-y-2">
                    <Label htmlFor="activity">Type d'activité *</Label>
                    <Input
                      id="activity"
                      value={formData.activity}
                      onChange={(e) => handleInputChange('activity', e.target.value)}
                      placeholder="Ex: Consommation de gaz naturel, Déplacement professionnel..."
                    />
                  </div>

                  {/* Valeur et unité */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="value">Valeur *</Label>
                      <Input
                        id="value"
                        type="number"
                        step="0.01"
                        value={formData.value}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unité *</Label>
                      <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Unité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kWh">kWh</SelectItem>
                          <SelectItem value="m3">m³</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="tonne">tonne</SelectItem>
                          <SelectItem value="km">km</SelectItem>
                          <SelectItem value="litre">litre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Informations complémentaires sur cette mesure..."
                      rows={3}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Date de la mesure *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panneau latéral */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/20 border-l-4 border-l-emerald-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                    Aperçu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formData.value || '0'} {formData.unit}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {formData.activity || 'Activité non spécifiée'}
                    </div>
                  </div>

                  {formData.scope && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Scope:</span>
                      <span>Scope {formData.scope}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-emerald-200 dark:border-emerald-800">
                    <Button
                      type="submit"
                      className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                    >
                      <Save className="h-4 w-4" />
                      Enregistrer l'émission
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Informations d'aide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Besoin d'aide ?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <p>• Les champs marqués d'un * sont obligatoires</p>
                  <p>• Assurez-vous de sélectionner le bon scope</p>
                  <p>• Les valeurs seront automatiquement converties en tCO₂e</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}