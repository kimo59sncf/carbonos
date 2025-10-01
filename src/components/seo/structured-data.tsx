import { generateStructuredData } from '@/lib/seo';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'Article';
  data?: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = generateStructuredData(type, data);

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Composant spécifique pour les données organisationnelles
export function OrganizationStructuredData() {
  return (
    <StructuredData
      type="Organization"
      data={{
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'FR',
          addressLocality: 'Paris',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'contact@carbonos.fr',
          telephone: '+33-1-XX-XX-XX-XX',
        },
        knowsAbout: [
          'Gestion des émissions de carbone',
          'Bilan carbone',
          'CSRD',
          'BEGES',
          'Scope 1, 2, 3',
          'Reporting environnemental',
          'Conformité RGPD',
        ],
        areaServed: 'FR',
        serviceType: 'Logiciel SaaS',
      }}
    />
  );
}

// Composant spécifique pour le site web
export function WebSiteStructuredData() {
  return (
    <StructuredData
      type="WebSite"
      data={{
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}