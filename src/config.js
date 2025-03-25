// Configuration de base pour le frontend
const config = {
  // URL de l'API backend
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Configuration des endpoints API
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH_TOKEN: '/auth/refresh-token',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    USER: {
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
      CHANGE_PASSWORD: '/users/change-password',
    },
    EMISSIONS: {
      GET_ALL: '/emissions',
      GET_BY_ID: '/emissions/:id',
      CREATE: '/emissions',
      UPDATE: '/emissions/:id',
      DELETE: '/emissions/:id',
      CALCULATE: '/emissions/calculate',
    },
    REPORTS: {
      GENERATE: '/reports/generate',
      GET_ALL: '/reports',
      GET_BY_ID: '/reports/:id',
      EXPORT: '/reports/:id/export',
    },
    DASHBOARD: {
      SUMMARY: '/dashboard/summary',
      CHARTS: '/dashboard/charts',
      ALERTS: '/dashboard/alerts',
    },
    BENCHMARKS: {
      INDUSTRY: '/benchmarks/industry',
      REGION: '/benchmarks/region',
      SIZE: '/benchmarks/size',
    },
  },
  
  // Configuration des timeouts
  TIMEOUTS: {
    API_REQUEST: 30000, // 30 secondes
  },
  
  // Configuration des options de stockage local
  STORAGE: {
    TOKEN_KEY: 'carbonos_auth_token',
    USER_KEY: 'carbonos_user',
    PREFERENCES_KEY: 'carbonos_preferences',
  },
  
  // Configuration des options de date
  DATE_FORMAT: {
    DISPLAY: 'DD/MM/YYYY',
    API: 'YYYY-MM-DD',
  },
  
  // Configuration des options de pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  },
  
  // Configuration des options de thème
  THEME: {
    PRIMARY_COLOR: '#4CAF50', // Vert pour symboliser l'écologie
    SECONDARY_COLOR: '#2196F3', // Bleu pour la technologie
    ERROR_COLOR: '#F44336',
    WARNING_COLOR: '#FF9800',
    INFO_COLOR: '#2196F3',
    SUCCESS_COLOR: '#4CAF50',
  },
};

export default config;
