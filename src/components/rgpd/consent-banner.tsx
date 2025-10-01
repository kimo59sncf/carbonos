'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Shield, Cookie, Settings } from 'lucide-react';

interface ConsentBannerProps {
  className?: string;
}

export function ConsentBanner({ className }: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem('carbonos-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('carbonos-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('carbonos-consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm ${className}`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  RGPD Compliant
                </Badge>
              </div>

              <h3 className="font-semibold text-foreground mb-1">
                Gestion des cookies et données personnelles
              </h3>

              <p className="text-sm text-muted-foreground mb-3">
                Nous utilisons des cookies pour améliorer votre expérience et assurer la sécurité de nos services.
                Vos données sont protégées selon les standards RGPD les plus stricts.
              </p>

              <Button
                variant="link"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="h-auto p-0 text-sm"
              >
                <Settings className="mr-1 h-3 w-3" />
                Personnaliser mes choix
              </Button>

              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 space-y-2 text-xs text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Cookie className="h-3 w-3" />
                    <span><strong>Nécessaires :</strong> Sécurité, authentification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cookie className="h-3 w-3" />
                    <span><strong>Analytiques :</strong> Mesure d'audience, performance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cookie className="h-3 w-3" />
                    <span><strong>Marketing :</strong> Communications personnalisées</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAcceptNecessary}
              >
                Nécessaires uniquement
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
              >
                Tout accepter
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute right-2 top-2 h-8 w-8 p-0 lg:relative lg:right-auto lg:top-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}