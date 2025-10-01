'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Download,
  CheckCircle,
  Settings,
  Users,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Plus,
  Trash2
} from 'lucide-react';

interface CustomSection {
  id: string;
  title: string;
  type: string;
  required: boolean;
  description?: string;
}

interface CustomReportData {
  title: string;
  description: string;
  audience: string;
  purpose: string;
  sections: CustomSection[];
  format: string;
  frequency: string;
  deadline: string;
  stakeholders: string[];
  dataSources: string[];
  contactPerson: string;
  contactEmail: string;
  specialRequirements: string;
}

export function CustomGenerator() {
  const [formData, setFormData] = useState<CustomReportData>({
    title: '',
    description: '',
    audience: '',
    purpose: '',
    sections: [
      { id: '1', title: 'Résumé exécutif', type: 'summary', required: true },
      { id: '2', title: 'Émissions Scope 1', type: 'emissions', required: false },
      { id: '3', title: 'Émissions Scope 2', type: 'emissions', required: false },
      { id: '4', title: 'Émissions Scope 3', type: 'emissions', required: false }
    ],
    format: 'pdf',
    frequency: 'on-demand',
    deadline: '',
    stakeholders: [''],
    dataSources: [''],
    contactPerson: '',
    contactEmail: '',
    specialRequirements: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionType, setNewSectionType] = useState('text');

  const handleInputChange = (field: keyof CustomReportData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addStakeholder = () => {
    setFormData(prev => ({
      ...prev,
      stakeholders: [...prev.stakeholders, '']
    }));
  };

  const updateStakeholder = (index: number, value: string) => {
    const newStakeholders = [...formData.stakeholders];
    newStakeholders[index] = value;
    handleInputChange('stakeholders', newStakeholders);
  };

  const removeStakeholder = (index: number) => {
    const newStakeholders = formData.stakeholders.filter((_, i) => i !== index);
    handleInputChange('stakeholders', newStakeholders);
  };

  const addDataSource = () => {
    setFormData(prev => ({
      ...prev,
      dataSources: [...prev.dataSources, '']
    }));
  };

  const updateDataSource = (index: number, value: string) => {
    const newDataSources = [...formData.dataSources];
    newDataSources[index] = value;
    handleInputChange('dataSources', newDataSources);
  };

  const removeDataSource = (index: number) => {
    const newDataSources = formData.dataSources.filter((_, i) => i !== index);
    handleInputChange('dataSources', newDataSources);
  };

  const addSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: newSectionTitle,
      type: newSectionType,
      required: false
    };

    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));

    setNewSectionTitle('');
    setNewSectionType('text');
  };

  const removeSection = (id: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== id)
    }));
  };

  const toggleSectionRequired = (id: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id ? { ...section, required: !section.required } : section
      )
    }));
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulation de la génération du rapport
    const steps = [
      'Analyse des besoins personnalisés',
      'Collecte des données',
      'Génération du contenu sur mesure',
      'Formatage personnalisé',
      'Finalisation du rapport'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress((i + 1) * 20);
    }

    setIsGenerating(false);
    setGenerationProgress(100);

    // Ici on pourrait générer le PDF réel
    console.log('Rapport personnalisé généré:', formData);
  };

  const downloadReport = () => {
    const reportData = {
      title: formData.title,
      type: 'Custom',
      companyName: 'Entreprise', // À adapter selon le contexte
      period: formData.reportingPeriod || 'Période personnalisée',
      generatedAt: new Date().toISOString(),
      sections: formData.sections,
      totals: {
        scope1: formData.sections.some(s => s.title.includes('Scope 1')) ? 2450 : 0,
        scope2: formData.sections.some(s => s.title.includes('Scope 2')) ? 1230 : 0,
        scope3: formData.sections.some(s => s.title.includes('Scope 3')) ? 5670 : 0,
        total: 9350
      }
    };

    import('@/lib/report-generator').then(({ downloadReport: generateReport }) => {
      generateReport(reportData, 'custom');
    });
  };

  const sectionTypes = [
    { value: 'text', label: 'Texte libre' },
    { value: 'emissions', label: 'Données d\'émissions' },
    { value: 'summary', label: 'Résumé' },
    { value: 'chart', label: 'Graphique' },
    { value: 'table', label: 'Tableau' },
    { value: 'analysis', label: 'Analyse' },
    { value: 'recommendations', label: 'Recommandations' }
  ];

  return (
    <div className="space-y-6">
      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration du rapport personnalisé
          </CardTitle>
          <CardDescription>
            Définissez les paramètres de base de votre rapport sur mesure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du rapport *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Rapport d'impact climatique personnalisé"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Public cible</Label>
              <Select value={formData.audience} onValueChange={(value) => handleInputChange('audience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le public" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executives">Direction générale</SelectItem>
                  <SelectItem value="managers">Managers</SelectItem>
                  <SelectItem value="technical">Équipe technique</SelectItem>
                  <SelectItem value="external">Parties externes</SelectItem>
                  <SelectItem value="public">Grand public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description du rapport</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez l'objectif et le contenu de ce rapport personnalisé..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Objectif du rapport</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              placeholder="Quel est l'objectif principal de ce rapport ?"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections personnalisées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Sections du rapport
          </CardTitle>
          <CardDescription>
            Définissez les sections qui composeront votre rapport personnalisé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Liste des sections existantes */}
          <div className="space-y-3">
            {formData.sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`required-${section.id}`}
                    checked={section.required}
                    onCheckedChange={() => toggleSectionRequired(section.id)}
                  />
                  <div>
                    <Label htmlFor={`required-${section.id}`} className="font-medium">
                      {section.title}
                    </Label>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Type: {sectionTypes.find(t => t.value === section.type)?.label}
                      {section.required && <Badge variant="outline" className="ml-2 text-xs">Obligatoire</Badge>}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSection(section.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Ajouter une nouvelle section */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newSectionTitle">Titre de la section</Label>
                <Input
                  id="newSectionTitle"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Ex: Analyse comparative"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newSectionType">Type de section</Label>
                <Select value={newSectionType} onValueChange={setNewSectionType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={addSection} disabled={!newSectionTitle.trim()} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parties prenantes et sources de données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Parties prenantes et sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Parties prenantes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Parties prenantes</Label>
              <Button variant="outline" size="sm" onClick={addStakeholder}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {formData.stakeholders.map((stakeholder, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={stakeholder}
                    onChange={(e) => updateStakeholder(index, e.target.value)}
                    placeholder="Nom ou organisation"
                  />
                  {formData.stakeholders.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeStakeholder(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sources de données */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Sources de données</Label>
              <Button variant="outline" size="sm" onClick={addDataSource}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {formData.dataSources.map((source, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={source}
                    onChange={(e) => updateDataSource(index, e.target.value)}
                    placeholder="Ex: Base de données interne, Capteurs IoT, etc."
                  />
                  {formData.dataSources.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDataSource(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration finale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Configuration finale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Format de sortie</Label>
              <Select value={formData.format} onValueChange={(value) => handleInputChange('format', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint</SelectItem>
                  <SelectItem value="word">Word</SelectItem>
                  <SelectItem value="html">HTML interactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Fréquence de génération</Label>
              <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-demand">À la demande</SelectItem>
                  <SelectItem value="daily">Quotidienne</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuelle</SelectItem>
                  <SelectItem value="quarterly">Trimestrielle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Échéance souhaitée</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequirements">Exigences particulières</Label>
            <Textarea
              id="specialRequirements"
              value={formData.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
              placeholder="Exigences spécifiques, contraintes techniques, format particulier..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Informations de contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Informations de contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Personne référente *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="Nom du responsable"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de contact *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="contact@entreprise.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Génération du rapport */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/20 border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Génération du rapport personnalisé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Génération du rapport personnalisé...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={generateReport}
              disabled={isGenerating || !formData.title || !formData.contactPerson}
              className="gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Génération...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Générer le rapport personnalisé
                </>
              )}
            </Button>

            {generationProgress === 100 && (
              <Button variant="outline" onClick={downloadReport} className="gap-2">
                <Download className="h-4 w-4" />
                Télécharger le rapport
              </Button>
            )}
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p>• Rapport entièrement personnalisé selon vos spécifications</p>
            <p>• Temps de génération estimé : 45-90 secondes</p>
            <p>• Format optimisé pour votre public cible</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}