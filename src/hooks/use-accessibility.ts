'use client';

import { useState, useEffect, useCallback } from 'react';

interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  focusVisible: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
}

const defaultSettings: AccessibilitySettings = {
  reduceMotion: false,
  highContrast: false,
  largeText: false,
  focusVisible: true,
  screenReaderOptimized: false,
  keyboardNavigation: true,
};

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Chargement des paramètres depuis localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('carbonos-accessibility');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres d\'accessibilité:', error);
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarde des paramètres
  const updateSettings = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      localStorage.setItem('carbonos-accessibility', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres d\'accessibilité:', error);
    }

    // Application immédiate des paramètres
    applyAccessibilitySettings(updatedSettings);
  }, [settings]);

  // Application des paramètres d'accessibilité
  const applyAccessibilitySettings = useCallback((accessibilitySettings: AccessibilitySettings) => {
    const root = document.documentElement;

    // Réduction des animations
    if (accessibilitySettings.reduceMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--animation-duration');
      root.classList.remove('reduce-motion');
    }

    // Haut contraste
    if (accessibilitySettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Texte agrandi
    if (accessibilitySettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Focus visible
    if (accessibilitySettings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    // Optimisation lecteur d'écran
    if (accessibilitySettings.screenReaderOptimized) {
      root.setAttribute('aria-live', 'polite');
      root.classList.add('screen-reader-optimized');
    } else {
      root.removeAttribute('aria-live');
      root.classList.remove('screen-reader-optimized');
    }
  }, []);

  // Application initiale des paramètres
  useEffect(() => {
    if (isLoaded) {
      applyAccessibilitySettings(settings);
    }
  }, [isLoaded, settings, applyAccessibilitySettings]);

  // Gestionnaire de clavier pour navigation
  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Échap pour fermer les modales
      if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
        openModals.forEach(modal => {
          const closeButton = modal.querySelector('[aria-label="Fermer"], [data-close-modal]') as HTMLElement;
          closeButton?.click();
        });
      }

      // Alt + 1-9 pour navigation rapide
      if (event.altKey && /^[1-9]$/.test(event.key)) {
        const shortcuts = document.querySelectorAll('[data-shortcut]');
        const target = Array.from(shortcuts).find(el =>
          el.getAttribute('data-shortcut') === event.key
        ) as HTMLElement;

        if (target) {
          event.preventDefault();
          target.focus();
          target.click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation]);

  // Annonce pour les screen readers
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.screenReaderOptimized) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [settings.screenReaderOptimized]);

  // Gestion du focus trap pour les modales
  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);

    // Focus initial
    firstFocusable?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  return {
    settings,
    updateSettings,
    announceToScreenReader,
    trapFocus,
    isLoaded,
  };
}