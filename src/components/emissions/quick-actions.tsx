'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Flame,
  Car,
  Zap,
  Plane,
  Building,
  Plus,
  CheckCircle,
  Calculator
} from 'lucide-react';

interface QuickActionEntry {
  id: string;
  type: string;
  label: string;
  icon: any;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    unit?: string;
    placeholder?: string;
  }>;
  factor: number;
  unit: string;
}

const QUICK_ACTIONS: QuickActionEntry[] = [
  {
    id: 'gaz-naturel',
    type: 'scope1',
    label: 'Gaz naturel',
    icon: Flame,
    fields: [
      { name: 'consumption', label: 'Consommation', type: 'number', unit: 'kWh', placeholder: '1000' }
    ],
    factor: 0.184,
    unit: 'kgCO₂e/kWh'
  },
  {
    id: 'essence',
    type: 'scope1',
    label: 'Essence véhicule',
    icon: Car,
    fields: [
      { name: 'liters', label: 'Litres', type: 'number', unit: 'L', placeholder: '50' }
    ],
    factor: 2.28,
    unit: 'kgCO₂e/L'
  },
  {
    id: 'electricite',
    type: 'scope2',
    label: 'Électricité',
    icon: Zap,
    fields: [
      { name: 'consumption', label: 'Consommation', type: 'number', unit: 'kWh', placeholder: '5000' }
    ],
    factor: 0.057,
    unit: 'kgCO₂e/kWh'
  },
  {
    id: 'vol-avion',
    type: 'scope3',
    label: 'Vol avion',
    icon: Plane,
    fields: [
      { name: 'distance', label: 'Distance', type: 'number', unit: 'km', placeholder: '1000' },
      { name: 'passengers', label: 'Passagers', type: 'number', unit: 'pers', placeholder: '1' }
    ],
    factor: 0.246,
    unit: 'kgCO₂e/passager.km'
  },
  {
    id: 'chauffage-urbain',
    type: 'scope2',
    label: 'Chauffage urbain',
    icon: Building,
    fields: [
      { name: 'consumption', label: 'Consommation', type: 'number', unit: 'kWh', placeholder: '2000' }
    ],
    factor: 0.185,
    unit: 'kgCO₂e/kWh'
  }
];

export function QuickActions() {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Array<{
    id: string;
    action: QuickActionEntry;
    values: Record<string, string>;
    totalEmissions: number;
  }>>([]);

  const handleQuickCalculation = () => {
    if (!selectedAction) return;

    const action = QUICK_ACTIONS.find(a => a.id === selectedAction);
    if (!action) return;

    let totalEmissions = 0;
    const values: Record<string, string> = {};

    // Calculer les émissions
    if (action.fields.length === 1) {
      const value = parseFloat(formData[action.fields[0].name] || '0');
      totalEmissions = value * action.factor;
      values[action.fields[0].name] = formData[action.fields[0].name] || '';
    } else {
      // Pour les calculs multi-étapes (comme les passagers)
      let calculatedValue = 0;
      action.fields.forEach(field => {
        const value = parseFloat(formData[field.name] || '0');
        values[field.name] = formData[field.name] || '';

        if (field.name === 'distance') calculatedValue = value;
        if (field.name === 'passengers' && value > 0) {
          calculatedValue = calculatedValue / value;
        }
      });
      totalEmissions = calculatedValue * action.factor;
    }

    const result = {
      id: Date.now().toString(),
      action,
      values,
      totalEmissions
    };

    setResults([result, ...results]);
    setFormData({});
    setSelectedAction('');
  };

  const removeResult = (id: string) => {
    setResults(results.filter(r => r.id !== id));
  };

  const getTotalEmissions = () => {
    return results.reduce((total, result) => total + result.totalEmissions, 0);
  };

  return (
    <div className="space-y-4">
      {/* Sélecteur d'action rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Button
            key={action.id}
            variant={selectedAction === action.id ? "default" : "outline"}
            size="sm"
            className="h-auto p-3 flex-col gap-2"
            onClick={() => {
              setSelectedAction(action.id);
              setFormData({});
            }}
          >
            <action.icon className="h-4 w-4" />
            <span className="text-xs text-center">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Formulaire de saisie rapide */}
      {selectedAction && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calcul rapide - {QUICK_ACTIONS.find(a => a.id === selectedAction)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const action = QUICK_ACTIONS.find(a => a.id === selectedAction);
              if (!action) return null;

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {action.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label>{field.label} ({field.unit})</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
              );
            })()}

            <div className="flex items-center gap-2">
              <Button onClick={handleQuickCalculation} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Calculer
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedAction('');
                  setFormData({});
                }}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats des calculs rapides */}
      {results.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Résultats des actions rapides
            </CardTitle>
            <CardDescription>
              Total: {getTotalEmissions().toFixed(2)} kgCO₂e sur {results.length} calcul{results.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <result.action.icon className="h-4 w-4 text-slate-600" />
                  <div>
                    <div className="font-medium">{result.action.label}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {Object.entries(result.values).map(([key, value]) => {
                        const field = result.action.fields.find(f => f.name === key);
                        return `${field?.label}: ${value} ${field?.unit}`;
                      }).join(' • ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">
                    {result.totalEmissions.toFixed(2)} kgCO₂e
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeResult(result.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {results.length === 0 && !selectedAction && (
        <div className="text-center py-8 text-slate-500">
          <Zap className="h-12 w-12 mx-auto mb-3 text-slate-400" />
          <p>Sélectionnez une action rapide pour commencer</p>
        </div>
      )}
    </div>
  );
}