'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Shield, Zap, Users, FileCheck, Scale, BarChart3, FileText } from 'lucide-react';

export function HeroSection() {
  const [showDemo, setShowDemo] = useState(false);
  const [showAppPreview, setShowAppPreview] = useState(false);
  const router = useRouter();

  const handleStartNow = () => {
    // Rediriger vers la page d'inscription ou de connexion
    router.push('/auth');
  };

  const handleShowDemo = () => {
    setShowDemo(true);
  };

  const handleDiscoverApp = () => {
    setShowAppPreview(true);
  };
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />

      <div className="relative container mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              <Zap className="mr-2 h-4 w-4" />
              Nouvelle génération de plateforme carbone
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            Révolutionnez votre{' '}
            <span className="text-gradient">gestion carbone</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 text-lg text-muted-foreground sm:text-xl"
          >
            CarbonOS vous accompagne dans votre transition écologique avec des outils avancés
            d'analyse, de reporting et de <strong className="text-foreground">conformité CSRD</strong>.
            Solution complète <strong className="text-foreground">RGPD-ready</strong> pour entreprises responsables
            et réglementairement conformes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="lg" className="group" onClick={handleStartNow}>
              Commencer maintenant
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="group" onClick={handleShowDemo}>
              <Play className="mr-2 h-4 w-4" />
              Voir la démo
            </Button>
            <Button variant="secondary" size="lg" className="group" onClick={handleDiscoverApp}>
              Découvrir l'application
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-700 dark:text-green-400">CSRD Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-700 dark:text-blue-400">RGPD Sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span>+1000 entreprises</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Temps réel</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal de démonstration */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-4 max-w-md rounded-2xl bg-background p-8 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Démo CarbonOS</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDemo(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
            <p className="mb-6 text-muted-foreground">
              Découvrez les fonctionnalités avancées de CarbonOS pour la gestion de vos émissions carbone,
              la conformité CSRD et la protection RGPD de vos données.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => {
                setShowDemo(false);
                router.push('/dashboard');
              }} className="flex-1">
                Découvrir la plateforme
              </Button>
              <Button variant="outline" onClick={() => setShowDemo(false)}>
                Plus tard
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de découverte de l'application */}
      {showAppPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-4 max-w-2xl rounded-2xl bg-background p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-semibold">CarbonOS - Fonctionnalités</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAppPreview(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Analyses avancées</h4>
                    <p className="text-sm text-muted-foreground">IA prédictive et visualisations</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Conformité RGPD</h4>
                    <p className="text-sm text-muted-foreground">Protection complète des données</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Scale className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">CSRD Compliant</h4>
                    <p className="text-sm text-muted-foreground">Reporting réglementaire</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Temps réel</h4>
                    <p className="text-sm text-muted-foreground">Mise à jour instantanée</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Reporting automatique</h4>
                    <p className="text-sm text-muted-foreground">CSRD, BEGES, standards</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Collaboration</h4>
                    <p className="text-sm text-muted-foreground">Espaces partagés</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => {
                setShowAppPreview(false);
                router.push('/auth');
              }} className="flex-1">
                Commencer maintenant
              </Button>
              <Button variant="outline" onClick={() => setShowAppPreview(false)}>
                Fermer
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}