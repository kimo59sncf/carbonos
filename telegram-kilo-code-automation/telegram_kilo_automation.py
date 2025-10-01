#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script d'automatisation Telegram -> Kilo Code VSCode
Permet d'envoyer des commandes depuis Telegram vers l'extension Kilo Code
"""

import os
import sys
import time
import logging
import platform
import threading
import json
from typing import List, Optional, Tuple
from dotenv import load_dotenv
import pyautogui
import pyperclip
from pynput.keyboard import Key, Controller
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Import pour la détection de fenêtre (Windows/Linux/Mac)
try:
    import pygetwindow as gw
    WINDOW_DETECTION_AVAILABLE = True
except ImportError:
    WINDOW_DETECTION_AVAILABLE = False
    logger.warning("pygetwindow non disponible. La détection de fenêtre sera limitée.")

# Configuration du logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Chargement des variables d'environnement
load_dotenv()

# Configuration
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
ALLOWED_USER_IDS = [int(uid.strip()) for uid in os.getenv('TELEGRAM_ALLOWED_USER_IDS', '').split(',') if uid.strip()]
KILO_CODE_INPUT_X = int(os.getenv('KILO_CODE_INPUT_X', 500))
KILO_CODE_INPUT_Y = int(os.getenv('KILO_CODE_INPUT_Y', 800))
KILO_CODE_SEND_BUTTON_X = int(os.getenv('KILO_CODE_SEND_BUTTON_X', 850))
KILO_CODE_SEND_BUTTON_Y = int(os.getenv('KILO_CODE_SEND_BUTTON_Y', 800))
KILO_CODE_SEND_SHORTCUT = os.getenv('KILO_CODE_SEND_SHORTCUT', 'ctrl+enter')
SECURITY_MODE = os.getenv('SECURITY_MODE', 'true').lower() == 'true'
ACTION_DELAY = float(os.getenv('ACTION_DELAY', 0.5))

# Configuration pour surveiller les réponses de l'IA
MONITORING_ENABLED = os.getenv('MONITORING_ENABLED', 'true').lower() == 'true'
MONITORING_INTERVAL = int(os.getenv('MONITORING_INTERVAL', 3))  # secondes entre chaque vérification
KILO_CODE_RESPONSE_X = int(os.getenv('KILO_CODE_RESPONSE_X', 600))
KILO_CODE_RESPONSE_Y = int(os.getenv('KILO_CODE_RESPONSE_Y', 700))
KILO_CODE_COPY_SHORTCUT = os.getenv('KILO_CODE_COPY_SHORTCUT', 'ctrl+a,ctrl+c')
LAST_RESPONSE_FILE = 'last_response.json'

# Contrôleur clavier
keyboard = Controller()

# Statistiques
stats = {
    'messages_received': 0,
    'messages_sent': 0,
    'errors': 0
}

# Cache pour éviter de traiter les mêmes messages en boucle
processed_messages = set()
last_message_time = 0
MESSAGE_COOLDOWN = 2  # secondes entre deux messages identiques


def is_user_authorized(user_id: int) -> bool:
    """Vérifie si l'utilisateur est autorisé"""
    if not SECURITY_MODE:
        return True
    return user_id in ALLOWED_USER_IDS


def find_vscode_window() -> Optional[Tuple[int, int, int, int]]:
    """
    Recherche la fenêtre VSCode/Code ouverte

    Returns:
        Tuple (x, y, width, height) de la fenêtre VSCode, ou None si non trouvée
    """
    if not WINDOW_DETECTION_AVAILABLE:
        logger.warning("Détection de fenêtre non disponible, utilisation des coordonnées par défaut")
        return None

    try:
        system = platform.system().lower()

        # Recherche par titre de fenêtre selon le système
        if system == "windows":
            windows = gw.getWindowsWithTitle("Visual Studio Code")
            windows.extend(gw.getWindowsWithTitle("Code"))
        elif system == "darwin":  # macOS
            windows = gw.getWindowsWithTitle("Visual Studio Code")
            windows.extend(gw.getWindowsWithTitle("Code"))
        else:  # Linux
            windows = gw.getWindowsWithTitle("Visual Studio Code")
            windows.extend(gw.getWindowsWithTitle("Code"))
            windows.extend(gw.getWindowsWithTitle("vscode"))

        if windows:
            window = windows[0]  # Prendre la première fenêtre trouvée
            if window.isMinimized:
                logger.info("Fenêtre VSCode minimisée, restauration...")
                window.restore()

            window.activate()
            time.sleep(0.5)  # Attendre l'activation

            x, y, width, height = window.left, window.top, window.width, window.height
            logger.info(f"Fenêtre VSCode trouvée: {x},{y} ({width}x{height})")
            return (x, y, width, height)

    except Exception as e:
        logger.error(f"Erreur lors de la recherche de la fenêtre VSCode: {str(e)}")

    logger.warning("Fenêtre VSCode non trouvée")
    return None


def is_vscode_active() -> bool:
    """
    Vérifie si VSCode est la fenêtre active

    Returns:
        True si VSCode est actif, False sinon
    """
    if not WINDOW_DETECTION_AVAILABLE:
        return True  # Supposer que c'est actif si on ne peut pas vérifier

    try:
        system = platform.system().lower()
        active_window = gw.getActiveWindow()

        if active_window:
            title = active_window.title.lower()
            return "visual studio code" in title or "code" in title

    except Exception as e:
        logger.error(f"Erreur lors de la vérification de la fenêtre active: {str(e)}")

    return False


def ensure_vscode_active() -> bool:
    """
    S'assure que VSCode est actif et visible

    Returns:
        True si VSCode est prêt, False sinon
    """
    logger.info("Vérification de la présence de VSCode...")

    # Recherche de la fenêtre VSCode
    window_info = find_vscode_window()

    if window_info:
        # Vérifier si VSCode est actif
        if not is_vscode_active():
            logger.info("Activation de la fenêtre VSCode...")
            if window_info:
                x, y, width, height = window_info
                # Cliquer au centre de la fenêtre pour l'activer
                center_x = x + (width // 2)
                center_y = y + (height // 2)
                pyautogui.click(center_x, center_y)
                time.sleep(1.0)

        return True

    logger.error("VSCode non trouvé ou non accessible")
    return False


def load_last_response() -> str:
    """Charge la dernière réponse connue depuis le fichier"""
    try:
        if os.path.exists(LAST_RESPONSE_FILE):
            with open(LAST_RESPONSE_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('last_response', '')
    except Exception as e:
        logger.error(f"Erreur lors du chargement de la dernière réponse: {str(e)}")
    return ''


def save_last_response(response: str) -> None:
    """Sauvegarde la dernière réponse dans un fichier"""
    try:
        with open(LAST_RESPONSE_FILE, 'w', encoding='utf-8') as f:
            json.dump({'last_response': response, 'timestamp': time.time()}, f)
    except Exception as e:
        logger.error(f"Erreur lors de la sauvegarde de la dernière réponse: {str(e)}")


def get_kilo_code_response() -> Optional[str]:
    """
    Extrait la réponse de l'IA depuis l'interface Kilo Code

    Returns:
        Le texte de la réponse ou None si aucune nouvelle réponse
    """
    try:
        # S'assurer que VSCode est actif
        if not ensure_vscode_active():
            logger.error("VSCode non actif")
            return None

        logger.info(f"Clic sur la zone de réponse ({KILO_CODE_RESPONSE_X}, {KILO_CODE_RESPONSE_Y})")
        # Cliquer sur la zone de réponse pour la sélectionner
        pyautogui.click(KILO_CODE_RESPONSE_X, KILO_CODE_RESPONSE_Y)
        time.sleep(ACTION_DELAY * 0.5)

        # Copier le texte (sélectionner tout + copier)
        logger.info(f"Utilisation du raccourci: {KILO_CODE_COPY_SHORTCUT}")
        keys = KILO_CODE_COPY_SHORTCUT.split(',')
        for key_combo in keys:
            key_combo = key_combo.strip()
            if '+' in key_combo:
                pyautogui.hotkey(*key_combo.split('+'))
            else:
                pyautogui.press(key_combo)
            time.sleep(0.1)

        # Récupérer le texte depuis le presse-papiers
        response_text = pyperclip.paste().strip()

        logger.info(f"Texte extrait ({len(response_text) if response_text else 0} caractères): {response_text[:100] if response_text else 'Aucun'}...")

        if response_text and len(response_text) > 10:  # Filtrer les réponses trop courtes
            return response_text

    except Exception as e:
        logger.error(f"Erreur lors de l'extraction de la réponse: {str(e)}")

    return None


def force_send_response(context: ContextTypes.DEFAULT_TYPE, text: str) -> bool:
    """
    Force l'envoi d'une réponse sur Telegram (même courte)

    Args:
        context: Le contexte Telegram
        text: Le texte à envoyer (peut être court)

    Returns:
        True si l'envoi a réussi, False sinon
    """
    try:
        if not text:
            logger.error("Aucun texte à envoyer")
            return False

        logger.info(f"Préparation de l'envoi Telegram: {len(text)} caractères")

        # Tronquer le texte s'il est trop long (limite Telegram)
        if len(text) > 4000:
            text = text[:3997] + "..."
            logger.info("Texte tronqué à 4000 caractères")

        # ⚠️ IMPORTANT : TOUJOURS identifier comme réponse IA pour éviter la boucle
        ia_response = f"🤖 **Réponse de Kilo Code:**\n\n{text}"

        logger.info(f"Message formaté, envoi à {len(ALLOWED_USER_IDS)} utilisateur(s)")

        # Envoyer à tous les utilisateurs autorisés
        success_count = 0
        for user_id in ALLOWED_USER_IDS:
            try:
                logger.info(f"Envoi à l'utilisateur {user_id}...")
                context.bot.send_message(
                    chat_id=user_id,
                    text=ia_response,
                    parse_mode='Markdown'
                )
                success_count += 1
                logger.info(f"✓ Message envoyé avec succès à {user_id}")
                time.sleep(0.5)  # Éviter le rate limiting
            except Exception as e:
                logger.error(f"Erreur lors de l'envoi à l'utilisateur {user_id}: {str(e)}")

        if success_count > 0:
            logger.info(f"✓ Réponse forcée envoyée sur Telegram à {success_count} utilisateur(s)")
            return True
        else:
            logger.error("Aucun message n'a pu être envoyé sur Telegram")
            return False

    except Exception as e:
        logger.error(f"Erreur générale lors de l'envoi Telegram: {str(e)}")
        return False


def send_to_telegram(context: ContextTypes.DEFAULT_TYPE, text: str) -> bool:
    """
    Envoie un message sur Telegram (TOUJOURS depuis l'IA)

    Args:
        context: Le contexte Telegram
        text: Le texte à envoyer

    Returns:
        True si l'envoi a réussi, False sinon
    """
    try:
        if not text or len(text) < 2:
            return False

        # Tronquer le texte s'il est trop long (limite Telegram)
        if len(text) > 4000:
            text = text[:3997] + "..."

        # ⚠️ IMPORTANT : TOUJOURS identifier comme réponse IA pour éviter la boucle
        ia_response = f"🤖 **Réponse de Kilo Code:**\n\n{text}"

        # Envoyer à tous les utilisateurs autorisés
        success_count = 0
        for user_id in ALLOWED_USER_IDS:
            try:
                context.bot.send_message(
                    chat_id=user_id,
                    text=ia_response,
                    parse_mode='Markdown'
                )
                success_count += 1
                time.sleep(0.5)  # Éviter le rate limiting
            except Exception as e:
                logger.error(f"Erreur lors de l'envoi à l'utilisateur {user_id}: {str(e)}")

        if success_count > 0:
            logger.info(f"✓ Réponse IA envoyée sur Telegram à {success_count} utilisateur(s)")
            return True
        else:
            logger.error("Aucun message n'a pu être envoyé sur Telegram")
            return False

    except Exception as e:
        logger.error(f"Erreur générale lors de l'envoi Telegram: {str(e)}")
        return False


def monitor_kilo_code_responses(context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Surveille les réponses de l'IA dans Kilo Code et les envoie sur Telegram
    """
    logger.info("Démarrage du monitoring IA...")

    while True:
        try:
            if not MONITORING_ENABLED:
                logger.info("Monitoring désactivé, pause...")
                time.sleep(MONITORING_INTERVAL)
                continue

            logger.info(f"Cycle de monitoring (intervalle: {MONITORING_INTERVAL}s)")

            # Charger la dernière réponse connue
            last_response = load_last_response()
            logger.info(f"Dernière réponse connue: {len(last_response) if last_response else 0} caractères")

            # Extraire la réponse actuelle depuis Kilo Code
            current_response = get_kilo_code_response()

            if current_response:
                logger.info(f"Réponse actuelle extraite: {len(current_response)} caractères")

                # Vérifier si c'est une nouvelle réponse
                if current_response != last_response:
                    logger.info("NOUVELLE réponse détectée!")

                    # Utiliser force_send_response pour envoyer même les réponses courtes
                    logger.info("Envoi de la réponse sur Telegram...")
                    success = force_send_response(context, current_response)

                    if success:
                        logger.info("Réponse envoyée avec succès, sauvegarde...")
                        # Sauvegarder cette réponse comme dernière connue
                        save_last_response(current_response)
                    else:
                        logger.error("Échec de l'envoi sur Telegram")
                else:
                    logger.info("Réponse identique à la précédente, ignorée")
            else:
                logger.info("Aucune réponse extraite")

            # Attendre avant la prochaine vérification
            logger.info(f"Attente de {MONITORING_INTERVAL} secondes...")
            time.sleep(MONITORING_INTERVAL)

        except Exception as e:
            logger.error(f"Erreur dans le monitoring: {str(e)}")
            time.sleep(MONITORING_INTERVAL)


def send_to_kilo_code(text: str) -> bool:
    """
    Envoie le texte à l'extension Kilo Code de VSCode

    Args:
        text: Le texte à envoyer

    Returns:
        True si l'envoi a réussi, False sinon
    """
    try:
        logger.info(f"Envoi du texte vers Kilo Code: {text[:50]}...")

        # Étape 1: Vérifier et activer VSCode (une seule fois)
        if not ensure_vscode_active():
            logger.error("Impossible d'activer VSCode")
            return False

        # Étape 2: Cliquer sur le champ de texte de Kilo Code
        logger.info(f"Clic sur le champ texte ({KILO_CODE_INPUT_X}, {KILO_CODE_INPUT_Y})")
        pyautogui.click(KILO_CODE_INPUT_X, KILO_CODE_INPUT_Y)
        time.sleep(ACTION_DELAY)

        # Étape 3: Sélectionner tout le texte existant et le supprimer (optimisé)
        pyautogui.hotkey('ctrl', 'a')
        time.sleep(0.1)  # Réduit de 0.2 à 0.1
        pyautogui.press('delete')
        time.sleep(0.1)  # Réduit de 0.2 à 0.1

        # Étape 4: Taper le nouveau texte (vitesse optimisée)
        logger.info("Saisie du texte...")
        pyautogui.write(text, interval=0.005)  # Augmenté la vitesse de 0.01 à 0.005
        time.sleep(ACTION_DELAY)

        # Étape 5: Envoyer le message (logique optimisée)
        logger.info("Envoi du message...")
        if KILO_CODE_SEND_SHORTCUT and KILO_CODE_SEND_SHORTCUT.lower() != 'none':
            # Utiliser le raccourci clavier
            keys = KILO_CODE_SEND_SHORTCUT.split('+')
            if len(keys) == 2:
                pyautogui.hotkey(keys[0].strip(), keys[1].strip())
            else:
                pyautogui.press(keys[0].strip())
        else:
            # Cliquer sur le bouton Envoyer
            pyautogui.click(KILO_CODE_SEND_BUTTON_X, KILO_CODE_SEND_BUTTON_Y)

        time.sleep(ACTION_DELAY * 0.5)  # Réduit le délai final
        logger.info("✓ Message envoyé avec succès")
        return True

    except Exception as e:
        logger.error(f"✗ Erreur lors de l'envoi: {str(e)}")
        return False


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Commande /start"""
    user_id = update.effective_user.id
    
    if not is_user_authorized(user_id):
        await update.message.reply_text(
            "❌ Accès refusé. Vous n'êtes pas autorisé à utiliser ce bot."
        )
        logger.warning(f"Tentative d'accès non autorisée: User ID {user_id}")
        return
    
    welcome_message = """
🤖 **Bot Telegram <-> Kilo Code VSCode**

✅ Vous êtes autorisé à utiliser ce bot.

**Commandes disponibles:**
/start - Afficher ce message
/status - Voir les statistiques
/help - Aide détaillée
/test - Tester la connexion
/calibrate - Guide de calibrage des coordonnées

**Nouvelles commandes (Monitoring IA):**
/monitor_status - État du monitoring IA
/monitor_toggle - Activer/désactiver le monitoring

**Utilisation:**
• Envoyez votre texte → automatiquement inséré dans Kilo Code
• Les réponses IA → automatiquement envoyées sur Telegram

⚠️ **Important:** Assurez-vous que VSCode avec l'extension Kilo Code est ouvert et visible.
    """
    
    await update.message.reply_text(welcome_message, parse_mode='Markdown')


async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Commande /status"""
    user_id = update.effective_user.id
    
    if not is_user_authorized(user_id):
        await update.message.reply_text("❌ Accès refusé.")
        return
    
    status_message = f"""
📊 **Statistiques du Bot**

Messages reçus: {stats['messages_received']}
Messages envoyés: {stats['messages_sent']}
Erreurs: {stats['errors']}

🔒 Mode sécurité: {'Activé' if SECURITY_MODE else 'Désactivé'}
👥 Utilisateurs autorisés: {len(ALLOWED_USER_IDS)}
🤖 Monitoring IA: {'Activé' if MONITORING_ENABLED else 'Désactivé'}
⏱️ Intervalle monitoring: {MONITORING_INTERVAL}s
    """
    
    await update.message.reply_text(status_message, parse_mode='Markdown')


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Commande /help"""
    user_id = update.effective_user.id
    
    if not is_user_authorized(user_id):
        await update.message.reply_text("❌ Accès refusé.")
        return
    
    help_message = """
📖 **Guide d'utilisation**

**Configuration requise:**
1. VSCode ouvert avec l'extension Kilo Code active
2. Le champ texte de Kilo Code visible à l'écran
3. Les coordonnées correctement configurées dans .env

**Fonctionnement:**
1. Envoyez votre texte/commande via Telegram
2. Le bot clique sur le champ Kilo Code
3. Le texte est inséré automatiquement
4. Le message est envoyé automatiquement

**Monitoring IA (Nouveau):**
1. Le bot surveille automatiquement les réponses de l'IA
2. Les nouvelles réponses sont envoyées sur Telegram
3. Évite les duplications grâce au système de cache

**Commandes de monitoring:**
- /monitor_status - État du monitoring IA
- /monitor_toggle - Activer/désactiver le monitoring
- /test_monitoring - Tester l'envoi des réponses IA

**Conseils:**
- Utilisez /test pour vérifier la configuration
- Utilisez /test_monitoring pour tester le monitoring IA
- Ajustez les coordonnées dans .env si nécessaire
- Gardez VSCode au premier plan pendant l'utilisation

**Sécurité:**
- Seuls les utilisateurs autorisés peuvent utiliser le bot
- Chaque action est journalisée
- Mode sécurité activable/désactivable
    """
    
    await update.message.reply_text(help_message, parse_mode='Markdown')


async def test_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Commande /test"""
    user_id = update.effective_user.id

    if not is_user_authorized(user_id):
        await update.message.reply_text("❌ Accès refusé.")
        return

    await update.message.reply_text("🧪 Test en cours...")

    test_text = "Test automatique depuis Telegram"
    success = send_to_kilo_code(test_text)

    if success:
        await update.message.reply_text("✅ Test réussi! Le message a été envoyé à Kilo Code.")
    else:
        await update.message.reply_text("❌ Test échoué. Vérifiez les logs et la configuration.")


async def test_monitoring_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Commande /test_monitoring - Test du système de monitoring IA"""
    user_id = update.effective_user.id

    if not is_user_authorized(user_id):
        await update.message.reply_text("❌ Accès refusé.")
        return

    await update.message.reply_text("🧪 Test du monitoring IA...")

    # Test de la fonction d'extraction de réponse
    test_response = "Ceci est un test de réponse IA pour vérifier le monitoring"

    # Sauvegarder temporairement la dernière réponse
    original_last = load_last_response()

    # Tester l'envoi direct
    success = force_send_response(context, test_response)

    # Restaurer la dernière réponse originale
    if original_last:
        save_last_response(original_last)

    if success:
        await update.message.reply_text("✅ Test du monitoring réussi! La réponse de test a été envoyée.")
    else:
        await update.message.reply_text("❌ Test du monitoring échoué. Vérifiez la configuration Telegram.")


async def monitor_status_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Commande /monitor_status - État du monitoring IA"""
    user_id = update.effective_user.id

    if not is_user_authorized(user_id):
        await update.message.reply_text("❌ Accès refusé.")
        return

    # Vérifier si le fichier de dernière réponse existe
    last_response_info = "Aucune réponse sauvegardée"
    if os.path.exists(LAST_RESPONSE_FILE):
        try:
            with open(LAST_RESPONSE_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                timestamp = data.get('timestamp', 0)
                if timestamp:
                    from datetime import datetime
                    dt = datetime.fromtimestamp(timestamp)
                    last_response_info = f"Dernière réponse: {dt.strftime('%H:%M:%S')}"
        except:
            last_response_info = "Erreur lors de la lecture du fichier"

    status_message = f"""
🤖 **État du Monitoring IA**

🔄 Monitoring: {'🟢 Activé' if MONITORING_ENABLED else '🔴 Désactivé'}
⏱️ Intervalle: {MONITORING_INTERVAL} secondes
📍 Zone surveillée: ({KILO_CODE_RESPONSE_X}, {KILO_CODE_RESPONSE_Y})
📋 Raccourci copie: {KILO_CODE_COPY_SHORTCUT}
💾 {last_response_info}

**Configuration recommandée:**
- Coordonnées de la zone de réponse IA
- Raccourci pour sélectionner et copier le texte
- Intervalle de vérification (3-5 secondes recommandé)
    """

    await update.message.reply_text(status_message, parse_mode='Markdown')


async def monitor_toggle_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Commande /monitor_toggle - Active/désactive le monitoring IA"""
    user_id = update.effective_user.id

    if not is_user_authorized(user_id):
        await update.message.reply_text("❌ Accès refusé.")
        return

    global MONITORING_ENABLED

    # Basculer l'état du monitoring
    MONITORING_ENABLED = not MONITORING_ENABLED

    status = "🟢 ACTIVÉ" if MONITORING_ENABLED else "🔴 DÉSACTIVÉ"
    await update.message.reply_text(f"✅ Monitoring IA {status}")

    logger.info(f"Monitoring IA {'activé' if MONITORING_ENABLED else 'désactivé'} par l'utilisateur {user_id}")


async def calibrate_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Commande /calibrate - Aide au calibrage des coordonnées"""
    user_id = update.effective_user.id

    if not is_user_authorized(user_id):
        await update.message.reply_text("❌ Accès refusé.")
        return

    calibrate_message = """
🔧 **Guide de calibrage des coordonnées**

**Étape 1:** Ouvrez VSCode avec l'extension Kilo Code active
**Étape 2:** Positionnez votre souris sur le champ texte de Kilo Code
**Étape 3:** Exécutez cette commande pour capturer les coordonnées

📍 **Commande de capture:**
```
pyautogui.position()
```

**Étape 4:** Mettez à jour votre fichier .env:
```
KILO_CODE_INPUT_X=votre_x
KILO_CODE_INPUT_Y=votre_y
```

**Conseils:**
- Utilisez la commande /test pour vérifier après calibrage
- Les coordonnées peuvent varier selon la résolution d'écran
- Assurez-vous que VSCode est en plein écran pour plus de stabilité

⚠️ **Important:** Les coordonnées actuelles sont:
- Champ texte: ({KILO_CODE_INPUT_X}, {KILO_CODE_INPUT_Y})
- Bouton envoyer: ({KILO_CODE_SEND_BUTTON_X}, {KILO_CODE_SEND_BUTTON_Y})
    """

    await update.message.reply_text(calibrate_message, parse_mode='Markdown')


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Gère les messages texte reçus"""
    global last_message_time

    user_id = update.effective_user.id
    user_name = update.effective_user.username or update.effective_user.first_name
    message_text = update.message.text.strip()
    current_time = time.time()

    # Créer une clé unique pour ce message
    message_key = f"{user_id}:{message_text}:{current_time}"

    # 🚫 FILTRAGE ANTI-BOUCLE : Ignorer les messages qui viennent des réponses IA
    ia_signatures = [
        "🤖 **Réponse de Kilo Code:**",
        "🤖 Réponse de Kilo Code :",
        "Réponse de Kilo Code",
        "✅ Tâche terminée",
        "✅ Code corrigé",
        "✅ Page créée",
        "📋 Explication"
    ]

    # Vérifier si le message contient une signature de réponse IA
    is_ia_response = any(signature in message_text for signature in ia_signatures)

    if is_ia_response:
        logger.info("Message de réponse IA ignoré (anti-boucle)")
        return

    # Vérification anti-boucle : même message dans les 2 secondes
    if message_text == getattr(context.bot_data, 'last_message_text', None):
        if current_time - getattr(context.bot_data, 'last_message_time', 0) < MESSAGE_COOLDOWN:
            logger.info("Message dupliqué ignoré (anti-boucle)")
            return

    # Vérification de l'autorisation
    if not is_user_authorized(user_id):
        await update.message.reply_text("❌ Accès refusé. Vous n'êtes pas autorisé.")
        logger.warning(f"Message non autorisé de {user_name} (ID: {user_id})")
        stats['errors'] += 1
        return

    # Anti-spam : limiter les messages trop fréquents
    if current_time - last_message_time < 1.0:  # Minimum 1 seconde entre messages
        logger.info("Message ignoré (anti-spam)")
        return

    stats['messages_received'] += 1
    last_message_time = current_time

    # Stocker le dernier message pour éviter les duplications
    context.bot_data['last_message_text'] = message_text
    context.bot_data['last_message_time'] = current_time

    logger.info(f"Message reçu de {user_name} (ID: {user_id}): {message_text[:50]}...")

    # Vérification basique du message
    if not message_text or len(message_text) < 2:
        await update.message.reply_text("📝 Message trop court, ignoré.")
        return

    # Confirmation de réception (éviter le spam de confirmations)
    if stats['messages_received'] % 5 == 1:  # Tous les 5 messages
        await update.message.reply_text("📨 Message reçu, traitement en cours...")

    # Envoi vers Kilo Code avec gestion d'erreur améliorée
    success = send_to_kilo_code(message_text)

    if success:
        stats['messages_sent'] += 1
        # Confirmation de succès (pas à chaque fois pour éviter le spam)
        if stats['messages_sent'] % 3 == 1:  # Tous les 3 succès
            await update.message.reply_text("✅ Commande exécutée avec succès!")
    else:
        stats['errors'] += 1
        # Message d'erreur seulement si plusieurs erreurs consécutives
        if stats['errors'] % 3 == 1:  # Toutes les 3 erreurs
            await update.message.reply_text(
                "❌ Erreur lors de l'exécution. Vérifiez que VSCode est ouvert."
            )


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Gère les erreurs"""
    logger.error(f"Exception lors du traitement de la mise à jour: {context.error}")
    stats['errors'] += 1


def validate_configuration() -> bool:
    """Valide la configuration avant le démarrage"""
    errors = []
    
    if not TELEGRAM_BOT_TOKEN:
        errors.append("❌ TELEGRAM_BOT_TOKEN manquant dans .env")
    
    if SECURITY_MODE and not ALLOWED_USER_IDS:
        errors.append("❌ TELEGRAM_ALLOWED_USER_IDS manquant (mode sécurité activé)")
    
    if errors:
        for error in errors:
            logger.error(error)
        return False
    
    logger.info("✓ Configuration validée")
    return True


def main():
    """Point d'entrée principal"""
    print("""
+================================================+
|   Bot Telegram <-> Kilo Code VSCode Automation |
|   Version 2.0.0 - Avec monitoring IA           |
+================================================+
    """)

    # Validation de la configuration
    if not validate_configuration():
        logger.error("Configuration invalide. Arrêt du bot.")
        sys.exit(1)

    # Configuration de PyAutoGUI
    pyautogui.FAILSAFE = True  # Déplacer la souris dans le coin pour arrêter
    pyautogui.PAUSE = 0.1

    logger.info("Démarrage du bot...")
    logger.info(f"Mode sécurité: {'Activé' if SECURITY_MODE else 'Désactivé'}")
    logger.info(f"Utilisateurs autorisés: {len(ALLOWED_USER_IDS)}")
    logger.info(f"Monitoring IA: {'Activé' if MONITORING_ENABLED else 'Désactivé'}")

    # Création de l'application
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # Ajout des handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("status", status_command))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("test", test_command))
    application.add_handler(CommandHandler("test_monitoring", test_monitoring_command))
    application.add_handler(CommandHandler("calibrate", calibrate_command))
    application.add_handler(CommandHandler("monitor_status", monitor_status_command))
    application.add_handler(CommandHandler("monitor_toggle", monitor_toggle_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    application.add_error_handler(error_handler)

    # Démarrer le monitoring en arrière-plan si activé
    if MONITORING_ENABLED:
        logger.info("Démarrage du monitoring des réponses IA...")
        monitor_thread = threading.Thread(
            target=monitor_kilo_code_responses,
            args=(application,),
            daemon=True
        )
        monitor_thread.start()
        logger.info("✓ Monitoring démarré en arrière-plan")

    # Démarrage du bot
    logger.info("✓ Bot démarré et en attente de messages...")
    logger.info("Appuyez sur Ctrl+C pour arrêter")

    try:
        application.run_polling(allowed_updates=Update.ALL_TYPES)
    except KeyboardInterrupt:
        logger.info("\nArrêt du bot...")
        logger.info(f"Statistiques finales: {stats}")
    except Exception as e:
        logger.error(f"Erreur fatale: {str(e)}")
        sys.exit(1)
    finally:
        # Nettoyage final
        processed_messages.clear()
        logger.info("Nettoyage effectué")


if __name__ == '__main__':
    main()
