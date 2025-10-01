import { Metadata } from 'next';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { StatsSection } from '@/components/sections/stats-section';
import { CTASection } from '@/components/sections/cta-section';

export const metadata: Metadata = {
  title: 'Accueil',
  description: 'CarbonOS révolutionne la gestion des émissions carbone avec des outils avancés d\'analyse, de reporting et de conformité réglementaire.',
  openGraph: {
    title: 'CarbonOS - Plateforme de Gestion Carbone Intelligente',
    description: 'Révolutionnez la gestion de vos émissions carbone avec notre plateforme avancée d\'analyse et de reporting.',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'CarbonOS - Accueil',
      },
    ],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}