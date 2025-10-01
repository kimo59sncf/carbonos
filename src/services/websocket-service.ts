/**
 * Service de notifications temps réel avec WebSockets
 */

export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'carbon_alert' | 'regulation' | 'benchmark';
  title: string;
  message: string;
  timestamp: string;
  data?: any;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface RealTimeUpdate {
  type: 'emissions_update' | 'benchmark_update' | 'regulation_update' | 'system_alert';
  data: any;
  timestamp: string;
}

export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private connectionStatus = false;

  constructor(private url: string = 'ws://localhost:3000/ws') {}

  /**
   * Connexion au serveur WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
          console.log('WebSocket connecté');
          this.connectionStatus = true;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Erreur lors du traitement du message WebSocket:', error);
          }
        };

        this.socket.onclose = (event) => {
          console.log('WebSocket déconnecté:', event.code, event.reason);
          this.connectionStatus = false;
          this.handleDisconnection();
        };

        this.socket.onerror = (error) => {
          console.error('Erreur WebSocket:', error);
          this.connectionStatus = false;
          reject(error);
        };

      } catch (error) {
        console.error('Erreur lors de la connexion WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Déconnexion du serveur WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connectionStatus = false;
  }

  /**
   * Vérifie si la connexion est active
   */
  getConnectionStatus(): boolean {
    return this.connectionStatus && this.socket?.readyState === WebSocket.OPEN;
  }

  /**
   * S'abonne à un type d'événement
   */
  subscribe(eventType: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    this.listeners.get(eventType)!.add(callback);

    // Retourne une fonction de désabonnement
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  /**
   * Envoie un message au serveur
   */
  send(eventType: string, data: any): void {
    if (this.getConnectionStatus() && this.socket) {
      this.socket.send(JSON.stringify({
        type: eventType,
        data,
        timestamp: new Date().toISOString(),
      }));
    } else {
      console.warn('WebSocket non connecté, impossible d\'envoyer le message');
    }
  }

  /**
   * Gestion des messages reçus
   */
  private handleMessage(data: any): void {
    const { type, data: messageData, timestamp } = data;

    // Notifier tous les listeners pour ce type d'événement
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(messageData);
        } catch (error) {
          console.error('Erreur dans le callback WebSocket:', error);
        }
      });
    }

    // Gestion spécifique des types de messages
    switch (type) {
      case 'notification':
        this.handleNotification(messageData);
        break;
      case 'emissions_update':
        this.handleEmissionsUpdate(messageData);
        break;
      case 'benchmark_update':
        this.handleBenchmarkUpdate(messageData);
        break;
      case 'regulation_update':
        this.handleRegulationUpdate(messageData);
        break;
      default:
        console.log('Message WebSocket non géré:', type, messageData);
    }
  }

  /**
   * Gestion de la déconnexion
   */
  private handleDisconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        console.log(`Tentative de reconnexion ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}`);
        this.reconnectAttempts++;
        this.connect().catch(error => {
          console.error('Échec de reconnexion WebSocket:', error);
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Nombre maximum de tentatives de reconnexion atteint');
    }
  }

  /**
   * Gestion des notifications
   */
  private handleNotification(notification: NotificationData): void {
    // Afficher la notification dans l'interface
    console.log('Nouvelle notification:', notification);

    // Ici, intégrer avec le système de notifications de l'app
    // Par exemple, déclencher un toast ou une notification push
  }

  /**
   * Gestion des mises à jour d'émissions
   */
  private handleEmissionsUpdate(update: RealTimeUpdate): void {
    console.log('Mise à jour des émissions:', update);

    // Rafraîchir les données d'émissions en temps réel
    // Invalider les queries React Query correspondantes
  }

  /**
   * Gestion des mises à jour de benchmarks
   */
  private handleBenchmarkUpdate(update: RealTimeUpdate): void {
    console.log('Mise à jour des benchmarks:', update);

    // Rafraîchir les données de benchmarks
  }

  /**
   * Gestion des mises à jour réglementaires
   */
  private handleRegulationUpdate(update: RealTimeUpdate): void {
    console.log('Mise à jour réglementaire:', update);

    // Afficher une alerte pour les nouvelles réglementations
  }
}

/**
 * Hook React pour utiliser le service WebSocket
 */
export function useWebSocket(eventType?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const wsService = new WebSocketService();

    wsService.connect().then(() => {
      setIsConnected(true);
    }).catch(error => {
      console.error('Erreur de connexion WebSocket:', error);
      setIsConnected(false);
    });

    const unsubscribe = eventType
      ? wsService.subscribe(eventType, (data) => {
          setLastMessage(data);
        })
      : undefined;

    return () => {
      wsService.disconnect();
      unsubscribe?.();
    };
  }, [eventType]);

  return { isConnected, lastMessage };
}

/**
 * Service de notifications push
 */
export class NotificationService {
  /**
   * Demande la permission de notifications push
   */
  static async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Ce navigateur ne supporte pas les notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    return await Notification.requestPermission();
  }

  /**
   * Envoie une notification push
   */
  static async sendNotification(
    title: string,
    options: NotificationOptions = {}
  ): Promise<void> {
    const permission = await this.requestPermission();

    if (permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        ...options,
      });
    } else {
      console.warn('Permission de notifications refusée');
    }
  }

  /**
   * Envoie une notification carbone spécifique
   */
  static async sendCarbonNotification(
    type: NotificationData['type'],
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    const icons = {
      info: '🔔',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      carbon_alert: '🌱',
      regulation: '📋',
      benchmark: '📊',
    };

    await this.sendNotification(
      `${icons[type]} ${title}`,
      {
        body: message,
        tag: `carbon-${type}`,
        data,
        requireInteraction: type === 'regulation' || type === 'carbon_alert',
      }
    );
  }
}

// Instance singleton
export const webSocketService = new WebSocketService();