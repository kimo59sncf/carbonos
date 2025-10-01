'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calculator,
  Plus,
  Trash2,
  Save,
  TrendingUp,
  Factory,
  Car,
  Flame,
  Zap,
  Leaf,
  Download
} from 'lucide-react';

interface CalculationEntry {
  id: string;
  scope: string;
  category: string;
  subcategory: string;
  activity: string;
  value: string;
  unit: string;
  emissionFactor: number;
  calculatedEmissions: number;
  source: string;
}

const EMISSION_FACTORS = {
  'scope1': {
    'combustion-fixe': {
      'gaz-naturel': { factor: 0.184, unit: 'kWh', source: 'Base Carbone ADEME' },
      'fioul-domestique': { factor: 2.64, unit: 'litre', source: 'Base Carbone ADEME' },
      'fioul-lourd': { factor: 3.14, unit: 'kg', source: 'Base Carbone ADEME' },
      'gpl': { factor: 3.0, unit: 'kg', source: 'Base Carbone ADEME' },
      'charbon': { factor: 2.42, unit: 'tonne', source: 'Base Carbone ADEME' },
      'bois': { factor: 0.025, unit: 'kg', source: 'Base Carbone ADEME' },
      'biogaz': { factor: 0.054, unit: 'm3', source: 'Base Carbone ADEME' }
    },
    'combustion-mobile': {
      'essence': { factor: 2.28, unit: 'litre', source: 'Base Carbone ADEME' },
      'diesel': { factor: 2.64, unit: 'litre', source: 'Base Carbone ADEME' },
      'gpl-vehicules': { factor: 1.76, unit: 'litre', source: 'Base Carbone ADEME' },
      'gnv': { factor: 2.74, unit: 'kg', source: 'Base Carbone ADEME' }
    },
    'procédés-industriels': {
      'ciment': { factor: 0.85, unit: 'tonne', source: 'IPCC' },
      'acier': { factor: 1.35, unit: 'tonne', source: 'IPCC' },
      'verre': { factor: 0.72, unit: 'tonne', source: 'IPCC' },
      'chimie': { factor: 0.95, unit: 'tonne', source: 'IPCC' }
    },
    'emissions-fugitives': {
      'refrigerants': { factor: 1.0, unit: 'kg', source: 'IPCC' },
      'methane': { factor: 25, unit: 'kg', source: 'IPCC' },
      'sf6': { factor: 22800, unit: 'kg', source: 'IPCC' }
    }
  },
  'scope2': {
    'electricite': {
      'france': { factor: 0.057, unit: 'kWh', source: 'RTE 2022' },
      'europe': { factor: 0.276, unit: 'kWh', source: 'AIB 2022' },
      'monde': { factor: 0.436, unit: 'kWh', source: 'IEA 2022' }
    },
    'chaleur': {
      'reseau-urbain': { factor: 0.185, unit: 'kWh', source: 'Base Carbone ADEME' },
      'gaz-naturel': { factor: 0.184, unit: 'kWh', source: 'Base Carbone ADEME' }
    }
  },
  'scope3': {
    'transport': {
      'avion-court': { factor: 0.246, unit: 'passager.km', source: 'Base Carbone ADEME' },
      'avion-long': { factor: 0.147, unit: 'passager.km', source: 'Base Carbone ADEME' },
      'train': { factor: 0.032, unit: 'passager.km', source: 'Base Carbone ADEME' },
      'voiture': { factor: 0.192, unit: 'passager.km', source: 'Base Carbone ADEME' }
    },
    'dechets': {
      'mise-en-decharge': { factor: 0.8, unit: 'tonne', source: 'IPCC' },
      'incineration': { factor: 0.1, unit: 'tonne', source: 'IPCC' },
      'recyclage': { factor: 0.05, unit: 'tonne', source: 'IPCC' }
    }
  }
};

export function EmissionCalculator() {
  const [entries, setEntries] = useState<CalculationEntry[]>([]);
  const [selectedScope, setSelectedScope] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  const addEntry = () => {
    if (!selectedScope || !selectedCategory || !selectedSubcategory) return;

    const factors = EMISSION_FACTORS[selectedScope as keyof typeof EMISSION_FACTORS];
    const category = factors[selectedCategory as keyof typeof factors];
    const factorData = category[selectedSubcategory as keyof typeof category] as { factor: number; unit: string; source: string };

    const newEntry: CalculationEntry = {
      id: Date.now().toString(),
      scope: selectedScope,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      activity: '',
      value: '',
      unit: factorData.unit,
      emissionFactor: factorData.factor,
      calculatedEmissions: 0,
      source: factorData.source
    };

    setEntries([...entries, newEntry]);
  };

  const updateEntry = (id: string, field: keyof CalculationEntry, value: string) => {
    setEntries(entries.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, [field]: value };

        if (field === 'value' && value) {
          const numValue = parseFloat(value);
          updatedEntry.calculatedEmissions = numValue * entry.emissionFactor;
        }

        return updatedEntry;
      }
      return entry;
    }));
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const calculateTotal = () => {
    return {
      scope1: entries.filter(e => e.scope === 'scope1').reduce((total, entry) => total + entry.calculatedEmissions, 0),
      scope2: entries.filter(e => e.scope === 'scope2').reduce((total, entry) => total + entry.calculatedEmissions, 0),
      scope3: entries.filter(e => e.scope === 'scope3').reduce((total, entry) => total + entry.calculatedEmissions, 0),
      total: entries.reduce((total, entry) => total + entry.calculatedEmissions, 0)
    };
  };

  const saveCalculations = () => {
    console.log('Sauvegarde des calculs:', entries);
    // Ici on pourrait envoyer les données à l'API
  };

  const exportResults = () => {
    const data = {
      date: new Date().toISOString(),
      entries: entries,
      totals: calculateTotal()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calcul-emissions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totals = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Sélecteurs pour nouvelle entrée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nouvelle entrée de calcul
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Scope</Label>
              <Select value={selectedScope} onValueChange={setSelectedScope}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scope1">Scope 1 - Directes</SelectItem>
                  <SelectItem value="scope2">Scope 2 - Énergie</SelectItem>
                  <SelectItem value="scope3">Scope 3 - Indirectes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {selectedScope && Object.keys(EMISSION_FACTORS[selectedScope as keyof typeof EMISSION_FACTORS]).map(category => (
                    <SelectItem key={category} value={category}>
                      {category.replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sous-catégorie</Label>
              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner sous-catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {selectedScope && selectedCategory && Object.keys(EMISSION_FACTORS[selectedScope as keyof typeof EMISSION_FACTORS][selectedCategory as keyof typeof EMISSION_FACTORS[keyof typeof EMISSION_FACTORS]]).map(subcategory => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory.replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={addEntry} disabled={!selectedScope || !selectedCategory || !selectedSubcategory} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des calculs */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Scope {entry.scope.slice(-1)} - {entry.category.replace('-', ' ')}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEntry(entry.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Activité</Label>
                  <Input
                    value={entry.activity}
                    onChange={(e) => updateEntry(entry.id, 'activity', e.target.value)}
                    placeholder="Description de l'activité"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={entry.value}
                    onChange={(e) => updateEntry(entry.id, 'value', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unité</Label>
                  <div className="flex items-center gap-2">
                    <Input value={entry.unit} readOnly className="bg-muted" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Facteur d'émission</div>
                    <div className="font-medium">{entry.emissionFactor} kgCO₂e/{entry.unit}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Source</div>
                    <div className="font-medium">{entry.source}</div>
                  </div>
                </div>

                {entry.calculatedEmissions > 0 && (
                  <Badge className="bg-emerald-600 text-lg px-3 py-1">
                    {entry.calculatedEmissions.toFixed(2)} kgCO₂e
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Résumé et actions */}
      {entries.length > 0 && (
        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/20 border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Résumé des calculs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{totals.scope1.toFixed(2)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">kgCO₂e Scope 1</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totals.scope2.toFixed(2)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">kgCO₂e Scope 2</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{totals.scope3.toFixed(2)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">kgCO₂e Scope 3</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">{totals.total.toFixed(2)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">kgCO₂e Total</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex gap-2">
              <Button onClick={saveCalculations} className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer les calculs
              </Button>
              <Button variant="outline" onClick={exportResults} className="gap-2">
                <Download className="h-4 w-4" />
                Exporter les résultats
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {entries.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calculator className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Aucun calcul en cours
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              Ajoutez votre première entrée de calcul pour commencer
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}