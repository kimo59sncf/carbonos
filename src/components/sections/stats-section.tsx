'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, Leaf } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '1000+',
    label: 'Entreprises utilisatrices',
    description: 'De la PME au grand groupe',
  },
  {
    icon: TrendingUp,
    value: '35%',
    label: 'Réduction moyenne',
    description: 'Des émissions après 1 an',
  },
  {
    icon: Award,
    value: '100%',
    label: 'Conformité RGPD',
    description: 'Données sécurisées',
  },
  {
    icon: Leaf,
    value: '2M+',
    label: 'Tonnes CO₂ économisées',
    description: 'Grâce à nos utilisateurs',
  },
];

export function StatsSection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Impact mesuré, résultats prouvés
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Rejoignez une communauté d'entreprises engagées dans la transition écologique
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/10 backdrop-blur-sm">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold sm:text-4xl">{stat.value}</div>
                <div className="mt-2 text-lg font-semibold">{stat.label}</div>
                <div className="mt-1 text-sm opacity-80">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}