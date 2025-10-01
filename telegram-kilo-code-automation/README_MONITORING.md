# 🤖 Guide de Configuration - Monitoring IA Kilo Code

## Nouveautés de la Version 2.0

Le bot Telegram a été amélioré pour surveiller automatiquement les réponses de l'IA dans Kilo Code et les envoyer sur Telegram.

## Configuration Requise

### 1. Prérequis
- Python 3.8+
- VSCode avec l'extension Kilo Code active
- Bot Telegram configuré

### 2. Installation des Dépendances Supplémentaires

```bash
pip install pyperclip
```

### 3. Configuration des Coordonnées

Ajoutez ces variables dans votre fichier `.env` :

```env
# Configuration du monitoring IA
MONITORING_ENABLED=true
MONITORING_INTERVAL=3
KILO_CODE_RESPONSE_X=600
KILO_CODE_RESPONSE_Y=700
KILO_CODE_COPY_SHORTCUT=ctrl+a,ctrl+c
```

### 4. Calibrage des Coordonnées

#### Coordonnées à Configurer :

1. **KILO_CODE_RESPONSE_X/Y** : Position de la zone de réponse IA
   - Ouvrez VSCode avec Kilo Code
   - Placez votre souris sur le début de la zone de réponse de l'IA
   - Exécutez `python -c "import pyautogui; print(pyautogui.position())"`

2. **KILO_CODE_COPY_SHORTCUT** : Raccourci pour sélectionner et copier
   - Par défaut : `ctrl+a,ctrl+c` (sélectionner tout + copier)
   - Adaptez selon vos besoins

## Utilisation

### Commandes Disponibles

- `/start` - Afficher l'aide générale
- `/status` - Voir les statistiques (inclut maintenant le monitoring)
- `/help` - Guide détaillé
- `/test` - Tester la connexion
- `/calibrate` - Guide de calibrage

**Nouvelles commandes :**
- `/monitor_status` - État du monitoring IA
- `/monitor_toggle` - Activer/désactiver le monitoring

### Fonctionnement Automatique

1. **Envoi depuis Telegram** → Kilo Code (comme avant)
2. **Monitoring automatique** → Détection des réponses IA
3. **Envoi sur Telegram** → Réponses IA automatiquement partagées

## Résolution de Problèmes

### Problème : Pas de réponses reçues sur Telegram

1. Vérifiez que VSCode est ouvert et visible
2. Vérifiez les coordonnées avec `/monitor_status`
3. Testez la copie manuelle avec les raccourcis configurés
4. Ajustez l'intervalle de monitoring si nécessaire

### Problème : Réponses dupliquées

- Le système évite automatiquement les duplications
- Le fichier `last_response.json` stocke la dernière réponse
- Supprimez ce fichier pour réinitialiser si nécessaire

### Problème : Erreurs de permissions

- Assurez-vous que le bot a accès à la fenêtre VSCode
- Vérifiez que VSCode n'est pas minimisé
- Testez avec `/test` pour diagnostiquer

## Conseils d'Optimisation

1. **Résolution d'écran** : Utilisez une résolution fixe pour des coordonnées stables
2. **Position VSCode** : Gardez VSCode à la même position sur l'écran
3. **Intervalle** : 3-5 secondes recommandé (pas trop court pour éviter la surcharge)
4. **Zone de réponse** : Cliquez précisément sur le début de la zone de texte IA

## Sécurité

- Le monitoring ne fonctionne qu'avec les utilisateurs autorisés
- Toutes les actions sont journalisées
- Le mode sécurité peut être activé/désactivé

## Support

En cas de problème :
1. Utilisez `/monitor_status` pour diagnostiquer
2. Vérifiez les logs du script
3. Testez avec `/test`
4. Ajustez les coordonnées si nécessaire