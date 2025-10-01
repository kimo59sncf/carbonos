# 🤖 Bot Telegram → Kilo Code VSCode

Système d'automatisation permettant d'envoyer des commandes et du texte depuis Telegram directement dans l'extension Kilo Code de VSCode.

## 🚀 Fonctionnalités

- ✅ **Intégration Telegram complète** - Surveillance automatique des messages
- ✅ **Sécurité intégrée** - Filtrage des utilisateurs autorisés
- ✅ **Détection automatique de VSCode** - Recherche et activation de la fenêtre
- ✅ **Saisie automatique** - Injection de texte dans le champ Kilo Code
- ✅ **Envoi automatique** - Bouton ou raccourci clavier configurable
- ✅ **Gestion d'erreurs robuste** - Logging et récupération automatique
- ✅ **Commandes de contrôle** - Interface Telegram complète
- ✅ **Calibrage facile** - Outil de configuration des coordonnées

## 📋 Prérequis

- Python 3.8+
- VSCode avec l'extension Kilo Code installée
- Bot Telegram (obtention du token via @BotFather)
- Dépendances Python (auto-installées)

## 🛠️ Installation

1. **Cloner/Déplacer le dossier**
   ```bash
   cd telegram-kilo-code-automation/
   ```

2. **Installer les dépendances**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurer l'environnement**
   - Copier `.env.example` vers `.env`
   - Éditer `.env` avec vos paramètres

4. **Configuration obligatoire**

   ```env
   # Token de votre bot Telegram (obligatoire)
   TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

   # Utilisateurs autorisés (votre ID Telegram, obligatoire en mode sécurité)
   TELEGRAM_ALLOWED_USER_IDS=1105076342,987654321

   # Coordonnées du champ texte Kilo Code (à calibrer)
   KILO_CODE_INPUT_X=500
   KILO_CODE_INPUT_Y=800

   # Coordonnées du bouton envoyer (à calibrer)
   KILO_CODE_SEND_BUTTON_X=850
   KILO_CODE_SEND_BUTTON_Y=800
   ```

## ⚙️ Configuration

### 1. Obtenir votre Token Bot Telegram

1. Démarrer une conversation avec [@BotFather](https://t.me/botfather)
2. Créer un nouveau bot avec `/newbot`
3. Copier le token fourni
4. Ajouter le token dans `.env`

### 2. Obtenir votre User ID Telegram

1. Démarrer une conversation avec [@userinfobot](https://t.me/userinfobot)
2. Copier votre User ID
3. Ajouter l'ID dans `TELEGRAM_ALLOWED_USER_IDS`

### 3. Calibrer les Coordonnées VSCode

1. Ouvrir VSCode avec l'extension Kilo Code active
2. Positionner la souris sur le champ texte de Kilo Code
3. Exécuter dans un terminal Python :
   ```python
   import pyautogui
   print(pyautogui.position())
   ```
4. Noter les coordonnées X,Y
5. Mettre à jour `.env` avec ces valeurs

## 🎯 Utilisation

### Démarrage du Bot

```bash
python telegram_kilo_automation.py
```

Le bot affichera :
```
╔═══════════════════════════════════════════════════════╗
║   Bot Telegram -> Kilo Code VSCode Automation        ║
║   Version 1.0.0                                       ║
╚═══════════════════════════════════════════════════════╝

✓ Configuration validée
✓ Bot démarré et en attente de messages...
```

### Commandes Telegram Disponibles

| Commande | Description |
|----------|-------------|
| `/start` | Afficher le message de bienvenue |
| `/status` | Voir les statistiques du bot |
| `/help` | Guide d'utilisation détaillé |
| `/test` | Tester la connexion avec Kilo Code |
| `/calibrate` | Guide de calibrage des coordonnées |

### Utilisation Normale

1. **Envoyer un message** - Tout message texte sera automatiquement envoyé à Kilo Code
2. **Réception** - Le bot confirme la réception et l'envoi
3. **Traitement** - Le texte apparaît dans Kilo Code et est envoyé automatiquement

## 🔒 Sécurité

- **Mode sécurité activé par défaut**
- **Filtrage par User ID** - Seuls les utilisateurs autorisés peuvent utiliser le bot
- **Logging complet** - Toutes les actions sont tracées
- **Gestion d'erreurs** - Échec gracieux en cas de problème

## 🛠️ Résolution de Problèmes

### Problème : "VSCode non trouvé"
**Solution :**
1. Vérifier que VSCode est ouvert
2. S'assurer que l'extension Kilo Code est active
3. Utiliser `/calibrate` pour vérifier les coordonnées

### Problème : "Échec d'envoi"
**Solution :**
1. Vérifier que VSCode est au premier plan
2. Recalibrer les coordonnées avec `/calibrate`
3. Utiliser `/test` pour diagnostiquer

### Problème : "Accès refusé"
**Solution :**
1. Vérifier votre User ID Telegram
2. L'ajouter dans `TELEGRAM_ALLOWED_USER_IDS`
3. Redémarrer le bot

## 📊 Monitoring

Le bot fournit des statistiques en temps réel :
- Messages reçus
- Messages envoyés
- Erreurs rencontrées
- Utilisateurs autorisés

Utilisez `/status` pour les consulter.

## 🔧 Configuration Avancée

### Variables d'environnement optionnelles

```env
# Raccourci clavier pour l'envoi (au lieu du clic)
KILO_CODE_SEND_SHORTCUT=ctrl+enter

# Délai entre actions (ajuster selon les performances)
ACTION_DELAY=0.5

# Désactiver la sécurité (déconseillé)
SECURITY_MODE=false
```

### Installation en Service (Linux/Mac)

Pour un fonctionnement en arrière-plan :

```bash
# Créer un service systemd (Linux)
sudo tee /etc/systemd/system/telegram-kilo-bot.service > /dev/null <<EOF
[Unit]
Description=Telegram Kilo Code Bot
After=network.target

[Service]
Type=simple
User=votre_utilisateur
WorkingDirectory=/chemin/vers/telegram-kilo-code-automation
ExecStart=/usr/bin/python3 telegram_kilo_automation.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable telegram-kilo-bot
sudo systemctl start telegram-kilo-bot
```

## 📝 Logs

Les logs sont affichés en console avec différents niveaux :
- **INFO** - Actions normales
- **WARNING** - Éléments à surveiller
- **ERROR** - Erreurs nécessitant une attention

## 🤝 Support

En cas de problème :
1. Vérifier les logs pour les messages d'erreur
2. Utiliser `/test` pour diagnostiquer
3. Recalibrer les coordonnées si nécessaire
4. Vérifier la configuration `.env`

## 📄 Licence

Ce projet est fourni "tel quel" pour usage éducatif et professionnel.

---

**Version :** 1.0.0
**Dernière mise à jour :** 2024
**Auteur :** Système d'automatisation Kilo Code