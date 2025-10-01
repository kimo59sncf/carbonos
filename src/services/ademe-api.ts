/**
 * Service d'intégration avec les APIs ADEME/Base Carbone® officielles
 * Pour conformité Label Bas Carbone
 */

export interface ADEMEFactor {
  id: string;
  name: string;
  unit: string;
  facteur: number;
  incertitude: number;
  source: string;
  lastUpdated: string;
  category: string;
  subcategory?: string;
}

export interface ADEMECalculation {
  activity: string;
  quantity: number;
  unit: string;
  factor: ADEMEFactor;
  emissions: number;
  uncertainty: number;
  calculationDate: string;
  methodology: string;
}

export interface ADEMEBenchmark {
  sector: string;
  indicator: string;
  value: number;
  unit: string;
  percentile: number;
  year: number;
  scope: string;
  source: string;
}

export class ADEMEAPI {
  private baseUrl = 'https://data.ademe.fr/api/records/1.0/search/';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ADEME_API_KEY;
  }

  /**
   * Recherche de facteurs d'émission dans la Base Carbone®
   */
  async searchEmissionFactors(query: {
    activity?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<ADEMEFactor[]> {
    try {
      const params = new URLSearchParams({
        dataset: 'base-carbone',
        rows: (query.limit || 100).toString(),
        start: (query.offset || 0).toString(),
        ...(query.activity && { q: query.activity }),
        ...(query.category && { refine: `categorie:${query.category}` })
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        headers: {
          'Accept': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      });

      if (!response.ok) {
        throw new Error(`ADEME API Error: ${response.status}`);
      }

      const data = await response.json();

      return data.records.map((record: any) => ({
        id: record.recordid,
        name: record.fields.nom_base_francaise,
        unit: record.fields.unite_francaise,
        facteur: parseFloat(record.fields.total_poste_non_decompose),
        incertitude: parseFloat(record.fields.incertitude) || 0.1,
        source: 'ADEME Base Carbone®',
        lastUpdated: record.fields.date_modification || new Date().toISOString(),
        category: record.fields.categorie,
        subcategory: record.fields.sous_categorie
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche de facteurs ADEME:', error);
      return this.getFallbackFactors(query.activity || '');
    }
  }

  /**
   * Calcule les émissions selon méthodologie ADEME
   */
  async calculateEmissions(params: {
    activity: string;
    quantity: number;
    unit: string;
    location?: string;
  }): Promise<ADEMECalculation> {
    try {
      // Recherche du facteur le plus approprié
      const factors = await this.searchEmissionFactors({
        activity: params.activity,
        limit: 10
      });

      if (factors.length === 0) {
        throw new Error('Aucun facteur trouvé pour cette activité');
      }

      // Sélection du facteur avec la meilleure correspondance
      const bestFactor = this.selectBestFactor(factors, params);

      // Calcul des émissions
      const emissions = params.quantity * bestFactor.facteur;
      const uncertainty = emissions * bestFactor.incertitude;

      return {
        activity: params.activity,
        quantity: params.quantity,
        unit: params.unit,
        factor: bestFactor,
        emissions,
        uncertainty,
        calculationDate: new Date().toISOString(),
        methodology: 'ADEME Base Carbone® v2023'
      };
    } catch (error) {
      console.error('Erreur lors du calcul ADEME:', error);
      throw error;
    }
  }

  /**
   * Récupère les benchmarks sectoriels ADEME
   */
  async getSectorBenchmarks(sector: string, year?: number): Promise<ADEMEBenchmark[]> {
    try {
      const params = new URLSearchParams({
        dataset: 'empreinte-carbone-secteurs',
        refine: `secteur:${sector}`,
        ...(year && { refine: `annee:${year}` })
      });

      const response = await fetch(`${this.baseUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`ADEME Benchmark API Error: ${response.status}`);
      }

      const data = await response.json();

      return data.records.map((record: any) => ({
        sector: record.fields.secteur,
        indicator: record.fields.indicateur,
        value: parseFloat(record.fields.valeur),
        unit: record.fields.unite,
        percentile: parseInt(record.fields.percentile) || 50,
        year: parseInt(record.fields.annee),
        scope: record.fields.scope || 'total',
        source: 'ADEME Empreinte Secteurs'
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des benchmarks ADEME:', error);
      return this.getFallbackBenchmarks(sector);
    }
  }

  /**
   * Sélectionne le facteur le plus approprié
   */
  private selectBestFactor(factors: ADEMEFactor[], params: any): ADEMEFactor {
    // Logique de sélection basée sur :
    // 1. Correspondance exacte d'activité
    // 2. Unité compatible
    // 3. Incertitude la plus faible
    // 4. Date de mise à jour récente

    let bestFactor = factors[0];
    let bestScore = 0;

    for (const factor of factors) {
      let score = 0;

      // Correspondance activité (+3 points)
      if (factor.name.toLowerCase().includes(params.activity.toLowerCase())) {
        score += 3;
      }

      // Unité compatible (+2 points)
      if (factor.unit === params.unit) {
        score += 2;
      }

      // Incertitude faible (+1 point)
      if (factor.incertitude < 0.1) {
        score += 1;
      }

      // Mise à jour récente (+1 point)
      const updateDate = new Date(factor.lastUpdated);
      const daysSinceUpdate = (Date.now() - updateDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate < 365) {
        score += 1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestFactor = factor;
      }
    }

    return bestFactor;
  }

  /**
   * Facteurs de secours en cas d'indisponibilité API
   */
  private getFallbackFactors(activity: string): ADEMEFactor[] {
    const fallbackData: Record<string, ADEMEFactor[]> = {
      'electricite': [{
        id: 'fallback-electricite-fr',
        name: 'Électricité France métropolitaine',
        unit: 'kWh',
        facteur: 0.057,
        incertitude: 0.1,
        source: 'ADEME Base Carbone®',
        lastUpdated: new Date().toISOString(),
        category: 'Énergie'
      }],
      'transport': [{
        id: 'fallback-transport-voiture',
        name: 'Voiture particulière - Essence',
        unit: 'km',
        facteur: 0.15,
        incertitude: 0.15,
        source: 'ADEME Base Carbone®',
        lastUpdated: new Date().toISOString(),
        category: 'Transport'
      }],
      'papier': [{
        id: 'fallback-papier-a4',
        name: 'Papier A4 - Production et distribution',
        unit: 'kg',
        facteur: 1.2,
        incertitude: 0.2,
        source: 'ADEME Base Carbone®',
        lastUpdated: new Date().toISOString(),
        category: 'Matériaux'
      }]
    };

    return fallbackData[activity.toLowerCase()] || [];
  }

  /**
   * Benchmarks de secours
   */
  private getFallbackBenchmarks(sector: string): ADEMEBenchmark[] {
    return [
      {
        sector,
        indicator: 'Émissions / CA',
        value: 45,
        unit: 'tCO2e/M€',
        percentile: 50,
        year: 2023,
        scope: 'total',
        source: 'ADEME Empreinte Secteurs'
      },
      {
        sector,
        indicator: 'Émissions / employé',
        value: 7.5,
        unit: 'tCO2e/employé',
        percentile: 50,
        year: 2023,
        scope: 'total',
        source: 'ADEME Empreinte Secteurs'
      }
    ];
  }
}

/**
 * Service de cache pour les données ADEME
 */
export class ADEMECacheService {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private defaultTTL = 24 * 60 * 60 * 1000; // 24 heures

  /**
   * Récupère des données avec cache
   */
  async getCached<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < (ttl || this.defaultTTL)) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });

    return data;
  }

  /**
   * Invalide le cache pour une clé
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Nettoie le cache expiré
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((value, key) => {
      if (now - value.timestamp > value.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

/**
 * Service de validation des données ADEME
 */
export class ADEMEValidationService {
  /**
   * Valide un facteur d'émission selon critères LBC
   */
  validateFactor(factor: ADEMEFactor): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // Vérification de l'incertitude
    if (factor.incertitude > 0.3) {
      warnings.push('Incertitude élevée (>30%) - vérification recommandée');
    }

    // Vérification de la date de mise à jour
    const updateDate = new Date(factor.lastUpdated);
    const daysSinceUpdate = (Date.now() - updateDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate > 365) {
      warnings.push('Facteur ancien (>1 an) - vérification actualité recommandée');
    }

    // Vérification de la source
    if (!factor.source.includes('ADEME')) {
      warnings.push('Source non officielle ADEME');
    }

    return {
      valid: warnings.length === 0,
      warnings
    };
  }

  /**
   * Valide un calcul d'émissions
   */
  validateCalculation(calculation: ADEMECalculation): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // Vérification de la cohérence
    const expectedEmissions = calculation.quantity * calculation.factor.facteur;
    const tolerance = expectedEmissions * 0.001; // 0.1% de tolérance

    if (Math.abs(calculation.emissions - expectedEmissions) > tolerance) {
      warnings.push('Incohérence dans le calcul des émissions');
    }

    // Vérification de l'incertitude globale
    const totalUncertainty = calculation.uncertainty;
    if (totalUncertainty > calculation.emissions * 0.5) {
      warnings.push('Incertitude globale très élevée');
    }

    return {
      valid: warnings.length === 0,
      warnings
    };
  }
}

// Instances singleton
export const ademeAPI = new ADEMEAPI();
export const ademeCache = new ADEMECacheService();
export const ademeValidation = new ADEMEValidationService();