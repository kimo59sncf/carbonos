#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test simple du monitoring IA - Étape par étape
"""

import os
import time
import pyautogui
import pyperclip
from dotenv import load_dotenv

# Charger la configuration
load_dotenv()

# Configuration du monitoring
KILO_CODE_RESPONSE_X = int(os.getenv('KILO_CODE_RESPONSE_X', 600))
KILO_CODE_RESPONSE_Y = int(os.getenv('KILO_CODE_RESPONSE_Y', 700))
KILO_CODE_COPY_SHORTCUT = os.getenv('KILO_CODE_COPY_SHORTCUT', 'ctrl+a,ctrl+c')

def test_etape_par_etape():
    """Test étape par étape du monitoring"""
    print("Test du Monitoring IA - Étape par Étape")
    print("=" * 50)

    print("Étape 1 : Vérification VSCode actif")
    print("- Assurez-vous que VSCode est ouvert et visible")
    print("- Appuyez sur Entrée pour continuer...")
    input()

    print("Étape 2 : Test du clic sur la zone de réponse")
    print(f"- Clic sur les coordonnées : X={KILO_CODE_RESPONSE_X}, Y={KILO_CODE_RESPONSE_Y}")

    try:
        pyautogui.click(KILO_CODE_RESPONSE_X, KILO_CODE_RESPONSE_Y)
        print("✓ Clic effectué")
    except Exception as e:
        print(f"✗ Erreur clic : {e}")
        return

    time.sleep(1)

    print("Étape 3 : Test des raccourcis clavier")
    print(f"- Utilisation du raccourci : {KILO_CODE_COPY_SHORTCUT}")

    try:
        keys = KILO_CODE_COPY_SHORTCUT.split(',')
        for key_combo in keys:
            key_combo = key_combo.strip()
            print(f"- Appui sur : {key_combo}")
            if '+' in key_combo:
                pyautogui.hotkey(*key_combo.split('+'))
            else:
                pyautogui.press(key_combo)
            time.sleep(0.5)
        print("✓ Raccourcis exécutés")
    except Exception as e:
        print(f"✗ Erreur raccourcis : {e}")
        return

    print("Étape 4 : Récupération du texte depuis le presse-papiers")
    time.sleep(1)

    try:
        texte = pyperclip.paste().strip()
        print(f"✓ Texte récupéré : {len(texte)} caractères")

        if texte:
            print("Aperçu du texte :")
            print("-" * 30)
            print(texte[:300] + "..." if len(texte) > 300 else texte)
            print("-" * 30)
        else:
            print("✗ Aucun texte récupéré")

    except Exception as e:
        print(f"✗ Erreur récupération texte : {e}")

    print("\nTest terminé !")
    print("Si vous voyez du texte, le système d'extraction fonctionne.")

if __name__ == '__main__':
    test_etape_par_etape()