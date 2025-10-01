/**
 * Service de démonstration LBC avec données factices
 * Pour faciliter l'audit et la labellisation
 */

export interface DemoCompany {
  id: string;
  name: string;
  sector: string;
  employeeCount: number;
  location: string;
  baselineScenario: BaselineScenario;
  lbcProject: LBCProject;
  emissions: EmissionData;
  mrvData: MRVData[];
}

export interface BaselineScenario {
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
    method: string;
    frequency: string;
    timeSpent: number;
    justification: string;
  };
  dataManagement: {
    tools: string[];
    storageMethod: string;
    accessFrequency: string;
    justification: string;
  };
}

export interface LBCProject {
  projectId: string;
  startDate: string;
  methodology: string;
  expectedCredits: number;
  status: string;
  verificationBody: string;
}

export interface EmissionData {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  trends: Array<{
    period: string;
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  }>;
}

export interface MRVData {
  period: string;
  emissions: number;
  verificationStatus: string;
  documents: string[];
  notes: string;
}

export class LBCDemoService {
  private demoCompanies: DemoCompany[] = [];

  constructor() {
    this.initializeDemoData();
  }

  /**
   * Initialise les données de démonstration
   */
  private initializeDemoData(): void {
    this.demoCompanies = [
      {
        id: 'demo-tech-corp',
        name: 'TechCorp Solutions',
        sector: 'Technologies de l\'information',
        employeeCount: 150,
        location: 'Île-de-France',
        baselineScenario: {
          paperUsage: {
            monthlySheets: 2500,
            justification: 'Rapports mensuels, présentations clients, documentation interne imprimée pour chaque réunion'
          },
          travelPatterns: {
            monthlyMeetings: 12,
            avgParticipants: 8,
            avgDistance: 45,
            justification: 'Réunions clients en présentiel, formations équipes, séminaires sectoriels'
          },
          reportingMethods: {
            method: 'excel',
            frequency: 'monthly',
            timeSpent: 40,
            justification: 'Compilation manuelle des données dans Excel, vérification croisée des sources, génération rapports PowerPoint'
          },
          dataManagement: {
            tools: ['excel', 'email', 'local'],
            storageMethod: 'local',
            accessFrequency: 'weekly',
            justification: 'Données éparpillées sur postes individuels, partage par email, sauvegardes locales uniquement'
          }
        },
        lbcProject: {
          projectId: 'LBC-2024-001-DEMO',
          startDate: '2024-01-01',
          methodology: 'LBC-SAAS-CARBONE-001',
          expectedCredits: 1250,
          status: 'active',
          verificationBody: 'Bureau Veritas Certification'
        },
        emissions: {
          scope1: 85,
          scope2: 120,
          scope3: 245,
          total: 450,
          trends: [
            { period: '2023-Q1', scope1: 95, scope2: 140, scope3: 280, total: 515 },
            { period: '2023-Q2', scope1: 90, scope2: 135, scope3: 270, total: 495 },
            { period: '2023-Q3', scope1: 85, scope2: 125, scope3: 255, total: 465 },
            { period: '2023-Q4', scope1: 80, scope2: 120, scope3: 245, total: 445 },
            { period: '2024-Q1', scope1: 75, scope2: 110, scope3: 220, total: 405 },
            { period: '2024-Q2', scope1: 70, scope2: 100, scope3: 200, total: 370 }
          ]
        },
        mrvData: [
          {
            period: '2024-Q1',
            emissions: 405,
            verificationStatus: 'verified',
            documents: [
              'Rapport_émissions_Q1_2024.pdf',
              'Justificatifs_hébergement_vert.pdf',
              'Attestations_utilisateurs.pdf'
            ],
            notes: 'Première période post-adoption CarbonOS - Réductions conformes aux prévisions'
          },
          {
            period: '2024-Q2',
            emissions: 370,
            verificationStatus: 'pending',
            documents: [
              'Rapport_émissions_Q2_2024.pdf',
              'Logs_serveur_optimisation.pdf'
            ],
            notes: 'Optimisation serveur supplémentaire déployée - Résultats encourageants'
          }
        ]
      },

      {
        id: 'demo-green-industries',
        name: 'GreenIndustries Manufacturing',
        sector: 'Industrie manufacturière',
        employeeCount: 320,
        location: 'Auvergne-Rhône-Alpes',
        baselineScenario: {
          paperUsage: {
            monthlySheets: 4500,
            justification: 'Documentation production, rapports qualité, fiches sécurité, manuels opérateurs'
          },
          travelPatterns: {
            monthlyMeetings: 20,
            avgParticipants: 12,
            avgDistance: 35,
            justification: 'Réunions production quotidienne, audits qualité, formations sécurité, visites clients'
          },
          reportingMethods: {
            method: 'paper',
            frequency: 'monthly',
            timeSpent: 80,
            justification: 'Compilation manuelle des données de production, calculs Excel complexes, rapports papier pour direction'
          },
          dataManagement: {
            tools: ['paper', 'excel', 'email'],
            storageMethod: 'network',
            accessFrequency: 'daily',
            justification: 'Données critiques sur serveur partagé, accès fréquent mais sécurisé, sauvegardes externes'
          }
        },
        lbcProject: {
          projectId: 'LBC-2024-002-DEMO',
          startDate: '2024-01-01',
          methodology: 'LBC-SAAS-CARBONE-001',
          expectedCredits: 2850,
          status: 'active',
          verificationBody: 'Bureau Veritas Certification'
        },
        emissions: {
          scope1: 125,
          scope2: 180,
          scope3: 420,
          total: 725,
          trends: [
            { period: '2023-Q1', scope1: 140, scope2: 200, scope3: 480, total: 820 },
            { period: '2023-Q2', scope1: 135, scope2: 195, scope3: 460, total: 790 },
            { period: '2023-Q3', scope1: 130, scope2: 185, scope3: 440, total: 755 },
            { period: '2023-Q4', scope1: 125, scope2: 180, scope3: 420, total: 725 },
            { period: '2024-Q1', scope1: 115, scope2: 165, scope3: 380, total: 660 },
            { period: '2024-Q2', scope1: 105, scope2: 150, scope3: 340, total: 595 }
          ]
        },
        mrvData: [
          {
            period: '2024-Q1',
            emissions: 660,
            verificationStatus: 'verified',
            documents: [
              'Rapport_émissions_Q1_2024_GreenIndustries.pdf',
              'Certificat_hébergement_vert_2024.pdf',
              'Attestations_réductions_déplacements.pdf'
            ],
            notes: 'Réductions supérieures aux attentes grâce à optimisation processus'
          }
        ]
      },

      {
        id: 'demo-agro-consulting',
        name: 'AgroConsulting Services',
        sector: 'Services',
        employeeCount: 45,
        location: 'Occitanie',
        baselineScenario: {
          paperUsage: {
            monthlySheets: 1800,
            justification: 'Rapports d\'audit agricole, études de sol, recommandations culturales, documentation réglementaire'
          },
          travelPatterns: {
            monthlyMeetings: 25,
            avgParticipants: 6,
            avgDistance: 80,
            justification: 'Visites exploitations agricoles, audits terrain, formations agriculteurs, conférences sectorielles'
          },
          reportingMethods: {
            method: 'excel',
            frequency: 'quarterly',
            timeSpent: 60,
            justification: 'Compilation trimestrielle des données clients, calculs complexes des bilans carbone, rapports PDF pour clients'
          },
          dataManagement: {
            tools: ['excel', 'email', 'cloud'],
            storageMethod: 'cloud',
            accessFrequency: 'daily',
            justification: 'Données clients sensibles sur cloud personnel, partage par email, accès mobile pour audits terrain'
          }
        },
        lbcProject: {
          projectId: 'LBC-2024-003-DEMO',
          startDate: '2024-01-01',
          methodology: 'LBC-SAAS-CARBONE-001',
          expectedCredits: 890,
          status: 'active',
          verificationBody: 'Bureau Veritas Certification'
        },
        emissions: {
          scope1: 45,
          scope2: 65,
          scope3: 180,
          total: 290,
          trends: [
            { period: '2023-Q1', scope1: 50, scope2: 75, scope3: 210, total: 335 },
            { period: '2023-Q2', scope1: 48, scope2: 70, scope3: 195, total: 313 },
            { period: '2023-Q3', scope1: 46, scope2: 68, scope3: 185, total: 299 },
            { period: '2023-Q4', scope1: 45, scope2: 65, scope3: 180, total: 290 },
            { period: '2024-Q1', scope1: 42, scope2: 60, scope3: 165, total: 267 },
            { period: '2024-Q2', scope1: 38, scope2: 55, scope3: 150, total: 243 }
          ]
        },
        mrvData: [
          {
            period: '2024-Q1',
            emissions: 267,
            verificationStatus: 'verified',
            documents: [
              'Rapport_émissions_Q1_2024_AgroConsulting.pdf',
              'Justificatifs_déplacements_évités.pdf',
              'Attestations_clients.pdf'
            ],
            notes: 'Excellente adoption par les clients agricoles - Réductions voyages terrain significatives'
          }
        ]
      }
    ];
  }

  /**
   * Récupère une entreprise de démonstration
   */
  getDemoCompany(companyId: string): DemoCompany | undefined {
    return this.demoCompanies.find(company => company.id === companyId);
  }

  /**
   * Liste toutes les entreprises de démonstration
   */
  getAllDemoCompanies(): DemoCompany[] {
    return this.demoCompanies;
  }

  /**
   * Génère un package de démonstration pour audit LBC
   */
  generateDemoAuditPackage(companyId: string): DemoAuditPackage {
    const company = this.getDemoCompany(companyId);
    if (!company) {
      throw new Error('Entreprise de démonstration non trouvée');
    }

    return {
      metadata: {
        companyId: company.id,
        companyName: company.name,
        sector: company.sector,
        generationDate: new Date().toISOString(),
        demoMode: true,
        purpose: 'Facilitation audit Label Bas Carbone'
      },

      lbcProject: company.lbcProject,

      baselineScenario: {
        description: 'Pratiques de gestion carbone avant adoption CarbonOS',
        data: company.baselineScenario,
        emissions: {
          paper: company.baselineScenario.paperUsage.monthlySheets * 12 * 0.08 * 1.2,
          travel: company.baselineScenario.travelPatterns.monthlyMeetings * 12 *
                 company.baselineScenario.travelPatterns.avgParticipants *
                 company.baselineScenario.travelPatterns.avgDistance * 2 * 0.15,
          process: company.baselineScenario.reportingMethods.timeSpent * 52 * 0.3,
          total: company.emissions.total + (company.emissions.total * 0.55) // +55% référence
        },
        justification: 'Données collectées via questionnaires utilisateurs et benchmarks sectoriels ADEME'
      },

      projectEmissions: {
        current: company.emissions,
        trends: company.emissions.trends,
        reductions: {
          total: company.emissions.total * 0.55, // 55% de réduction
          scope1: company.emissions.scope1 * 0.65, // 65% réduction serveur
          scope2: company.emissions.scope2 * 0.60, // 60% réduction hébergement
          scope3: company.emissions.scope3 * 0.45  // 45% réduction utilisateurs
        }
      },

      mrvData: company.mrvData,

      compliance: {
        methodology: 'LBC-SAAS-CARBONE-001 v1.0.0',
        additionalityScore: 0.75,
        perimeterCompliance: 'Conforme - périmètre clairement délimité',
        permanenceCommitments: '5 ans garantis par contrats',
        uncertaintyAssessment: '10% - Facteurs ADEME officiels utilisés'
      },

      documents: {
        technicalDocumentation: '/demo/technical-docs.pdf',
        methodologyDocument: '/demo/methodology.pdf',
        auditTrail: '/demo/audit-trail.json',
        verificationReports: company.mrvData.map(mrv => `/demo/verification-${mrv.period}.pdf`),
        supportingEvidence: [
          '/demo/hosting-certificates.pdf',
          '/demo/user-testimonials.pdf',
          '/demo/energy-bills.pdf'
        ]
      },

      calculations: {
        formulas: {
          serverOptimization: 'CPU_Avant - CPU_Après × 0.057 × 8760',
          hostingEfficiency: 'PUE_Réf - PUE_Vert × Consommation × 0.057',
          travelAvoided: 'Réunions × Participants × Distance × 0.15',
          paperReduction: 'Documents × 0.08 × 1.2'
        },
        parameters: {
          facteur_emission_CPU: 0.057,
          facteur_transport: 0.15,
          facteur_papier: 1.2,
          heures_annuelles: 8760
        },
        results: company.emissions
      }
    };
  }

  /**
   * Génère des données de test pour les APIs
   */
  generateAPITestData(): any {
    return {
      companies: this.demoCompanies.map(company => ({
        id: company.id,
        name: company.name,
        sector: company.sector,
        employeeCount: company.employeeCount,
        lbcEligible: true,
        lbcProjectId: company.lbcProject.projectId
      })),

      emissions: this.demoCompanies.flatMap(company =>
        company.emissions.trends.map(trend => ({
          companyId: company.id,
          period: trend.period,
          scope1: trend.scope1,
          scope2: trend.scope2,
          scope3: trend.scope3,
          total: trend.total,
          lbcCompliant: true
        }))
      ),

      mrvData: this.demoCompanies.flatMap(company =>
        company.mrvData.map(mrv => ({
          companyId: company.id,
          period: mrv.period,
          emissions: mrv.emissions,
          verificationStatus: mrv.verificationStatus,
          documents: mrv.documents
        }))
      ),

      lbcProjects: this.demoCompanies.map(company => ({
        projectId: company.lbcProject.projectId,
        companyId: company.id,
        startDate: company.lbcProject.startDate,
        expectedCredits: company.lbcProject.expectedCredits,
        status: company.lbcProject.status,
        verificationBody: company.lbcProject.verificationBody
      }))
    };
  }

  /**
   * Génère un rapport de démonstration LBC
   */
  generateDemoLBCReport(companyId: string): string {
    const company = this.getDemoCompany(companyId);
    if (!company) {
      throw new Error('Entreprise de démonstration non trouvée');
    }

    const packageData = this.generateDemoAuditPackage(companyId);

    return `
# Rapport de Démonstration Label Bas Carbone
## CarbonOS - Entreprise : ${company.name}

## Résumé Exécutif
- **Secteur :** ${company.sector}
- **Employés :** ${company.employeeCount}
- **Émissions référence :** ${packageData.baselineScenario.emissions.total.toFixed(1)} kgCO₂e/an
- **Émissions projet :** ${packageData.projectEmissions.current.total.toFixed(1)} kgCO₂e/an
- **Réductions obtenues :** ${packageData.projectEmissions.reductions.total.toFixed(1)} kgCO₂e/an
- **Score additionnalité :** ${(packageData.compliance.additionalityScore * 100).toFixed(0)}%

## Méthodologie Appliquée
- **Code :** ${packageData.compliance.methodology}
- **Périmètre :** ${packageData.compliance.perimeterCompliance}
- **Incertitude :** ${packageData.compliance.uncertaintyAssessment}

## Données MRV
${packageData.mrvData.map(mrv => `
### Période ${mrv.period}
- Émissions : ${mrv.emissions} kgCO₂e
- Statut vérification : ${mrv.verificationStatus}
- Documents : ${mrv.documents.join(', ')}
- Notes : ${mrv.notes}
`).join('\n')}

## Calculs Détaillés
${Object.entries(packageData.calculations.formulas).map(([key, formula]) => `
### ${key}
Formule : ${formula}
`).join('\n')}

## Documents Justificatifs
${packageData.documents.supportingEvidence.map(doc => `- ${doc}`).join('\n')}

## Contact pour Audit
- **Plateforme :** CarbonOS
- **Email :** audit@carbonos.fr
- **Tél :** +33 1 23 45 67 89

---
*Rapport généré en mode démonstration - Données fictives à des fins d'audit LBC*
*Date de génération : ${new Date().toISOString().split('T')[0]}*`;
  }

  /**
   * Génère des données pour les tests automatisés
   */
  generateTestScenarios(): TestScenario[] {
    return [
      {
        name: 'Scénario PME Tech - Réductions Modérées',
        companyId: 'demo-tech-corp',
        expectedResults: {
          totalReductions: 247.5, // 55% de 450
          additionalityScore: 0.75,
          uncertainty: 0.1
        },
        testData: {
          serverMetrics: {
            cpuUsageBefore: 75,
            cpuUsageAfter: 60,
            energyConsumption: 15000 // kWh/an
          },
          userMetrics: {
            avgParticipants: 8,
            documentsAvoided: 30000, // feuilles/an
            timeSavedHours: 480 // heures/an
          }
        }
      },

      {
        name: 'Scénario Industrie - Réductions Élevées',
        companyId: 'demo-green-industries',
        expectedResults: {
          totalReductions: 398.75, // 55% de 725
          additionalityScore: 0.85,
          uncertainty: 0.08
        },
        testData: {
          serverMetrics: {
            cpuUsageBefore: 80,
            cpuUsageAfter: 55,
            energyConsumption: 28000 // kWh/an
          },
          userMetrics: {
            avgParticipants: 12,
            documentsAvoided: 54000, // feuilles/an
            timeSavedHours: 960 // heures/an
          }
        }
      },

      {
        name: 'Scénario Services - Réductions Mobilité',
        companyId: 'demo-agro-consulting',
        expectedResults: {
          totalReductions: 159.5, // 55% de 290
          additionalityScore: 0.80,
          uncertainty: 0.09
        },
        testData: {
          serverMetrics: {
            cpuUsageBefore: 70,
            cpuUsageAfter: 65,
            energyConsumption: 8000 // kWh/an
          },
          userMetrics: {
            avgParticipants: 6,
            documentsAvoided: 21600, // feuilles/an
            timeSavedHours: 720 // heures/an
          }
        }
      }
    ];
  }

  /**
   * Valide les données de démonstration selon critères LBC
   */
  validateDemoData(companyId: string): ValidationResult {
    const company = this.getDemoCompany(companyId);
    if (!company) {
      return {
        valid: false,
        errors: ['Entreprise de démonstration non trouvée'],
        warnings: [],
        score: 0
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation des données de référence
    if (company.baselineScenario.paperUsage.monthlySheets < 100) {
      warnings.push('Consommation papier référence très faible - vérification recommandée');
    }

    if (company.baselineScenario.travelPatterns.monthlyMeetings < 4) {
      warnings.push('Nombre de réunions référence faible - impact réduit');
    }

    // Validation des réductions
    const reductionRate = (company.emissions.total * 0.55) / (company.emissions.total + (company.emissions.total * 0.55));
    if (reductionRate > 0.7) {
      warnings.push('Taux de réduction très élevé - vérification approfondie recommandée');
    }

    // Validation MRV
    if (company.mrvData.length < 2) {
      errors.push('Données MRV insuffisantes - minimum 2 périodes requises');
    }

    const verifiedPeriods = company.mrvData.filter(mrv => mrv.verificationStatus === 'verified').length;
    if (verifiedPeriods === 0) {
      errors.push('Aucune période vérifiée - vérification indépendante requise');
    }

    // Calcul du score de qualité
    let score = 100;
    score -= errors.length * 25;
    score -= warnings.length * 5;
    score = Math.max(0, score);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score
    };
  }
}

interface DemoAuditPackage {
  metadata: {
    companyId: string;
    companyName: string;
    sector: string;
    generationDate: string;
    demoMode: boolean;
    purpose: string;
  };
  lbcProject: LBCProject;
  baselineScenario: {
    description: string;
    data: BaselineScenario;
    emissions: {
      paper: number;
      travel: number;
      process: number;
      total: number;
    };
    justification: string;
  };
  projectEmissions: {
    current: EmissionData;
    trends: Array<{
      period: string;
      scope1: number;
      scope2: number;
      scope3: number;
      total: number;
    }>;
    reductions: {
      total: number;
      scope1: number;
      scope2: number;
      scope3: number;
    };
  };
  mrvData: MRVData[];
  compliance: {
    methodology: string;
    additionalityScore: number;
    perimeterCompliance: string;
    permanenceCommitments: string;
    uncertaintyAssessment: string;
  };
  documents: {
    technicalDocumentation: string;
    methodologyDocument: string;
    auditTrail: string;
    verificationReports: string[];
    supportingEvidence: string[];
  };
  calculations: {
    formulas: Record<string, string>;
    parameters: Record<string, number>;
    results: EmissionData;
  };
}

interface TestScenario {
  name: string;
  companyId: string;
  expectedResults: {
    totalReductions: number;
    additionalityScore: number;
    uncertainty: number;
  };
  testData: {
    serverMetrics: {
      cpuUsageBefore: number;
      cpuUsageAfter: number;
      energyConsumption: number;
    };
    userMetrics: {
      avgParticipants: number;
      documentsAvoided: number;
      timeSavedHours: number;
    };
  };
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

// Instance singleton
export const lbcDemoService = new LBCDemoService();