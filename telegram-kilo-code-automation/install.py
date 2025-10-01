#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script d'installation automatique pour le système Telegram -> Kilo Code VSCode
Configure automatiquement l'environnement et teste l'installation
"""

import os
import sys
import subprocess
import platform
import logging
from pathlib import Path

# Configuration du logging
logging.basicConfig(
    format='%(asctime)s - INSTALL - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

def check_python_version():
    """Vérifie la version de Python"""
    logger.info("🔍 Vérification de la version Python...")

    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        logger.info(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
        return True
    else:
        logger.error(f"❌ Python {version.major}.{version.minor}.{version.micro} - Version 3.8+ requise")
        return False

def install_dependencies():
    """Installe les dépendances Python"""
    logger.info("📦 Installation des dépendances...")

    try:
        # Installer depuis requirements.txt
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ])
        logger.info("✅ Dépendances installées avec succès")
        return True

    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Erreur lors de l'installation des dépendances: {e}")
        return False
    except FileNotFoundError:
        logger.error("❌ pip non trouvé. Installation manuelle requise.")
        return False

def create_env_file():
    """Crée le fichier .env avec configuration par défaut"""
    logger.info("⚙️ Création du fichier de configuration...")

    env_path = Path('.env')
    env_example_path = Path('.env.example')

    if env_path.exists():
        logger.info("✅ Fichier .env déjà existant")
        return True

    if env_example_path.exists():
        # Copier .env.example vers .env
        import shutil
        shutil.copy(env_example_path, env_path)
        logger.info("✅ Fichier .env créé depuis .env.example")
        logger.info("📝 Éditez le fichier .env avec vos vraies valeurs:")
        logger.info("   - TELEGRAM_BOT_TOKEN")
        logger.info("   - TELEGRAM_ALLOWED_USER_IDS")
        logger.info("   - Coordonnées VSCode (utilisez /calibrate après installation)")
        return True
    else:
        logger.error("❌ Fichier .env.example non trouvé")
        return False

def test_installation():
    """Test l'installation de base"""
    logger.info("🧪 Test de l'installation...")

    try:
        # Test des imports
        import dotenv
        import pyautogui
        import pynput
        from telegram.ext import Application

        logger.info("✅ Tous les modules importés avec succès")
        return True

    except ImportError as e:
        logger.error(f"❌ Erreur d'import: {e}")
        logger.info("💡 Relancez le script d'installation")
        return False

def show_post_install_instructions():
    """Affiche les instructions post-installation"""
    logger.info("\n" + "="*60)
    logger.info("🎉 INSTALLATION TERMINÉE AVEC SUCCÈS!")
    logger.info("="*60)

    logger.info("\n📋 PROCHAINES ÉTAPES:")
    logger.info("1️⃣ Configurez votre fichier .env:")
    logger.info("   - Obtenez un token bot via @BotFather sur Telegram")
    logger.info("   - Ajoutez votre User ID dans TELEGRAM_ALLOWED_USER_IDS")
    logger.info("   - Ajustez les coordonnées VSCode avec /calibrate")

    logger.info("\n🚀 DEMARRAGE:")
    logger.info("   python telegram_kilo_automation.py")

    logger.info("\n🧪 TEST:")
    logger.info("   python test_integration.py")

    logger.info("\n📖 DOCUMENTATION:")
    logger.info("   Voir README.md pour plus de détails")

    logger.info("\n⚠️ IMPORTANT:")
    logger.info("- Gardez VSCode ouvert pendant l'utilisation")
    logger.info("- L'extension Kilo Code doit être active")
    logger.info("- Les coordonnées peuvent varier selon votre écran")

def main():
    """Fonction principale d'installation"""
    print("""
╔═══════════════════════════════════════════════════════╗
║    Installation: Telegram -> Kilo Code VSCode        ║
║              Assistant d'installation                 ║
╚═══════════════════════════════════════════════════════╝
    """)

    logger.info("🚀 Démarrage de l'installation automatique...")

    steps = [
        ("Version Python", check_python_version),
        ("Dépendances", install_dependencies),
        ("Configuration", create_env_file),
        ("Test installation", test_installation),
    ]

    success = True

    for step_name, step_func in steps:
        logger.info(f"\n📋 Étape: {step_name}")
        logger.info("-" * 40)

        if not step_func():
            success = False
            logger.error(f"❌ Échec de l'étape: {step_name}")
            break

        logger.info(f"✅ {step_name} - OK")

    if success:
        show_post_install_instructions()
        return 0
    else:
        logger.error("\n❌ Installation échouée!")
        logger.info("\n🔧 Résolution:")
        logger.info("1. Vérifiez votre connexion internet")
        logger.info("2. Mettez à jour pip: pip install --upgrade pip")
        logger.info("3. Réessayez l'installation")
        return 1

if __name__ == '__main__':
    sys.exit(main())