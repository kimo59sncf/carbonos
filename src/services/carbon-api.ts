/**
 * Service d'intégration avec les APIs carbone externes
 */

export interface CarbonFactor {
  id: string;
  name: string;
  category: string;
  unit: string;
  factor: number;
  source: string;
  lastUpdated: string;
}

export interface EmissionCalculation {
  activity: string;
  quantity: number;
  unit: string;
  factor: number;
  emissions: number;
  uncertainty: number;
}

export interface BenchmarkData {
  sector: string;
  indicator: string;
  value: number;
  unit: string;
  percentile: number;
  year: number;
  source: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  location: string;
  timestamp: string;
}

/**
 * Base Carbone® API Integration
 * https://www.bilans-ges.ademe.fr/
 */
export class CarbonAPI {
  private baseUrl = 'https://api.carbone.fr';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.BASE_CARBONE_API_KEY || '';
  }

  /**
   * Récupère les facteurs d'émission pour une activité donnée
   */
  async getEmissionFactors(
    activity: string,
    category?: string
  ): Promise<CarbonFactor[]> {
    try {
      const params = new URLSearchParams({
        activity,
        ...(category && { category }),
      });

      const response = await fetch(`${this.baseUrl}/factors?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des facteurs d\'émission:', error);
      return this.getFallbackFactors(activity);
    }
  }

  /**
   * Calcule les émissions pour une activité donnée
   */
  async calculateEmissions(
    activity: string,
    quantity: number,
    unit: string,
    location?: string
  ): Promise<EmissionCalculation> {
    try {
      const factors = await this.getEmissionFactors(activity);

      if (factors.length === 0) {
        throw new Error('Aucun facteur trouvé pour cette activité');
      }

      // Sélection du facteur le plus approprié
      const factor = factors[0];

      // Ajustement selon la localisation si nécessaire
      let adjustedFactor = factor.factor;
      if (location) {
        adjustedFactor = await this.adjustFactorForLocation(factor, location);
      }

      const emissions = quantity * adjustedFactor;
      const uncertainty = emissions * 0.1; // 10% d'incertitude par défaut

      return {
        activity,
        quantity,
        unit,
        factor: adjustedFactor,
        emissions,
        uncertainty,
      };
    } catch (error) {
      console.error('Erreur lors du calcul des émissions:', error);
      throw error;
    }
  }

  /**
   * Récupère les benchmarks sectoriels
   */
  async getSectorBenchmarks(sector: string): Promise<BenchmarkData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/benchmarks/${sector}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des benchmarks:', error);
      return this.getFallbackBenchmarks(sector);
    }
  }

  /**
   * Facteurs de secours en cas d'indisponibilité de l'API
   */
  private getFallbackFactors(activity: string): CarbonFactor[] {
    const fallbackData: Record<string, CarbonFactor[]> = {
      'electricity': [
        {
          id: 'fallback-electricity-fr',
          name: 'Électricité France',
          category: 'Énergie',
          unit: 'kWh',
          factor: 0.057, // kgCO2e/kWh (moyenne France 2023)
          source: 'RTE/ADEME',
          lastUpdated: new Date().toISOString(),
        },
      ],
      'transport': [
        {
          id: 'fallback-transport-car',
          name: 'Voiture thermique',
          category: 'Transport',
          unit: 'km',
          factor: 0.15, // kgCO2e/km
          source: 'Base Carbone',
          lastUpdated: new Date().toISOString(),
        },
      ],
      'heating': [
        {
          id: 'fallback-heating-gas',
          name: 'Chauffage gaz naturel',
          category: 'Énergie',
          unit: 'kWh',
          factor: 0.184, // kgCO2e/kWh
          source: 'ADEME',
          lastUpdated: new Date().toISOString(),
        },
      ],
    };

    return fallbackData[activity.toLowerCase()] || [];
  }

  /**
   * Benchmarks de secours
   */
  private getFallbackBenchmarks(sector: string): BenchmarkData[] {
    return [
      {
        sector,
        indicator: 'Émissions / CA',
        value: 45,
        unit: 'tCO2e/M€',
        percentile: 50,
        year: 2023,
        source: 'ADEME',
      },
      {
        sector,
        indicator: 'Émissions / employé',
        value: 7.5,
        unit: 'tCO2e/employé',
        percentile: 50,
        year: 2023,
        source: 'ADEME',
      },
    ];
  }

  /**
   * Ajuste le facteur selon la localisation
   */
  private async adjustFactorForLocation(factor: CarbonFactor, location: string): Promise<number> {
    // Logique d'ajustement géographique
    // Pour l'instant, retourne le facteur de base
    // À implémenter avec de vraies données géographiques
    return factor.factor;
  }
}

/**
 * Service météo pour calculs précis
 */
export class WeatherAPI {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.METEO_API_KEY || '';
  }

  async getCurrentWeather(location: string): Promise<WeatherData> {
    try {
      // Intégration avec une API météo (OpenWeatherMap, Météo France, etc.)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API Error: ${response.status}`);
      }

      const data = await response.json();

      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        location,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données météo:', error);
      // Retourne des valeurs par défaut
      return {
        temperature: 15,
        humidity: 65,
        location,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

/**
 * Service de benchmarks européens
 */
export class EuropeanBenchmarkAPI {
  async getEuropeanBenchmarks(sector: string, country: string = 'FR'): Promise<BenchmarkData[]> {
    try {
      // Intégration avec bases de données européennes (Eurostat, EEA, etc.)
      const response = await fetch(`/api/benchmarks/european?sector=${sector}&country=${country}`);

      if (!response.ok) {
        throw new Error(`European API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des benchmarks européens:', error);
      return [];
    }
  }
}

// Instances singleton
export const carbonAPI = new CarbonAPI();
export const weatherAPI = new WeatherAPI();
export const europeanBenchmarkAPI = new EuropeanBenchmarkAPI();