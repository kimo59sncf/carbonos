#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de redémarrage automatique pour éviter les boucles infinies
Surveille le processus principal et le redémarre en cas de problème
"""

import os
import sys
import time
import subprocess
import signal
import logging
from pathlib import Path

# Configuration du logging
logging.basicConfig(
    format='%(asctime)s - RESTART - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

class AutoRestart:
    def __init__(self):
        self.process = None
        self.restart_count = 0
        self.max_restarts = 5
        self.restart_delay = 10  # secondes

    def start_main_process(self):
        """Démarre le processus principal"""
        try:
            logger.info("Démarrage du bot principal...")
            self.process = subprocess.Popen([
                sys.executable,
                "telegram_kilo_automation.py"
            ], cwd=os.getcwd())

            logger.info(f"Processus démarré avec PID: {self.process.pid}")
            return True

        except Exception as e:
            logger.error(f"Erreur lors du démarrage: {str(e)}")
            return False

    def stop_main_process(self):
        """Arrête le processus principal"""
        if self.process:
            try:
                logger.info("Arrêt du processus principal...")
                self.process.terminate()

                # Attendre l'arrêt gracieux
                try:
                    self.process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    logger.warning("Processus ne répond pas, forçage de l'arrêt...")
                    self.process.kill()
                    self.process.wait()

                logger.info("Processus arrêté")
                return True

            except Exception as e:
                logger.error(f"Erreur lors de l'arrêt: {str(e)}")
                return False

    def monitor_and_restart(self):
        """Surveille le processus et redémarre si nécessaire"""
        logger.info("Démarrage du système de surveillance...")

        while self.restart_count < self.max_restarts:
            if not self.process or self.process.poll() is not None:
                if self.restart_count > 0:
                    logger.warning(f"Redémarrage nécessaire (tentative {self.restart_count + 1}/{self.max_restarts})")

                self.restart_count += 1

                # Attendre avant le redémarrage
                if self.restart_count > 1:
                    logger.info(f"Attente de {self.restart_delay} secondes avant redémarrage...")
                    time.sleep(self.restart_delay)

                # Arrêter l'ancien processus s'il existe encore
                self.stop_main_process()

                # Démarrer le nouveau processus
                if self.start_main_process():
                    logger.info("Redémarrage réussi")
                else:
                    logger.error("Échec du redémarrage")

            time.sleep(2)  # Vérifier toutes les 2 secondes

        logger.error(f"Nombre maximum de redémarrages atteint ({self.max_restarts})")
        logger.info("Arrêt du système de surveillance")

    def run(self):
        """Point d'entrée principal"""
        print("""
+================================================+
|    Auto-Restart System for Telegram Bot        |
|         Monitoring and Recovery                |
+================================================+
        """)

        try:
            # Démarrer le processus initial
            if self.start_main_process():
                # Commencer la surveillance
                self.monitor_and_restart()
            else:
                logger.error("Impossible de démarrer le processus initial")
                sys.exit(1)

        except KeyboardInterrupt:
            logger.info("Signal d'arrêt reçu...")
        finally:
            logger.info("Arrêt du système de surveillance...")
            self.stop_main_process()

def main():
    """Fonction principale"""
    auto_restart = AutoRestart()
    auto_restart.run()

if __name__ == '__main__':
    main()