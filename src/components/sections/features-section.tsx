'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Shield,
  Zap,
  Users,
  FileText,
  Bell,
  Smartphone,
  Globe,
  Scale,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Scale,
    title: 'Conformité CSRD',
    description: 'Reporting complet selon la directive européenne CSRD avec templates pré-remplis et suivi des obligations.',
  },
  {
    icon: Shield,
    title: 'Sécurité RGPD',
    description: 'Protection complète des données personnelles avec chiffrement de bout en bout et audit trail détaillé.',
  },
  {
    icon: BarChart3,
    title: 'Analyses avancées',
    description: 'Tableaux de bord prédictifs avec IA et visualisations interactives pour une meilleure compréhension de vos données.',
  },
  {
    icon: Zap,
    title: 'Temps réel',
    description: 'Mise à jour instantanée des données avec notifications push et alertes intelligentes.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Espaces de travail partagés avec workflows d\'approbation et commentaires intégrés.',
  },
  {
    icon: FileText,
    title: 'Reporting CSRD complet',
    description: 'Génération automatisée de rapports CSRD, BEGES et autres standards avec templates personnalisables et validation réglementaire.',
  },
  {
    icon: Bell,
    title: 'Alertes intelligentes',
    description: 'Notifications proactives sur les échéances réglementaires et seuils d\'émission.',
  },
  {
    icon: Smartphone,
    title: 'Application mobile',
    description: 'Accès complet depuis votre smartphone avec mode hors ligne et synchronisation automatique.',
  },
  {
    icon: Globe,
    title: 'APIs externes',
    description: 'Intégration avec Base Carbone®, données météo et benchmarks sectoriels européens.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Fonctionnalités avancées pour une gestion carbone optimale
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Découvrez comment CarbonOS révolutionne votre approche de la gestion environnementale
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="flex h-full flex-col rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border transition-all duration-200 hover:shadow-lg hover:ring-primary/20">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}