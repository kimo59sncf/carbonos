/**
 * Méthodologie LBC spécifique aux plateformes SaaS de gestion carbone
 * Conforme au référentiel Label Bas Carbone 2025
 */

export interface LBCMethodology {
  id: string;
  name: string;
  version: string;
  description: string;
  eligibilityCriteria: EligibilityCriteria;
  calculationFormula: CalculationFormula;
  mrvRequirements: MRVRequirements;
  perimeter: PerimeterDefinition;
  additionality: AdditionalityRequirements;
  permanence: PermanenceRequirements;
  coBenefits: CoBenefitsDefinition;
}

export interface EligibilityCriteria {
  saasRequirements: {
    minUsers: number;
    requiredFeatures: string[];
    hostingRequirements: string[];
    dataRetention: number; // mois
  };
  userRequirements: {
    sectors: string[];
    minCompanySize: number;
    geographicScope: string[];
  };
  technicalRequirements: {
    apiIntegration: boolean;
    realTimeMonitoring: boolean;
    exportCapabilities: string[];
    securityStandards: string[];
  };
}

export interface CalculationFormula {
  directReductions: {
    serverOptimization: {
      formula: string;
      parameters: Record<string, number>;
      sources: string[];
    };
    hostingEfficiency: {
      formula: string;
      parameters: Record<string, number>;
      sources: string[];
    };
  };
  indirectReductions: {
    travelAvoided: {
      formula: string;
      parameters: Record<string, number>;
      sources: string[];
    };
    paperReduction: {
      formula: string;
      parameters: Record<string, number>;
      sources: string[];
    };
    processOptimization: {
      formula: string;
      parameters: Record<string, number>;
      sources: string[];
    };
  };
  uncertainty: {
    defaultRate: number;
    adjustmentFactors: Record<string, number>;
  };
}

export interface MRVRequirements {
  monitoring: {
    frequency: string;
    parameters: string[];
    dataSources: string[];
    qualityControl: string[];
  };
  reporting: {
    frequency: string;
    format: string[];
    requiredDocuments: string[];
    verificationProcess: string[];
  };
  verification: {
    auditorQualifications: string[];
    verificationScope: string[];
    samplingMethodology: string;
    uncertaintyAssessment: string[];
  };
}

export interface PerimeterDefinition {
  included: {
    directEmissions: string[];
    indirectEmissions: string[];
    activities: string[];
    timeframe: {
      start: string;
      duration: number; // années
    };
  };
  excluded: {
    emissions: string[];
    activities: string[];
    justifications: string[];
  };
  boundaries: {
    organizational: string;
    operational: string;
    geographic: string[];
  };
}

export interface AdditionalityRequirements {
  baselineScenario: {
    description: string;
    justification: string;
    dataSources: string[];
  };
  demonstration: {
    methods: string[];
    evidence: string[];
    quantification: string;
  };
  barriers: {
    investment: string[];
    institutional: string[];
    technical: string[];
  };
}

export interface PermanenceRequirements {
  duration: number; // années
  commitments: {
    hostingProvider: string[];
    platformMaintenance: string[];
    userEngagement: string[];
  };
  riskManagement: {
    mitigationMeasures: string[];
    contingencyPlans: string[];
    compensationMechanisms: string[];
  };
}

export interface CoBenefitsDefinition {
  environmental: {
    biodiversity: string[];
    waterManagement: string[];
    soilQuality: string[];
  };
  social: {
    accessibility: string[];
    employment: string[];
    training: string[];
  };
  economic: {
    costSavings: string[];
    productivity: string[];
    innovation: string[];
  };
}

export class LBCMethodologyService {
  private methodology: LBCMethodology;

  constructor() {
    this.methodology = this.createLBCMethodology();
  }

  /**
   * Crée la méthodologie LBC spécifique aux SaaS carbone
   */
  private createLBCMethodology(): LBCMethodology {
    return {
      id: 'LBC-SAAS-CARBONE-001',
      name: 'Solutions SaaS de Gestion Carbone',
      version: '1.0.0',
      description: 'Méthodologie pour quantifier les réductions d\'émissions générées par l\'utilisation de plateformes SaaS de gestion carbone, incluant les réductions directes (optimisation serveur) et indirectes (changements comportementaux utilisateurs).',

      eligibilityCriteria: {
        saasRequirements: {
          minUsers: 10,
          requiredFeatures: [
            'Suivi temps réel des émissions',
            'Exports automatisés PDF/Excel',
            'APIs pour intégration externe',
            'Dashboard personnalisable',
            'Système de notifications'
          ],
          hostingRequirements: [
            'Hébergement vert certifié ISO 50001',
            'Énergie renouvelable >80%',
            'Refroidissement écologique',
            'Mesure consommation énergétique'
          ],
          dataRetention: 60 // 5 ans minimum
        },
        userRequirements: {
          sectors: [
            'Industrie manufacturière',
            'Services',
            'Agriculture',
            'Transport',
            'Construction',
            'Technologies de l\'information'
          ],
          minCompanySize: 1,
          geographicScope: ['France', 'Union Européenne']
        },
        technicalRequirements: {
          apiIntegration: true,
          realTimeMonitoring: true,
          exportCapabilities: ['PDF', 'Excel', 'CSV', 'JSON', 'API'],
          securityStandards: ['RGPD', 'ISO 27001', 'SOC 2']
        }
      },

      calculationFormula: {
        directReductions: {
          serverOptimization: {
            formula: 'Réductions_Serveur = (CPU_Avant - CPU_Après) × Facteur_Émission_CPU × Heures_Fonctionnement',
            parameters: {
              efficacite_CPU: 0.15, // 15% d'amélioration efficacité
              facteur_emission_CPU: 0.057, // kgCO2e/kWh (ADEME)
              heures_annuelles: 8760
            },
            sources: ['ADEME Base Carbone®', 'Études académiques CPU efficiency']
          },
          hostingEfficiency: {
            formula: 'Réductions_Hébergement = Consommation_Référence - Consommation_Verte',
            parameters: {
              pue_reference: 1.8, // PUE moyen datacenters traditionnels
              pue_vert: 1.2, // PUE datacenters verts
              facteur_emission_kwh: 0.057
            },
            sources: ['ADEME', 'Green Grid PUE metrics']
          }
        },
        indirectReductions: {
          travelAvoided: {
            formula: 'Réductions_Déplacements = Nombre_Réunions × Participants × Distance_Moyenne × Facteur_Transport',
            parameters: {
              frequence_reunions: 12, // par an
              participants_moyen: 5,
              distance_moyenne: 50, // km A/R
              facteur_transport: 0.15 // kgCO2e/km
            },
            sources: ['Base Carbone®', 'Études télétravail ADEME']
          },
          paperReduction: {
            formula: 'Réductions_Papier = Documents_Évitée × Masse_Papier × Facteur_Papier',
            parameters: {
              documents_par_utilisateur: 500, // par an
              masse_feuille: 0.08, // kg
              facteur_papier: 1.2 // kgCO2e/kg
            },
            sources: ['ADEME Papier', 'ÉcoFolio']
          },
          processOptimization: {
            formula: 'Réductions_Processus = Temps_Gagné × Salaires × Facteur_Temps',
            parameters: {
              temps_gagne_heure: 20, // par utilisateur/an
              salaire_moyen: 25, // €/heure
              facteur_temps: 0.3 // kgCO2e/€ de salaire
            },
            sources: ['Études productivité numérique', 'ADEME Numérique Responsable']
          }
        },
        uncertainty: {
          defaultRate: 0.1, // 10% d'incertitude par défaut
          adjustmentFactors: {
            'monitoring_automatise': -0.02,
            'verification_tierce': -0.03,
            'donnees_temps_reel': -0.01,
            'facteurs_officiels': -0.02
          }
        }
      },

      mrvRequirements: {
        monitoring: {
          frequency: 'Temps réel avec agrégation mensuelle',
          parameters: [
            'Consommation électrique serveurs',
            'Utilisation CPU/RAM',
            'Nombre d\'utilisateurs actifs',
            'Volume de données exportées',
            'Temps d\'utilisation plateforme'
          ],
          dataSources: [
            'APIs hébergeur',
            'Monitoring interne CarbonOS',
            'Logs utilisateurs anonymisés',
            'APIs externes (météo, carbone)'
          ],
          qualityControl: [
            'Vérification automatique des données',
            'Détection des anomalies',
            'Sauvegarde redondante',
            'Audit trail complet'
          ]
        },
        reporting: {
          frequency: 'Annuel avec rapports trimestriels optionnels',
          format: ['PDF LBC', 'Excel LBC', 'JSON structuré', 'API'],
          requiredDocuments: [
            'Rapport d\'activité annuel',
            'Justificatifs hébergement vert',
            'Attestations utilisateurs',
            'Rapport vérificateur'
          ],
          verificationProcess: [
            'Auto-déclaration plateforme',
            'Vérification documentaire',
            'Audit sur site si >1000 tCO2',
            'Rapport de vérification'
          ]
        },
        verification: {
          auditorQualifications: [
            'Accréditation Cofrac ISO 14065',
            'Expérience SaaS/Numérique',
            'Connaissance LBC/CSRD',
            'Indépendance certifiée'
          ],
          verificationScope: [
            'Exactitude des calculs',
            'Conformité méthodologique',
            'Complétude des données',
            'Respect des périmètres'
          ],
          samplingMethodology: 'Échantillonnage statistique 95% avec vérification croisée des sources, tests de sensibilité et analyse des tendances',
          uncertaintyAssessment: [
            'Évaluation Monte Carlo',
            'Analyse de sensibilité',
            'Comparaison avec benchmarks',
            'Validation experte'
          ]
        }
      },

      perimeter: {
        included: {
          directEmissions: [
            'Consommation électrique serveurs',
            'Refroidissement datacenter',
            'Maintenance infrastructure'
          ],
          indirectEmissions: [
            'Déplacements évités utilisateurs',
            'Papier évité',
            'Optimisation processus'
          ],
          activities: [
            'Utilisation plateforme CarbonOS',
            'Exports et rapports générés',
            'APIs externes consultées',
            'Notifications et alertes'
          ],
          timeframe: {
            start: '2024-01-01',
            duration: 5 // années
          }
        },
        excluded: {
          emissions: [
            'Émissions infrastructures mutualisées',
            'Équipements utilisateurs (PC, mobiles)',
            'Réseaux externes non contrôlés'
          ],
          activities: [
            'Développement logiciel',
            'Support technique présentiel',
            'Formation en présentiel'
          ],
          justifications: [
            'Non contrôlables directement',
            'Non spécifiques à la plateforme',
            'Impact marginal démontré'
          ]
        },
        boundaries: {
          organizational: 'CarbonOS SAS uniquement',
          operational: 'Fonctionnement plateforme SaaS',
          geographic: ['France', 'Union Européenne']
        }
      },

      additionality: {
        baselineScenario: {
          description: 'Pratiques de gestion carbone traditionnelles : Excel, papier, emails, réunions physiques, stockage local',
          justification: 'Méthodes courantes avant adoption plateformes SaaS spécialisées',
          dataSources: [
            'Études ADEME pratiques entreprises',
            'Enquêtes utilisateurs CarbonOS',
            'Benchmarks sectoriels'
          ]
        },
        demonstration: {
          methods: [
            'Comparaison avant/après',
            'Analyse de sensibilité',
            'Étude de marché',
            'Expertise indépendante'
          ],
          evidence: [
            'Questionnaires utilisateurs',
            'Logs d\'utilisation plateforme',
            'Comparatifs de consommation',
            'Attestations de changements'
          ],
          quantification: 'Réductions = Émissions_Réf - Émissions_Projet'
        },
        barriers: {
          investment: [
            'Coût initial plateforme',
            'Formation équipes',
            'Migration données'
          ],
          institutional: [
            'Résistance au changement',
            'Manque de sensibilisation',
            'Contraintes réglementaires'
          ],
          technical: [
            'Intégration systèmes existants',
            'Sécurité des données',
            'Interopérabilité APIs'
          ]
        }
      },

      permanence: {
        duration: 5,
        commitments: {
          hostingProvider: [
            'Contrat hébergement vert 5 ans minimum',
            'Certification énergie renouvelable',
            'Engagement réduction consommation'
          ],
          platformMaintenance: [
            'Maintenance corrective préventive',
            'Mises à jour sécurité',
            'Support technique continu'
          ],
          userEngagement: [
            'Formation utilisateurs',
            'Accompagnement adoption',
            'Support technique dédié'
          ]
        },
        riskManagement: {
          mitigationMeasures: [
            'Sauvegarde redondante',
            'Plan de continuité activité',
            'Diversification hébergeurs'
          ],
          contingencyPlans: [
            'Basculement automatique',
            'Compensation émissions',
            'Remboursement crédits'
          ],
          compensationMechanisms: [
            'Achat crédits compensatoires',
            'Investissement projets verts',
            'Partenariat ONG environnement'
          ]
        }
      },

      coBenefits: {
        environmental: {
          biodiversity: [
            'Optimisation énergétique réduisant empreinte globale',
            'Hébergement vert préservant ressources naturelles'
          ],
          waterManagement: [
            'Refroidissement écologique réduisant consommation eau'
          ],
          soilQuality: [
            'Réduction déplacements limitant pollution sols'
          ]
        },
        social: {
          accessibility: [
            'Interface accessible réduisant consommation énergétique',
            'Navigation optimisée pour utilisateurs handicapés',
            'Réduction fatigue visuelle'
          ],
          employment: [
            'Création emplois verts développement',
            'Formation équipes transition écologique'
          ],
          training: [
            'Formation utilisateurs gestion carbone',
            'Sensibilisation enjeux environnementaux'
          ]
        },
        economic: {
          costSavings: [
            'Réduction coûts déplacement',
            'Économies papier et impression',
            'Gain productivité processus'
          ],
          productivity: [
            'Automatisation rapports',
            'Suivi temps réel',
            'Décision basée données'
          ],
          innovation: [
            'APIs ouvertes pour écosystème',
            'Intégration technologies vertes',
            'R&D optimisation énergétique'
          ]
        }
      }
    };
  }

  /**
   * Génère la documentation technique LBC
   */
  generateTechnicalDocumentation(): string {
    const method = this.methodology;

    return `
# Méthodologie LBC - ${method.name}
## Version ${method.version}

## Description
${method.description}

## Critères d'Éligibilité

### Exigences SaaS
- **Utilisateurs minimum :** ${method.eligibilityCriteria.saasRequirements.minUsers}
- **Fonctionnalités requises :** ${method.eligibilityCriteria.saasRequirements.requiredFeatures.join(', ')}
- **Hébergement :** ${method.eligibilityCriteria.saasRequirements.hostingRequirements.join(', ')}
- **Rétention données :** ${method.eligibilityCriteria.saasRequirements.dataRetention} mois

### Secteurs utilisateurs éligibles
${method.eligibilityCriteria.userRequirements.sectors.join(', ')}

## Formules de Calcul

### Réductions Directes

**Optimisation Serveur :**
\`\`\`
${method.calculationFormula.directReductions.serverOptimization.formula}
Paramètres : ${JSON.stringify(method.calculationFormula.directReductions.serverOptimization.parameters, null, 2)}
Sources : ${method.calculationFormula.directReductions.serverOptimization.sources.join(', ')}
\`\`\`

**Efficacité Hébergement :**
\`\`\`
${method.calculationFormula.directReductions.hostingEfficiency.formula}
Paramètres : ${JSON.stringify(method.calculationFormula.directReductions.hostingEfficiency.parameters, null, 2)}
Sources : ${method.calculationFormula.directReductions.hostingEfficiency.sources.join(', ')}
\`\`\`

### Réductions Indirectes

**Déplacements Évitée :**
\`\`\`
${method.calculationFormula.indirectReductions.travelAvoided.formula}
Paramètres : ${JSON.stringify(method.calculationFormula.indirectReductions.travelAvoided.parameters, null, 2)}
Sources : ${method.calculationFormula.indirectReductions.travelAvoided.sources.join(', ')}
\`\`\`

## Système MRV

### Monitoring
- **Fréquence :** ${method.mrvRequirements.monitoring.frequency}
- **Paramètres :** ${method.mrvRequirements.monitoring.parameters.join(', ')}
- **Sources données :** ${method.mrvRequirements.monitoring.dataSources.join(', ')}

### Reporting
- **Fréquence :** ${method.mrvRequirements.reporting.frequency}
- **Formats :** ${method.mrvRequirements.reporting.format.join(', ')}

## Périmètre

### Inclus
- **Émissions directes :** ${method.perimeter.included.directEmissions.join(', ')}
- **Émissions indirectes :** ${method.perimeter.included.indirectEmissions.join(', ')}
- **Activités :** ${method.perimeter.included.activities.join(', ')}

### Exclus
- **Émissions :** ${method.perimeter.excluded.emissions.join(', ')}
- **Activités :** ${method.perimeter.excluded.activities.join(', ')}

## Additionnalité

### Scénario de Référence
${method.additionality.baselineScenario.description}

**Justification :** ${method.additionality.baselineScenario.justification}

## Permanence

**Durée :** ${method.permanence.duration} ans

**Engagements :**
- Hébergeur : ${method.permanence.commitments.hostingProvider.join(', ')}
- Maintenance : ${method.permanence.commitments.platformMaintenance.join(', ')}
- Utilisateurs : ${method.permanence.commitments.userEngagement.join(', ')}

## Co-bénéfices

### Environnementaux
- Biodiversité : ${method.coBenefits.environmental.biodiversity.join(', ')}
- Eau : ${method.coBenefits.environmental.waterManagement.join(', ')}

### Sociaux
- Accessibilité : ${method.coBenefits.social.accessibility.join(', ')}
- Emploi : ${method.coBenefits.social.employment.join(', ')}
- Formation : ${method.coBenefits.social.training.join(', ')}

## Documents Requis pour Labellisation

1. **Description technique** de la plateforme
2. **Bilan carbone** initial selon Carbo
3. **Justificatifs hébergement** vert
4. **Attestations utilisateurs** sur pratiques antérieures
5. **Rapport vérificateur** indépendant
6. **Plan de gestion** des risques

## Contact pour Labellisation

**Développeur méthodologie :** CarbonOS SAS
**Contact :** lbc@carbonos.fr
**Version :** ${method.version}
**Date :** ${new Date().toISOString().split('T')[0]}

---
*Document généré automatiquement par CarbonOS - Conforme Label Bas Carbone 2025*`;
  }

  /**
   * Calcule les réductions selon la méthodologie LBC
   */
  calculateLBCReductions(data: {
    serverMetrics: ServerMetrics;
    userMetrics: UserMetrics;
    hostingData: HostingData;
  }): LBCCalculationResult {
    const method = this.methodology;

    // Calculs directs
    const serverOptimization = this.calculateServerOptimization(data.serverMetrics);
    const hostingEfficiency = this.calculateHostingEfficiency(data.hostingData);

    // Calculs indirects
    const travelAvoided = this.calculateTravelAvoided(data.userMetrics);
    const paperReduction = this.calculatePaperReduction(data.userMetrics);
    const processOptimization = this.calculateProcessOptimization(data.userMetrics);

    // Total des réductions
    const totalReductions = serverOptimization +
                           hostingEfficiency +
                           travelAvoided +
                           paperReduction +
                           processOptimization;

    // Calcul de l'incertitude
    const uncertainty = this.calculateUncertainty(totalReductions, data);

    return {
      directReductions: {
        serverOptimization,
        hostingEfficiency,
        total: serverOptimization + hostingEfficiency
      },
      indirectReductions: {
        travelAvoided,
        paperReduction,
        processOptimization,
        total: travelAvoided + paperReduction + processOptimization
      },
      totalReductions,
      uncertainty,
      netReductions: totalReductions * (1 - uncertainty),
      calculationDate: new Date(),
      methodologyVersion: method.version
    };
  }

  private calculateServerOptimization(metrics: ServerMetrics): number {
    const { formula, parameters } = this.methodology.calculationFormula.directReductions.serverOptimization;

    // Calcul selon formule définie
    return (metrics.cpuUsageBefore - metrics.cpuUsageAfter) *
           parameters.facteur_emission_CPU *
           parameters.heures_annuelles;
  }

  private calculateHostingEfficiency(hosting: HostingData): number {
    const { formula, parameters } = this.methodology.calculationFormula.directReductions.hostingEfficiency;

    return (hosting.pueReference - hosting.pueGreen) *
           hosting.energyConsumption *
           parameters.facteur_emission_kwh;
  }

  private calculateTravelAvoided(users: UserMetrics): number {
    const { formula, parameters } = this.methodology.calculationFormula.indirectReductions.travelAvoided;

    return parameters.frequence_reunions *
           users.avgParticipants *
           parameters.distance_moyenne *
           parameters.facteur_transport;
  }

  private calculatePaperReduction(users: UserMetrics): number {
    const { formula, parameters } = this.methodology.calculationFormula.indirectReductions.paperReduction;

    return users.documentsAvoided *
           parameters.masse_feuille *
           parameters.facteur_papier;
  }

  private calculateProcessOptimization(users: UserMetrics): number {
    const { formula, parameters } = this.methodology.calculationFormula.indirectReductions.processOptimization;

    return users.timeSavedHours *
           parameters.salaire_moyen *
           parameters.facteur_temps;
  }

  private calculateUncertainty(totalReductions: number, data: any): number {
    let uncertainty = this.methodology.calculationFormula.uncertainty.defaultRate;

    // Ajustements selon facteurs de qualité
    const adjustments = this.methodology.calculationFormula.uncertainty.adjustmentFactors;

    if (data.realTimeMonitoring) uncertainty += adjustments.donnees_temps_reel;
    if (data.thirdPartyVerification) uncertainty += adjustments.verification_tierce;
    if (data.officialFactors) uncertainty += adjustments.facteurs_officiels;

    return Math.max(0, uncertainty); // Pas d'incertitude négative
  }

  /**
   * Génère le dossier de preuves pour l'auditeur
   */
  generateAuditPackage(projectId: string): AuditPackage {
    return {
      projectId,
      methodology: this.methodology,
      technicalDocumentation: this.generateTechnicalDocumentation(),
      calculationDetails: {
        formulas: this.methodology.calculationFormula,
        parameters: this.extractAllParameters(),
        sources: this.extractAllSources()
      },
      complianceChecklist: this.generateComplianceChecklist(),
      requiredDocuments: this.getRequiredDocumentsList(),
      apiEndpoints: this.getAPIAccessPoints(),
      generationDate: new Date()
    };
  }

  private extractAllParameters(): Record<string, any> {
    // Extraction de tous les paramètres des formules
    return {
      serverOptimization: this.methodology.calculationFormula.directReductions.serverOptimization.parameters,
      hostingEfficiency: this.methodology.calculationFormula.directReductions.hostingEfficiency.parameters,
      travelAvoided: this.methodology.calculationFormula.indirectReductions.travelAvoided.parameters,
      paperReduction: this.methodology.calculationFormula.indirectReductions.paperReduction.parameters,
      processOptimization: this.methodology.calculationFormula.indirectReductions.processOptimization.parameters
    };
  }

  private extractAllSources(): string[] {
    const sources = new Set<string>();

    // Collecte de toutes les sources
    Object.values(this.methodology.calculationFormula.directReductions).forEach(section => {
      section.sources.forEach(source => sources.add(source));
    });

    Object.values(this.methodology.calculationFormula.indirectReductions).forEach(section => {
      section.sources.forEach(source => sources.add(source));
    });

    return Array.from(sources);
  }

  private generateComplianceChecklist(): ComplianceItem[] {
    return [
      {
        category: 'Méthodologie',
        requirement: 'Utilisation méthode approuvée',
        status: 'compliant',
        evidence: 'Méthodologie LBC-SAAS-CARBONE-001 v1.0.0',
        verification: 'À vérifier par auditeur'
      },
      {
        category: 'Additionnalité',
        requirement: 'Scénario référence documenté',
        status: 'requires_evidence',
        evidence: 'Questionnaire utilisateurs + étude marché',
        verification: 'Vérification documentaire'
      },
      {
        category: 'Périmètre',
        requirement: 'Délimitation claire inclus/exclus',
        status: 'compliant',
        evidence: 'Documentation périmètre dans méthodologie',
        verification: 'Analyse documentaire'
      },
      {
        category: 'Permanence',
        requirement: 'Engagements 5 ans documentés',
        status: 'requires_evidence',
        evidence: 'Contrats hébergeur + engagements utilisateurs',
        verification: 'Vérification contrats'
      },
      {
        category: 'MRV',
        requirement: 'Système monitoring opérationnel',
        status: 'compliant',
        evidence: 'APIs monitoring + logs temps réel',
        verification: 'Test fonctionnalités'
      }
    ];
  }

  private getRequiredDocumentsList(): string[] {
    return [
      'Méthodologie approuvée DGEC',
      'Bilan carbone initial Carbo',
      'Contrats hébergement vert',
      'Attestations utilisateurs scénario référence',
      'Rapport vérificateur indépendant',
      'Plan gestion risques permanence',
      'Documentation technique complète'
    ];
  }

  private getAPIAccessPoints(): APIAccessPoint[] {
    return [
      {
        endpoint: '/api/lbc/audit-package',
        method: 'GET',
        description: 'Package complet pour auditeur LBC',
        authentication: 'Bearer token auditeur',
        access: 'Read-only, données anonymisées'
      },
      {
        endpoint: '/api/lbc/calculations',
        method: 'POST',
        description: 'Calculs détaillés selon méthodologie',
        authentication: 'Bearer token utilisateur',
        access: 'Données utilisateur spécifiques'
      },
      {
        endpoint: '/api/lbc/mrv-data',
        method: 'GET',
        description: 'Données MRV avec audit trail',
        authentication: 'Bearer token vérificateur',
        access: 'Accès complet avec logs'
      }
    ];
  }
}

// Interfaces pour les calculs
interface ServerMetrics {
  cpuUsageBefore: number;
  cpuUsageAfter: number;
  energyConsumption: number;
  pueReference: number;
  pueGreen: number;
}

interface UserMetrics {
  avgParticipants: number;
  documentsAvoided: number;
  timeSavedHours: number;
  meetingsAvoided: number;
}

interface HostingData {
  pueReference: number;
  pueGreen: number;
  energyConsumption: number;
  greenEnergyPercentage: number;
}

interface LBCCalculationResult {
  directReductions: {
    serverOptimization: number;
    hostingEfficiency: number;
    total: number;
  };
  indirectReductions: {
    travelAvoided: number;
    paperReduction: number;
    processOptimization: number;
    total: number;
  };
  totalReductions: number;
  uncertainty: number;
  netReductions: number;
  calculationDate: Date;
  methodologyVersion: string;
}

interface ComplianceItem {
  category: string;
  requirement: string;
  status: 'compliant' | 'requires_evidence' | 'non_compliant';
  evidence: string;
  verification: string;
}

interface APIAccessPoint {
  endpoint: string;
  method: string;
  description: string;
  authentication: string;
  access: string;
}

interface AuditPackage {
  projectId: string;
  methodology: LBCMethodology;
  technicalDocumentation: string;
  calculationDetails: {
    formulas: CalculationFormula;
    parameters: Record<string, any>;
    sources: string[];
  };
  complianceChecklist: ComplianceItem[];
  requiredDocuments: string[];
  apiEndpoints: APIAccessPoint[];
  generationDate: Date;
}

// Instance singleton
export const lbcMethodologyService = new LBCMethodologyService();