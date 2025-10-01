'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Save,
  Calculator,
  Trash2,
  TrendingUp,
  Factory,
  Car,
  Flame,
  Zap,
  Leaf
} from 'lucide-react';

interface EmissionEntry {
  id: string;
  category: string;
  subcategory: string;
  fuelType?: string;
  activity: string;
  value: string;
  unit: string;
  emissionFactor?: number;
  calculatedEmissions?: number;
  description: string;
}

const SCOPE1_CATEGORIES = {
  'combustion-fixe': {
    label: 'Combustion fixe',
    icon: Flame,
    subcategories: {
      'gaz-naturel': { label: 'Gaz naturel', unit: 'kWh', factor: 0.184 },
      'fioul-domestique': { label: 'Fioul domestique', unit: 'litre', factor: 2.64 },
      'fioul-lourd': { label: 'Fioul lourd', unit: 'kg', factor: 3.14 },
      'gpl': { label: 'GPL', unit: 'kg', factor: 3.0 },
      'charbon': { label: 'Charbon', unit: 'tonne', factor: 2.42 },
      'bois': { label: 'Bois', unit: 'kg', factor: 0.025 },
      'biogaz': { label: 'Biogaz', unit: 'm3', factor: 0.054 }
    }
  },
  'combustion-mobile': {
    label: 'Combustion mobile',
    icon: Car,
    subcategories: {
      'essence': { label: 'Essence', unit: 'litre', factor: 2.28 },
      'diesel': { label: 'Diesel/Gasoil', unit: 'litre', factor: 2.64 },
      'gpl-vehicules': { label: 'GPL véhicules', unit: 'litre', factor: 1.76 },
      'gnv': { label: 'GNV', unit: 'kg', factor: 2.74 }
    }
  },
  'procédés-industriels': {
    label: 'Procédés industriels',
    icon: Factory,
    subcategories: {
      'ciment': { label: 'Production ciment', unit: 'tonne', factor: 0.85 },
      'acier': { label: 'Production acier', unit: 'tonne', factor: 1.35 },
      'verre': { label: 'Production verre', unit: 'tonne', factor: 0.72 },
      'chimie': { label: 'Procédés chimiques', unit: 'tonne', factor: 0.95 }
    }
  },
  'emissions-fugitives': {
    label: 'Émissions fugitives',
    icon: Zap,
    subcategories: {
      'refrigerants': { label: 'Fuites réfrigérants', unit: 'kg', factor: 1.0 },
      'methane': { label: 'Émissions CH4', unit: 'kg', factor: 25 },
      'sf6': { label: 'Émissions SF6', unit: 'kg', factor: 22800 }
    }
  }
};

export function Scope1Form() {
  const [entries, setEntries] = useState<EmissionEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCalculator, setShowCalculator] = useState(false);

  const addEntry = () => {
    if (!selectedCategory) return;

    const category = SCOPE1_CATEGORIES[selectedCategory as keyof typeof SCOPE1_CATEGORIES];
    const subcategoryKeys = Object.keys(category.subcategories) as Array<keyof typeof category.subcategories>;

    const newEntry: EmissionEntry = {
      id: Date.now().toString(),
      category: selectedCategory,
      subcategory: subcategoryKeys[0],
      activity: '',
      value: '',
      unit: category.subcategories[subcategoryKeys[0]].unit,
      emissionFactor: category.subcategories[subcategoryKeys[0]].factor,
      calculatedEmissions: 0,
      description: ''
    };

    setEntries([...entries, newEntry]);
  };

  const updateEntry = (id: string, field: keyof EmissionEntry, value: string) => {
    setEntries(entries.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, [field]: value };

        // Recalculer les émissions si nécessaire
        if (field === 'value' || field === 'subcategory') {
          const category = SCOPE1_CATEGORIES[updatedEntry.category as keyof typeof SCOPE1_CATEGORIES];
          const subcategory = category.subcategories[updatedEntry.subcategory as keyof typeof category.subcategories] as { label: string; unit: string; factor: number };
          updatedEntry.emissionFactor = subcategory.factor;
          updatedEntry.unit = subcategory.unit;

          if (field === 'value' && value) {
            const numValue = parseFloat(value);
            updatedEntry.calculatedEmissions = numValue * subcategory.factor;
          }
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
    return entries.reduce((total, entry) => total + (entry.calculatedEmissions || 0), 0);
  };

  const saveData = () => {
    console.log('Sauvegarde des données Scope 1:', entries);
    // Ici on pourrait envoyer les données à l'API
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(SCOPE1_CATEGORIES).map(([key, category]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? "default" : "outline"}
            className="h-20 flex-col gap-2"
            onClick={() => setSelectedCategory(key)}
          >
            <category.icon className="h-6 w-6" />
            <span className="text-xs">{category.label}</span>
          </Button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={addEntry}
          disabled={!selectedCategory}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter une entrée
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowCalculator(!showCalculator)}
          className="gap-2"
        >
          <Calculator className="h-4 w-4" />
          Outil de calcul
        </Button>
      </div>

      {/* Formulaire des entrées */}
      <div className="space-y-4">
        {entries.map((entry) => {
          const category = SCOPE1_CATEGORIES[entry.category as keyof typeof SCOPE1_CATEGORIES];
          const subcategoryOptions = category.subcategories;

          return (
            <Card key={entry.id} className="border-l-4 border-l-emerald-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    {category.label}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Sous-catégorie */}
                  <div className="space-y-2">
                    <Label>Type de combustible/activité</Label>
                    <Select
                      value={entry.subcategory}
                      onValueChange={(value) => updateEntry(entry.id, 'subcategory', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(subcategoryOptions).map(([key, subcat]) => (
                          <SelectItem key={key} value={key}>
                            {subcat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Valeur */}
                  <div className="space-y-2">
                    <Label>Quantité consommée</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={entry.value}
                      onChange={(e) => updateEntry(entry.id, 'value', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  {/* Unité */}
                  <div className="space-y-2">
                    <Label>Unité</Label>
                    <div className="flex items-center gap-2">
                      <Input value={entry.unit} readOnly className="bg-muted" />
                      <Badge variant="secondary">
                        {entry.emissionFactor} kgCO₂/{entry.unit}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Résultat calculé */}
                {entry.calculatedEmissions && entry.calculatedEmissions > 0 && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Émissions calculées :</span>
                      <Badge className="bg-emerald-600">
                        {entry.calculatedEmissions.toFixed(2)} kgCO₂e
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description (optionnel)</Label>
                  <Textarea
                    value={entry.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateEntry(entry.id, 'description', e.target.value)}
                    placeholder="Informations complémentaires..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Résumé et sauvegarde */}
      {entries.length > 0 && (
        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/20 border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Résumé des émissions Scope 1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {calculateTotal().toFixed(2)} kgCO₂e
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total calculé sur {entries.length} entrée{entries.length > 1 ? 's' : ''}
                </div>
              </div>
              <Button onClick={saveData} className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer les données
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Outil de calcul intégré */}
      {showCalculator && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Outil de calcul rapide
            </CardTitle>
            <CardDescription>
              Calculez rapidement vos émissions avec les facteurs standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-500">
              Outil de calcul intégré - Développement en cours
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}