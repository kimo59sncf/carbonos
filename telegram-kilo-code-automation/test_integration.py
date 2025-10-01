#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de test pour l'intégration Telegram -> Kilo Code VSCode
Permet de tester toutes les fonctionnalités avant déploiement
"""

import os
import sys
import time
import logging
from dotenv import load_dotenv

# Ajouter le répertoire courant au path pour importer le script principal
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from telegram_kilo_automation import (
    find_vscode_window,
    is_vscode_active,
    ensure_vscode_active,
    send_to_kilo_code,
    validate_configuration
)

# Configuration du logging pour les tests
logging.basicConfig(
    format='%(asctime)s - TEST - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Chargement des variables d'environnement
load_dotenv()

def test_configuration():
    """Test de la configuration"""
    logger.info("🔧 Test de la configuration...")

    if not validate_configuration():
        logger.error("❌ Configuration invalide")
        return False

    logger.info("✅ Configuration valide")
    return True

def test_vscode_detection():
    """Test de la détection VSCode"""
    logger.info("🔍 Test de détection de VSCode...")

    try:
        # Test de recherche de fenêtre
        window_info = find_vscode_window()

        if window_info:
            x, y, width, height = window_info
            logger.info(f"✅ Fenêtre VSCode trouvée: {x},{y} ({width}x{height})")
        else:
            logger.warning("⚠️ Fenêtre VSCode non trouvée (normal si VSCode fermé)")

        # Test de vérification d'activité
        is_active = is_vscode_active()
        logger.info(f"✅ VSCode actif: {is_active}")

        return True

    except Exception as e:
        logger.error(f"❌ Erreur lors du test de détection: {str(e)}")
        return False

def test_vscode_activation():
    """Test de l'activation de VSCode"""
    logger.info("🚀 Test d'activation de VSCode...")

    try:
        success = ensure_vscode_active()

        if success:
            logger.info("✅ VSCode activé avec succès")
            return True
        else:
            logger.warning("⚠️ Impossible d'activer VSCode (fenêtre non trouvée)")
            return False

    except Exception as e:
        logger.error(f"❌ Erreur lors de l'activation: {str(e)}")
        return False

def test_text_sending():
    """Test d'envoi de texte"""
    logger.info("📝 Test d'envoi de texte...")

    # Vérifier que VSCode est prêt
    if not ensure_vscode_active():
        logger.error("❌ VSCode non disponible pour le test")
        return False

    # Texte de test
    test_messages = [
        "Test d'intégration 1",
        "Hello from Telegram Bot!",
        "Message de test avec caractères spéciaux: éàïôù",
        "Long message pour tester la stabilité du système d'automatisation"
    ]

    success_count = 0

    for i, message in enumerate(test_messages, 1):
        logger.info(f"Test {i}/4: '{message[:30]}...'")

        # Pause entre les tests
        if i > 1:
            time.sleep(2)

        success = send_to_kilo_code(message)

        if success:
            success_count += 1
            logger.info(f"✅ Test {i} réussi")
        else:
            logger.error(f"❌ Test {i} échoué")

    logger.info(f"Résultats: {success_count}/{len(test_messages)} tests réussis")

    return success_count == len(test_messages)

def run_all_tests():
    """Exécute tous les tests"""
    logger.info("🧪 Démarrage de la suite de tests complète")
    logger.info("=" * 60)

    tests = [
        ("Configuration", test_configuration),
        ("Détection VSCode", test_vscode_detection),
        ("Activation VSCode", test_vscode_activation),
        ("Envoi de texte", test_text_sending),
    ]

    results = []

    for test_name, test_func in tests:
        logger.info(f"\n📋 Test: {test_name}")
        logger.info("-" * 40)

        try:
            success = test_func()
            results.append((test_name, success))

            if success:
                logger.info(f"✅ {test_name}: RÉUSSI")
            else:
                logger.warning(f"⚠️ {test_name}: ÉCHEC")

        except Exception as e:
            logger.error(f"❌ {test_name}: ERREUR - {str(e)}")
            results.append((test_name, False))

        time.sleep(1)  # Pause entre les tests

    # Résumé final
    logger.info("\n" + "=" * 60)
    logger.info("📊 RÉSUMÉ DES TESTS")
    logger.info("=" * 60)

    passed = sum(1 for _, success in results if success)
    total = len(results)

    for test_name, success in results:
        status = "✅ RÉUSSI" if success else "❌ ÉCHEC"
        logger.info(f"{test_name:<20} {status}")

    logger.info("-" * 60)
    logger.info(f"Total: {passed}/{total} tests réussis")

    if passed == total:
        logger.info("🎉 Tous les tests sont passés! Le système est prêt.")
        return True
    else:
        logger.warning("⚠️ Certains tests ont échoué. Vérifiez la configuration.")
        return False

def main():
    """Point d'entrée principal"""
    print("""
╔═══════════════════════════════════════════════════════╗
║           Test d'intégration Telegram -> Kilo Code    ║
║                 Suite de tests complète               ║
╚═══════════════════════════════════════════════════════╝
    """)

    logger.info("Assurez-vous que:")
    logger.info("1. VSCode est ouvert avec l'extension Kilo Code active")
    logger.info("2. Le champ texte de Kilo Code est visible")
    logger.info("3. Les coordonnées dans .env sont correctement configurées")
    logger.info("")

    input("Appuyez sur Entrée quand vous êtes prêt...")

    success = run_all_tests()

    if success:
        logger.info("\n🎯 Le système est prêt pour la production!")
        logger.info("Vous pouvez maintenant démarrer telegram_kilo_automation.py")
    else:
        logger.info("\n🔧 Veuillez corriger les problèmes avant de continuer")
        logger.info("Utilisez la commande /calibrate dans Telegram pour vous aider")

    return 0 if success else 1

if __name__ == '__main__':
    sys.exit(main())