'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calculator,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BaselineScenarioProps {
  companyId?: string;
  onScenarioCalculated?: (scenario: BaselineScenarioData) => void;
  className?: string;
}

interface BaselineScenarioData {
  id: string;
  companyId: string;
  assessmentDate: string;
  practices: {
    paperUsage: {
      monthlySheets: number;
      justification: string;
    };
    travelPatterns: {
      monthlyMeetings: number;
      avgParticipants: number;
      avgDistance: number;
      justification: string;
    };
    reportingMethods: {
      method: 'excel' | 'paper' | 'email' | 'none';
      frequency: string;
      timeSpent: number; // heures/semaine
      justification: string;
    };
    dataManagement: {
      tools: string[];
      storageMethod: string;
      accessFrequency: string;
      justification: string;
    };
  };
  emissions: {
    paperEmissions: number;
    travelEmissions: number;
    processEmissions: number;
    totalBaseline: number;
  };
  additionality: {
    score: number;
    justification: string;
    barriers: string[];
  };
  status: 'draft' | 'submitted' | 'validated';
  createdAt: string;
  updatedAt: string;
}

export function BaselineScenario({ companyId, onScenarioCalculated, className }: BaselineScenarioProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [scenario, setScenario] = useState<Partial<BaselineScenarioData>>({
    companyId: companyId || '',
    assessmentDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    practices: {
      paperUsage: { monthlySheets: 0, justification: '' },
      travelPatterns: { monthlyMeetings: 0, avgParticipants: 0, avgDistance: 0, justification: '' },
      reportingMethods: { method: 'excel', frequency: '', timeSpent: 0, justification: '' },
      dataManagement: { tools: [], storageMethod: '', accessFrequency: '', justification: '' }
    }
  });

  const steps = [
    { id: 'paper', title: 'Usage Papier', icon: FileText },
    { id: 'travel', title: 'Déplacements', icon: TrendingUp },
    { id: 'reporting', title: 'Reporting', icon: Calculator },
    { id: 'data', title: 'Gestion Données', icon: FileText },
    { id: 'review', title: 'Validation', icon: CheckCircle }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateEmissions = (data: Partial<BaselineScenarioData>): BaselineScenarioData['emissions'] => {
    const paperEmissions = (data.practices?.paperUsage?.monthlySheets || 0) * 12 * 0.08 * 1.2; // kgCO2e/an
    const travelEmissions = (data.practices?.travelPatterns?.monthlyMeetings || 0) * 12 *
                           (data.practices?.travelPatterns?.avgParticipants || 0) *
                           (data.practices?.travelPatterns?.avgDistance || 0) * 2 * 0.15; // A/R
    const processEmissions = (data.practices?.reportingMethods?.timeSpent || 0) * 52 * 0.3; // €/h * kgCO2e/€

    return {
      paperEmissions,
      travelEmissions,
      processEmissions,
      totalBaseline: paperEmissions + travelEmissions + processEmissions
    };
  };

  const calculateAdditionality = (data: Partial<BaselineScenarioData>): BaselineScenarioData['additionality'] => {
    let score = 0;
    const barriers: string[] = [];

    // Analyse des pratiques
    if (data.practices?.reportingMethods?.method === 'paper' || data.practices?.reportingMethods?.method === 'excel') {
      score += 0.3;
      barriers.push('Méthodes traditionnelles de reporting');
    }

    if (data.practices?.travelPatterns && data.practices.travelPatterns.monthlyMeetings > 4) {
      score += 0.25;
      barriers.push('Réunions fréquentes en présentiel');
    }

    if (data.practices?.paperUsage && data.practices.paperUsage.monthlySheets > 100) {
      score += 0.25;
      barriers.push('Consommation papier élevée');
    }

    if (data.practices?.dataManagement?.tools?.includes('local') || data.practices?.dataManagement?.tools?.includes('email')) {
      score += 0.2;
      barriers.push('Gestion décentralisée des données');
    }

    return {
      score: Math.min(score, 1),
      justification: `Score calculé sur la base de ${barriers.length} barrières identifiées nécessitant une solution numérique.`,
      barriers
    };
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Usage Papier
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Usage Papier Mensuel</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Estimation de la consommation de papier avant utilisation de CarbonOS
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Feuilles imprimées par mois
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border rounded-lg"
                    placeholder="Ex: 500"
                    value={scenario.practices?.paperUsage?.monthlySheets || ''}
                    onChange={(e) => setScenario({
                      ...scenario,
                      practices: {
                        ...scenario.practices,
                        paperUsage: {
                          monthlySheets: parseInt(e.target.value) || 0,
                          justification: scenario.practices?.paperUsage?.justification || ''
                        }
                      }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Justification
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                    placeholder="Expliquez l'usage papier (rapports, présentations, etc.)"
                    value={scenario.practices?.paperUsage?.justification || ''}
                    onChange={(e) => setScenario({
                      ...scenario,
                      practices: {
                        ...scenario.practices,
                        paperUsage: {
                          monthlySheets: scenario.practices?.paperUsage?.monthlySheets || 0,
                          justification: e.target.value
                        }
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Déplacements
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Réunions et Déplacements</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Estimation des déplacements liés à la gestion carbone avant CarbonOS
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Réunions mensuelles
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border rounded-lg"
                    placeholder="Ex: 8"
                    value={scenario.practices?.travelPatterns?.monthlyMeetings || ''}
                    onChange={(e) => setScenario({
                      ...scenario,
                      practices: {
                        ...scenario.practices,
                        travelPatterns: {
                          monthlyMeetings: parseInt(e.target.value) || 0,
                          avgParticipants: scenario.practices?.travelPatterns?.avgParticipants || 0,
                          avgDistance: scenario.practices?.travelPatterns?.avgDistance || 0,
                          justification: scenario.practices?.travelPatterns?.justification || ''
                        }
                      }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Participants moyens
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border rounded-lg"
                    placeholder="Ex: 5"
                    value={scenario.practices?.travelPatterns?.avgParticipants || ''}
                    onChange={(e) => setScenario({
                      ...scenario,
                      practices: {
                        ...scenario.practices,
                        travelPatterns: {
                          monthlyMeetings: scenario.practices?.travelPatterns?.monthlyMeetings || 0,
                          avgParticipants: parseInt(e.target.value) || 0,
                          avgDistance: scenario.practices?.travelPatterns?.avgDistance || 0,
                          justification: scenario.practices?.travelPatterns?.justification || ''
                        }
                      }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Distance moyenne (km A/R)
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border rounded-lg"
                    placeholder="Ex: 50"
                    value={scenario.practices?.travelPatterns?.avgDistance || ''}
                    onChange={(e) => setScenario({
                      ...scenario,
                      practices: {
                        ...scenario.practices,
                        travelPatterns: {
                          monthlyMeetings: scenario.practices?.travelPatterns?.monthlyMeetings || 0,
                          avgParticipants: scenario.practices?.travelPatterns?.avgParticipants || 0,
                          avgDistance: parseInt(e.target.value) || 0,
                          justification: scenario.practices?.travelPatterns?.justification || ''
                        }
                      }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Justification
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                    placeholder="Décrivez les motifs de déplacement"
                    value={scenario.practices?.travelPatterns?.justification || ''}
                    onChange={(e) => setScenario({
                      ...scenario,
                      practices: {
                        ...scenario.practices,
                        travelPatterns: {
                          monthlyMeetings: scenario.practices?.travelPatterns?.monthlyMeetings || 0,
                          avgParticipants: scenario.practices?.travelPatterns?.avgParticipants || 0,
                          avgDistance: scenario.practices?.travelPatterns?.avgDistance || 0,
                          justification: e.target.value
                        }
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Reporting
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Méthodes de Reporting</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comment étiez-vous organisé pour le suivi carbone avant CarbonOS ?
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Méthode principale
                  </label>
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={scenario.practices?.reportingMethods?.method || ''}
                    onChange={(e) => setScenario({
                      ...scenario,
                      practices: {
                        ...scenario.practices,
                        reportingMethods: {
                          method: e.target.value as any,
                          frequency: scenario.practices?.reportingMethods?.frequency || '',
                          timeSpent: scenario.practices?.reportingMethods?.timeSpent || 0,
                          justification: scenario.practices?.reportingMethods?.justification || ''
                        }
                      }
                    })}
                  >
                    <option value="">Sélectionner</option>
                    <option value="excel">Excel/Spreadsheet</option>
                    <option value="paper">Papier/Documents</option>
                    <option value="email">Email/Partage</option>
                    <option value="none">Aucun suivi</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fréquence de reporting
                    </label>
                    <select
                      className="w-full p-3 border rounded-lg"
                      value={scenario.practices?.reportingMethods?.frequency || ''}
                      onChange={(e) => setScenario({
                        ...scenario,
                        practices: {
                          ...scenario.practices,
                          reportingMethods: {
                            method: scenario.practices?.reportingMethods?.method || 'excel',
                            frequency: e.target.value,
                            timeSpent: scenario.practices?.reportingMethods?.timeSpent || 0,
                            justification: scenario.practices?.reportingMethods?.justification || ''
                          }
                        }
                      })}
                    >
                      <option value="">Sélectionner</option>
                      <option value="daily">Quotidienne</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuelle</option>
                      <option value="quarterly">Trimestrielle</option>
                      <option value="annual">Annuelle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Temps passé (heures/semaine)
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border rounded-lg"
                      placeholder="Ex: 10"
                      value={scenario.practices?.reportingMethods?.timeSpent || ''}
                      onChange={(e) => setScenario({
                        ...scenario,
                        practices: {
                          ...scenario.practices,
                          reportingMethods: {
                            method: scenario.practices?.reportingMethods?.method || 'excel',
                            frequency: scenario.practices?.reportingMethods?.frequency || '',
                            timeSpent: parseInt(e.target.value) || 0,
                            justification: scenario.practices?.reportingMethods?.justification || ''
                          }
                        }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Justification détaillée
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg"
                    rows={4}
                    placeholder="Décrivez votre processus de reporting précédent"
                    value={scenario.practices?.reportingMethods?.justification || ''}
                    onChange={(e) => setScenario({
                      ...scenario,
                      practices: {
                        ...scenario.practices,
                        reportingMethods: {
                          method: scenario.practices?.reportingMethods?.method || 'excel',
                          frequency: scenario.practices?.reportingMethods?.frequency || '',
                          timeSpent: scenario.practices?.reportingMethods?.timeSpent || 0,
                          justification: e.target.value
                        }
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Gestion des données
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Gestion des Données</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comment gérez-vous vos données carbone actuellement ?
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Outils utilisés
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['excel', 'paper', 'email', 'local', 'cloud', 'other'].map(tool => (
                      <label key={tool} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={scenario.practices?.dataManagement?.tools?.includes(tool) || false}
                          onChange={(e) => {
                            const currentTools = scenario.practices?.dataManagement?.tools || [];
                            const newTools = e.target.checked
                              ? [...currentTools, tool]
                              : currentTools.filter(t => t !== tool);

                            setScenario({
                              ...scenario,
                              practices: {
                                ...scenario.practices,
                                dataManagement: {
                                  tools: newTools,
                                  storageMethod: scenario.practices?.dataManagement?.storageMethod || '',
                                  accessFrequency: scenario.practices?.dataManagement?.accessFrequency || '',
                                  justification: scenario.practices?.dataManagement?.justification || ''
                                }
                              }
                            });
                          }}
                        />
                        <span className="text-sm capitalize">{tool}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Méthode de stockage
                    </label>
                    <select
                      className="w-full p-3 border rounded-lg"
                      value={scenario.practices?.dataManagement?.storageMethod || ''}
                      onChange={(e) => setScenario({
                        ...scenario,
                        practices: {
                          ...scenario.practices,
                          dataManagement: {
                            tools: scenario.practices?.dataManagement?.tools || [],
                            storageMethod: e.target.value,
                            accessFrequency: scenario.practices?.dataManagement?.accessFrequency || '',
                            justification: scenario.practices?.dataManagement?.justification || ''
                          }
                        }
                      })}
                    >
                      <option value="">Sélectionner</option>
                      <option value="local">Stockage local</option>
                      <option value="network">Réseau d'entreprise</option>
                      <option value="cloud">Cloud personnel</option>
                      <option value="email">Partage par email</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fréquence d'accès
                    </label>
                    <select
                      className="w-full p-3 border rounded-lg"
                      value={scenario.practices?.dataManagement?.accessFrequency || ''}
                      onChange={(e) => setScenario({
                        ...scenario,
                        practices: {
                          ...scenario.practices,
                          dataManagement: {
                            tools: scenario.practices?.dataManagement?.tools || [],
                            storageMethod: scenario.practices?.dataManagement?.storageMethod || '',
                            accessFrequency: e.target.value,
                            justification: scenario.practices?.dataManagement?.justification || ''
                          }
                        }
                      })}
                    >
                      <option value="">Sélectionner</option>
                      <option value="daily">Quotidienne</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuelle</option>
                      <option value="quarterly">Trimestrielle</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Justification
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                    placeholder="Décrivez votre gestion actuelle des données"
                    value={scenario.practices?.dataManagement?.justification || ''}
                    onChange={(e) => setScenario({
                      ...scenario,
                      practices: {
                        ...scenario.practices,
                        dataManagement: {
                          tools: scenario.practices?.dataManagement?.tools || [],
                          storageMethod: scenario.practices?.dataManagement?.storageMethod || '',
                          accessFrequency: scenario.practices?.dataManagement?.accessFrequency || '',
                          justification: e.target.value
                        }
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Validation et résultats
        const emissions = calculateEmissions(scenario);
        const additionality = calculateAdditionality(scenario);

        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Résultats du Scénario de Référence</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Calcul automatique des émissions de référence selon la méthodologie LBC
              </p>

              {/* Résumé des émissions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Émissions de Référence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Papier :</span>
                        <span className="font-semibold">{emissions.paperEmissions.toFixed(1)} kgCO₂e/an</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Déplacements :</span>
                        <span className="font-semibold">{emissions.travelEmissions.toFixed(1)} kgCO₂e/an</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Processus :</span>
                        <span className="font-semibold">{emissions.processEmissions.toFixed(1)} kgCO₂e/an</span>
                      </div>
                      <hr />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total :</span>
                        <span className="text-primary">{emissions.totalBaseline.toFixed(1)} kgCO₂e/an</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Additionnalité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Score d'additionnalité :</span>
                          <Badge variant={additionality.score > 0.5 ? 'success' : 'warning'}>
                            {(additionality.score * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <Progress value={additionality.score * 100} className="mb-3" />
                      </div>

                      <div>
                        <span className="text-sm font-medium">Barrières identifiées :</span>
                        <ul className="text-sm text-muted-foreground mt-1">
                          {additionality.barriers.map((barrier, index) => (
                            <li key={index}>• {barrier}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={() => onScenarioCalculated?.(scenario as BaselineScenarioData)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Valider le Scénario
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter PDF
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn('w-full max-w-4xl mx-auto', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Scénario de Référence LBC
          </CardTitle>
          <Badge variant="outline">Étape {currentStep + 1}/{steps.length}</Badge>
        </div>

        {/* Barre de progression */}
        <div className="flex gap-2 mt-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className={cn(
                'w-full h-2 rounded-full',
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              )} />
              {index < steps.length - 1 && (
                <div className="w-4" /> // Espace entre les étapes
              )}
            </div>
          ))}
        </div>

        {/* Étapes */}
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
              </div>
              <span className={cn(
                'text-sm',
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Précédent
          </Button>

          <div className="flex gap-2">
            {currentStep === steps.length - 1 && (
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Aperçu
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
            >
              {currentStep === steps.length - 2 ? 'Finaliser' : 'Suivant'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}