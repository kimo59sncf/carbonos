import { Metadata } from 'next';

export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    locale?: string;
    siteName?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    title?: string;
    description?: string;
    image?: string;
    creator?: string;
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    nocache?: boolean;
  };
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
    media?: Record<string, string>;
    types?: Record<string, string>;
  };
  verification?: {
    google?: string;
    yandex?: string;
    yahoo?: string;
    bing?: string;
  };
  category?: string;
  classification?: string;
  rating?: string;
  referrer?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
  formatDetection?: {
    email?: boolean;
    address?: boolean;
    telephone?: boolean;
  };
}

export interface CarbonData {
  companyName?: string;
  sector?: string;
  totalEmissions?: number;
  scope1?: number;
  scope2?: number;
  scope3?: number;
  year?: number;
  reduction?: number;
  target?: number;
}

/**
 * Génère les métadonnées SEO de base pour CarbonOS
 */
export function generateBaseMetadata(overrides: Partial<SEOMetadata> = {}): SEOMetadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    title: 'CarbonOS - Plateforme de Gestion Carbone Intelligente',
    description: 'CarbonOS révolutionne la gestion des émissions carbone avec des outils avancés d\'analyse, de reporting et de conformité réglementaire. Solution complète pour entreprises responsables.',
    keywords: [
      'gestion carbone',
      'émissions CO2',
      'bilan carbone',
      'CSRD',
      'BEGES',
      'scope 1',
      'scope 2',
      'scope 3',
      'reporting carbone',
      'développement durable',
      'entreprise responsable',
      'empreinte écologique',
      'réduction émissions',
      'conformité environnementale',
      'analyse carbone',
      'suivi émissions',
      'plateforme carbone',
      'logiciel bilan carbone',
      'outil RSE',
      'sustainability',
      'carbon footprint',
      'GHG emissions',
      'carbon management',
      'environmental compliance',
    ],
    canonical: baseUrl,
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: baseUrl,
      title: 'CarbonOS - Plateforme de Gestion Carbone Intelligente',
      description: 'Révolutionnez la gestion de vos émissions carbone avec notre plateforme avancée d\'analyse et de reporting.',
      siteName: 'CarbonOS',
      image: `${baseUrl}/og-image.jpg`,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CarbonOS - Plateforme de Gestion Carbone Intelligente',
      description: 'Révolutionnez la gestion de vos émissions carbone avec notre plateforme avancée d\'analyse et de reporting.',
      image: `${baseUrl}/og-image.jpg`,
      creator: '@carbonos',
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    ...overrides,
  };
}

/**
 * Génère les métadonnées pour une page entreprise
 */
export function generateCompanyMetadata(companyName: string, data?: CarbonData): SEOMetadata {
  const title = `${companyName} - Bilan Carbone | CarbonOS`;
  const description = `Découvrez le bilan carbone de ${companyName}${data?.sector ? ` dans le secteur ${data.sector}` : ''}. ${data?.totalEmissions ? `Émissions totales : ${data.totalEmissions} tCO₂e` : ''}`;

  return generateBaseMetadata({
    title,
    description,
    keywords: [
      companyName.toLowerCase(),
      'bilan carbone entreprise',
      'émissions CO2 entreprise',
      'reporting carbone',
      ...(data?.sector ? [data.sector.toLowerCase()] : []),
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      image: `/og-company-${companyName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    },
    twitter: {
      title,
      description,
    },
  });
}

/**
 * Génère les métadonnées pour une page de reporting
 */
export function generateReportMetadata(year: number, companyName?: string, data?: CarbonData): SEOMetadata {
  const title = `Rapport Carbone ${year}${companyName ? ` - ${companyName}` : ''} | CarbonOS`;
  const description = `Rapport détaillé des émissions carbone pour l'année ${year}${data?.totalEmissions ? `. Total : ${data.totalEmissions} tCO₂e` : ''}${data?.reduction ? `. Réduction : ${data.reduction}%` : ''}`;

  return generateBaseMetadata({
    title,
    description,
    keywords: [
      `rapport carbone ${year}`,
      'émissions CO2',
      'bilan GES',
      'CSRD',
      'BEGES',
      'reporting environnemental',
      ...(companyName ? [companyName.toLowerCase()] : []),
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      image: `/og-report-${year}.jpg`,
    },
  });
}

/**
 * Génère les métadonnées pour une page sectorielle
 */
export function generateSectorMetadata(sector: string, averageEmissions?: number): SEOMetadata {
  const title = `Secteur ${sector} - Benchmarks Carbone | CarbonOS`;
  const description = `Découvrez les benchmarks carbone du secteur ${sector}${averageEmissions ? `. Émissions moyennes : ${averageEmissions} tCO₂e` : ''}. Comparez votre performance environnementale.`;

  return generateBaseMetadata({
    title,
    description,
    keywords: [
      sector.toLowerCase(),
      'benchmark carbone',
      'secteur industriel',
      'émissions sectorielles',
      'comparaison carbone',
      'performance environnementale',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      image: `/og-sector-${sector.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    },
  });
}

/**
 * Génère les métadonnées pour les données structurées JSON-LD
 */
export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Article', data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  switch (type) {
    case 'Organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'CarbonOS',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: 'Plateforme moderne de gestion des émissions carbone',
        foundingDate: '2024',
        sameAs: [
          'https://twitter.com/carbonos',
          'https://linkedin.com/company/carbonos',
        ],
        ...data,
      };

    case 'WebSite':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'CarbonOS',
        url: baseUrl,
        description: 'Plateforme de gestion carbone intelligente',
        inLanguage: 'fr-FR',
        ...data,
      };

    case 'Article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image ? `${baseUrl}${data.image}` : `${baseUrl}/og-article.jpg`,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        author: {
          '@type': 'Organization',
          name: 'CarbonOS',
        },
        publisher: {
          '@type': 'Organization',
          name: 'CarbonOS',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
          },
        },
        ...data,
      };

    default:
      return null;
  }
}

/**
 * Génère le sitemap XML
 */
export function generateSitemapXML(urls: Array<{ url: string; lastModified?: Date; priority?: number; changefreq?: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, lastModified, priority = 0.8, changefreq = 'monthly' }) => `  <url>
    <loc>${baseUrl}${url}</loc>
    ${lastModified ? `<lastmod>${lastModified.toISOString()}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

/**
 * Génère le fichier robots.txt
 */
export function generateRobotsTXT() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Pages à ne pas indexer (si nécessaire)
# Disallow: /admin/
# Disallow: /api/

# Crawl-delay pour les bots
Crawl-delay: 1`;
}

/**
 * Utilitaire pour nettoyer les métadonnées avant génération
 */
export function sanitizeMetadata(metadata: SEOMetadata): Metadata {
  const sanitized: Metadata = {};

  if (metadata.title) sanitized.title = metadata.title;
  if (metadata.description) sanitized.description = metadata.description;
  if (metadata.keywords) sanitized.keywords = metadata.keywords;

  if (metadata.canonical) {
    sanitized.alternates = { canonical: metadata.canonical };
  }

  if (metadata.openGraph) {
    sanitized.openGraph = metadata.openGraph;
  }

  if (metadata.twitter) {
    sanitized.twitter = metadata.twitter;
  }

  if (metadata.robots) {
    sanitized.robots = metadata.robots;
  }

  if (metadata.verification) {
    sanitized.verification = metadata.verification;
  }

  if (metadata.category) sanitized.category = metadata.category;
  if (metadata.classification) sanitized.classification = metadata.classification;

  if (metadata.formatDetection) {
    sanitized.formatDetection = metadata.formatDetection;
  }

  return sanitized;
}