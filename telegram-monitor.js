const https = require('https');
const fs = require('fs');

const TELEGRAM_BOT_TOKEN = '8395439917:AAHsa7bnDTjntMOJ_Z4VnzfwYtBjYhNdpnU';
const TELEGRAM_CHAT_ID = '1105076342';
const LAST_MESSAGE_FILE = 'last_message_id.json';

let lastMessageId = loadLastMessageId();
let processedMessages = new Set();

function loadLastMessageId() {
    try {
        if (fs.existsSync(LAST_MESSAGE_FILE)) {
            const data = fs.readFileSync(LAST_MESSAGE_FILE, 'utf8');
            return JSON.parse(data).lastMessageId || 0;
        }
    } catch (error) {
        console.error('Erreur lors du chargement du dernier message ID:', error);
    }
    return 0;
}

function saveLastMessageId(messageId) {
    try {
        fs.writeFileSync(LAST_MESSAGE_FILE, JSON.stringify({ lastMessageId: messageId }));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du dernier message ID:', error);
    }
}

function checkForNewMessages() {
    // Utiliser un offset plus élevé pour éviter les anciens messages
    const offset = lastMessageId + 1;
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${offset}&timeout=30`;

    console.log(`Vérification des messages depuis l'ID ${lastMessageId}...`);

    const req = https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (response.ok && response.result.length > 0) {
                    console.log(`${response.result.length} nouveaux messages reçus`);

                    // Traiter les nouveaux messages
                    for (const update of response.result) {
                        if (update.message && update.message.message_id > lastMessageId) {
                            const messageText = update.message.text;
                            const messageId = update.message.message_id;

                            if (messageText && !processedMessages.has(messageId)) {
                                console.log(`Nouveau message (${messageId}): ${messageText}`);
                                executeOrder(messageText);
                                processedMessages.add(messageId);
                                lastMessageId = messageId;
                                saveLastMessageId(lastMessageId);

                                // Nettoyer l'ensemble pour éviter la croissance mémoire
                                if (processedMessages.size > 100) {
                                    processedMessages.clear();
                                }
                            }
                        }
                    }
                } else {
                    console.log('Aucun nouveau message');
                }
            } catch (error) {
                console.error('Erreur lors du traitement de la réponse:', error);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Erreur de requête:', error);
    });

    req.setTimeout(35000, () => {
        console.log('Timeout de la requête, nouvelle tentative...');
        req.destroy();
    });
}

const { exec } = require('child_process');

function executeOrder(order) {
    console.log('Analyse de l\'ordre:', order);

    // Nettoyer l'ordre
    const cleanOrder = order.trim();

    // Vérifier si c'est une vraie commande système
    if (isValidCommand(cleanOrder)) {
        console.log('Exécution de la commande:', cleanOrder);

        // Exécuter comme commande système
        exec(cleanOrder, { cwd: process.cwd() }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'exécution: ${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`Erreur stderr: ${stderr}`);
            }

            if (stdout) {
                console.log(`Résultat: ${stdout}`);
            }

            console.log('Commande exécutée avec succès');
        });
    } else {
        console.log('Message reçu mais ce n\'est pas une commande valide:', cleanOrder);
        // Répondre au message sur Telegram si nécessaire
        respondToMessage(cleanOrder);
    }
}

function isValidCommand(order) {
    // Liste des commandes système courantes
    const systemCommands = ['npm', 'node', 'git', 'ls', 'dir', 'cd', 'mkdir', 'echo', 'type', 'copy', 'move', 'del', 'rmdir', 'taskkill', 'start'];

    // Vérifier si ça commence par une commande connue
    const firstWord = order.split(' ')[0];
    return systemCommands.includes(firstWord) || order.startsWith('./') || order.endsWith('.js') || order.endsWith('.ts') || order.endsWith('.tsx');
}

function respondToMessage(message) {
    // Envoyer une réponse automatique sur Telegram
    const responseText = `Message reçu: "${message}". Si vous voulez exécuter une commande, utilisez des commandes système comme 'npm run dev' ou 'node script.js'.`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const params = new URLSearchParams({
        chat_id: TELEGRAM_CHAT_ID,
        text: responseText
    });

    https.get(`${url}?${params}`, (res) => {
        console.log('Réponse envoyée sur Telegram');
    }).on('error', (error) => {
        console.error('Erreur lors de l\'envoi de la réponse:', error);
    });
}

function startMonitoring() {
    console.log('Démarrage de la surveillance Telegram...');
    console.log(`Dernier message ID connu: ${lastMessageId}`);

    // Vérifier immédiatement
    checkForNewMessages();

    // Puis vérifier toutes les 10 secondes
    setInterval(checkForNewMessages, 10000);
}

// Démarrer la surveillance si le script est exécuté directement
if (require.main === module) {
    startMonitoring();
}

module.exports = { checkForNewMessages, executeOrder, startMonitoring };