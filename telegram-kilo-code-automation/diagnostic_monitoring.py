#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de diagnostic pour le monitoring IA Kilo Code
Aide à calibrer les coordonnées et tester l'extraction de texte
"""

import os
import sys
import time
import json
import pyautogui
import pyperclip
from dotenv import load_dotenv

# Charger la configuration
load_dotenv()

# Configuration du monitoring
KILO_CODE_RESPONSE_X = int(os.getenv('KILO_CODE_RESPONSE_X', 600))
KILO_CODE_RESPONSE_Y = int(os.getenv('KILO_CODE_RESPONSE_Y', 700))
KILO_CODE_COPY_SHORTCUT = os.getenv('KILO_CODE_COPY_SHORTCUT', 'ctrl+a,ctrl+c')

def diagnostic_coordonnees():
    """Diagnostique les coordonnées de la zone de réponse IA"""
    print("Diagnostic des Coordonnées")
    print("=" * 50)

    print(f"Coordonnées actuelles : X={KILO_CODE_RESPONSE_X}, Y={KILO_CODE_RESPONSE_Y}")
    print(f"Raccourci copie : {KILO_CODE_COPY_SHORTCUT}")
    print()

    print("Pour calibrer correctement :")
    print("1. Ouvrez VSCode avec l'extension Kilo Code active")
    print("2. Assurez-vous qu'une réponse de l'IA est visible")
    print("3. Placez votre souris sur le DEBUT de la zone de réponse IA")
    print("4. Appuyez sur Entrée pour capturer les coordonnées...")

    print("Pour capturer automatiquement, placez votre souris et attendez 5 secondes...")
    for i in range(5, 0, -1):
        print(f"Capture dans {i} secondes...")
        time.sleep(1)

    try:
        x, y = pyautogui.position()
        print(f"Coordonnées capturées : X={x}, Y={y}")

        print("\nMettez à jour votre .env avec :")
        print(f"KILO_CODE_RESPONSE_X={x}")
        print(f"KILO_CODE_RESPONSE_Y={y}")

        return x, y

    except Exception as e:
        print(f"Erreur lors de la capture : {str(e)}")
        print("Utilisez cette commande manuellement :")
        print("python -c \"import pyautogui; print(pyautogui.position())\"")
        return None, None

def test_extraction_texte(x=None, y=None):
    """Teste l'extraction de texte depuis les coordonnées"""
    print("\nTest d'Extraction de Texte")
    print("=" * 50)

    if x is None or y is None:
        x, y = KILO_CODE_RESPONSE_X, KILO_CODE_RESPONSE_Y

    print(f"Test avec les coordonnées : X={x}, Y={y}")
    print("Assurez-vous que VSCode est actif et visible...")
    try:
        # Cliquer sur la zone
        pyautogui.click(x, y)
        time.sleep(1)

        # Essayer de copier le texte
        keys = KILO_CODE_COPY_SHORTCUT.split(',')
        for key_combo in keys:
            key_combo = key_combo.strip()
            if '+' in key_combo:
                pyautogui.hotkey(*key_combo.split('+'))
            else:
                pyautogui.press(key_combo)
            time.sleep(0.5)

        # Récupérer le texte du presse-papiers
        texte_extrait = pyperclip.paste().strip()

        if texte_extrait:
            print(f"Texte extrait avec succès ({len(texte_extrait)} caractères) :")
            print("-" * 30)
            print(texte_extrait[:200] + "..." if len(texte_extrait) > 200 else texte_extrait)
            print("-" * 30)

            return texte_extrait
        else:
            print("Aucun texte extrait. Vérifiez :")
            print("   - Que VSCode est actif")
            print("   - Que la zone contient du texte")
            print("   - Que les raccourcis clavier fonctionnent")
            return None

    except Exception as e:
        print(f"Erreur lors de l'extraction : {str(e)}")
        return None

def generer_configuration(x, y):
    """Génère la configuration recommandée"""
    print("\nConfiguration Recommandée")
    print("=" * 50)

    config = f"""
# Configuration du monitoring IA (à ajouter dans .env)
MONITORING_ENABLED=true
MONITORING_INTERVAL=3
KILO_CODE_RESPONSE_X={x}
KILO_CODE_RESPONSE_Y={y}
KILO_CODE_COPY_SHORTCUT=ctrl+a,ctrl+c

# Test rapide :
# 1. Ajoutez ces lignes à votre .env
# 2. Redémarrez le bot
# 3. Testez avec /test_monitoring
"""

    print(config)

    # Sauvegarder la configuration
    try:
        with open('.env.diagnostic', 'w', encoding='utf-8') as f:
            f.write(config.strip())
        print("Configuration sauvegardée dans .env.diagnostic")
    except:
        pass

def main():
    """Fonction principale de diagnostic"""
    print("Diagnostic du Monitoring IA Kilo Code")
    print("=" * 60)
    print()

    # Étape 1 : Calibration des coordonnées
    x, y = diagnostic_coordonnees()

    if x is not None and y is not None:
        # Étape 2 : Test d'extraction
        texte = test_extraction_texte(x, y)

        if texte:
            # Étape 3 : Générer configuration
            generer_configuration(x, y)

            print("\nDiagnostic terminé avec succès !")
            print("Prochaines étapes :")
            print("1. Mettez à jour votre .env avec les nouvelles coordonnées")
            print("2. Redémarrez le bot Telegram")
            print("3. Testez avec /test_monitoring")
        else:
            print("\nÉchec de l'extraction de texte")
            print("Vérifiez manuellement les raccourcis clavier")
    else:
        print("\nÉchec de la calibration des coordonnées")

if __name__ == '__main__':
    main()