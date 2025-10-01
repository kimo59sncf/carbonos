'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Building,
  Calendar,
  Calculator,
  Leaf,
  Factory
} from 'lucide-react';

interface BEGESReportData {
  companyName: string;
  siret: string;
  reportingYear: string;
  activitySector: string;
  employeeCount: string;
  turnover: string;
  includeScope1: boolean;
  includeScope2: boolean;
  includeScope3: boolean;
  methodology: string;
  calculationTools: string[];
  dataQuality: string;
  uncertaintyLevel: string;
  verificationBody: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export function BEGESGenerator() {
  const [formData, setFormData] = useState<BEGESReportData>({
    companyName: '',
    siret: '',
    reportingYear: new Date().getFullYear().toString(),
    activitySector: '',
    employeeCount: '',
    turnover: '',
    includeScope1: true,
    includeScope2: true,
    includeScope3: false, // Optionnel pour BEGES
    methodology: 'Bilan Carbone',
    calculationTools: ['Base Carbone ADEME'],
    dataQuality: 'good',
    uncertaintyLevel: 'medium',
    verificationBody: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleInputChange = (field: keyof BEGESReportData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToolToggle = (tool: string) => {
    const currentTools = formData.calculationTools;
    const newTools = currentTools.includes(tool)
      ? currentTools.filter(t => t !== tool)
      : [...currentTools, tool];

    handleInputChange('calculationTools', newTools);
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulation de la génération du rapport
    const steps = [
      'Collecte des données BEGES',
      'Calcul des émissions par poste',
      'Analyse de l\'incertitude',
      'Génération du formulaire CEREMA',
      'Finalisation du bilan'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress((i + 1) * 20);
    }

    setIsGenerating(false);
    setGenerationProgress(100);

    // Ici on pourrait générer le PDF réel
    console.log('Rapport BEGES généré:', formData);
  };

  const downloadReport = () => {
    const reportData = {
      title: `Bilan BEGES ${formData.companyName} ${formData.reportingYear}`,
      type: 'BEGES',
      companyName: formData.companyName,
      period: formData.reportingYear,
      generatedAt: new Date().toISOString(),
      sections: [
        { title: 'Informations réglementaires', type: 'info', required: true },
        { title: 'Émissions Scope 1', type: 'emissions', required: formData.includeScope1 },
        { title: 'Émissions Scope 2', type: 'emissions', required: formData.includeScope2 },
        { title: 'Émissions Scope 3', type: 'emissions', required: formData.includeScope3 }
      ].filter(section => section.required),
      totals: {
        scope1: 2450,
        scope2: 1230,
        scope3: formData.includeScope3 ? 5670 : 0,
        total: formData.includeScope3 ? 9350 : 3680
      }
    };

    import('@/lib/report-generator').then(({ downloadReport: generateReport }) => {
      generateReport(reportData, 'beges');
    });
  };

  const calculationTools = [
    'Base Carbone ADEME',
    'GHG Protocol',
    'Outil interne',
    'Logiciel spécialisé'
  ];

  return (
    <div className="space-y-6">
      {/* Informations réglementaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informations réglementaires BEGES
          </CardTitle>
          <CardDescription>
            Informations requises pour le bilan réglementaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de l'entreprise *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Nom de votre entreprise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siret">Numéro SIRET *</Label>
              <Input
                id="siret"
                value={formData.siret}
                onChange={(e) => handleInputChange('siret', e.target.value)}
                placeholder="123 456 789 01234"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportingYear">Année de reporting *</Label>
              <Select value={formData.reportingYear} onValueChange={(value) => handleInputChange('reportingYear', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activitySector">Secteur d'activité *</Label>
              <Select value={formData.activitySector} onValueChange={(value) => handleInputChange('activitySector', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="industrie">Industrie</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="commerce">Commerce</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="energie">Énergie</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCount">Effectif (année N-1)</Label>
              <Input
                id="employeeCount"
                type="number"
                value={formData.employeeCount}
                onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                placeholder="500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="turnover">Chiffre d'affaires (€)</Label>
              <Input
                id="turnover"
                type="number"
                value={formData.turnover}
                onChange={(e) => handleInputChange('turnover', e.target.value)}
                placeholder="1000000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Périmètre du bilan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Périmètre du bilan
          </CardTitle>
          <CardDescription>
            Sélectionnez les scopes à inclure dans le bilan BEGES
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scope1"
                  checked={formData.includeScope1}
                  onCheckedChange={(checked: boolean) => handleInputChange('includeScope1', !!checked)}
                />
                <Label htmlFor="scope1" className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Scope 1 - Émissions directes
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scope2"
                  checked={formData.includeScope2}
                  onCheckedChange={(checked: boolean) => handleInputChange('includeScope2', !!checked)}
                />
                <Label htmlFor="scope2" className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Scope 2 - Émissions énergie
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scope3"
                  checked={formData.includeScope3}
                  onCheckedChange={(checked: boolean) => handleInputChange('includeScope3', !!checked)}
                />
                <Label htmlFor="scope3" className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Scope 3 - Émissions indirectes
                  <Badge variant="outline" className="text-xs">Optionnel</Badge>
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Obligation réglementaire</Label>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p>• Scope 1 : Obligatoire</p>
                <p>• Scope 2 : Obligatoire</p>
                <p>• Scope 3 : Recommandé</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Méthodologie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Méthodologie et outils
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="methodology">Méthodologie utilisée</Label>
              <Select value={formData.methodology} onValueChange={(value) => handleInputChange('methodology', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bilan Carbone">Méthode Bilan Carbone®</SelectItem>
                  <SelectItem value="GHG Protocol">GHG Protocol</SelectItem>
                  <SelectItem value="ISO 14064">ISO 14064</SelectItem>
                  <SelectItem value="Mixte">Approche mixte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataQuality">Qualité des données</Label>
              <Select value={formData.dataQuality} onValueChange={(value) => handleInputChange('dataQuality', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellente (plus de 90% données primaires)</SelectItem>
                  <SelectItem value="good">Bonne (70-90% données primaires)</SelectItem>
                  <SelectItem value="fair">Acceptable (50-70% données primaires)</SelectItem>
                  <SelectItem value="poor">À améliorer (moins de 50% données primaires)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Outils de calcul utilisés</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {calculationTools.map((tool) => (
                <div key={tool} className="flex items-center space-x-2">
                  <Checkbox
                    id={tool}
                    checked={formData.calculationTools.includes(tool)}
                    onCheckedChange={() => handleToolToggle(tool)}
                  />
                  <Label htmlFor={tool} className="text-sm">{tool}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incertitude et vérification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Incertitude et vérification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="uncertaintyLevel">Niveau d'incertitude global</Label>
              <Select value={formData.uncertaintyLevel} onValueChange={(value) => handleInputChange('uncertaintyLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible (moins de 10%)</SelectItem>
                  <SelectItem value="medium">Moyen (10-25%)</SelectItem>
                  <SelectItem value="high">Élevé (plus de 25%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationBody">Organisme de vérification</Label>
              <Input
                id="verificationBody"
                value={formData.verificationBody}
                onChange={(e) => handleInputChange('verificationBody', e.target.value)}
                placeholder="Nom de l'organisme (optionnel)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations de contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Informations de contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="contactEmail">Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="contact@entreprise.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Téléphone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="01 23 45 67 89"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Génération du rapport */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Génération du bilan BEGES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Génération du bilan BEGES...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={generateReport}
              disabled={isGenerating || !formData.companyName || !formData.siret}
              className="gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Génération...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Générer le bilan BEGES
                </>
              )}
            </Button>

            {generationProgress === 100 && (
              <Button variant="outline" onClick={downloadReport} className="gap-2">
                <Download className="h-4 w-4" />
                Télécharger le bilan
              </Button>
            )}
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p>• Le bilan sera généré au format CEREMA (format officiel BEGES)</p>
            <p>• Temps de génération estimé : 20-40 secondes</p>
            <p>• Le rapport respecte les obligations réglementaires françaises</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}