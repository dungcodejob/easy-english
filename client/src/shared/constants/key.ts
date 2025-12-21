const STORAGE_KEY_PREFIX = 'easy-english';

export const STORAGE_KEYS = {
  PREFIX: STORAGE_KEY_PREFIX,
  AUTH: `${STORAGE_KEY_PREFIX}-auth`,
  THEME: `${STORAGE_KEY_PREFIX}-theme`,
};

export const QUERY_KEYS = {
  AUTH: {
    LOGIN: 'auth-login',
    LOGOUT: 'auth-logout',
  },
  TOPIC: 'topic',
  WORD: 'word',
  ACCOUNT: 'account',
  ME: 'me',
  PRODUCT: 'product',
} as const;


export const API_KEYS = {
    TOPIC: 'topic',
    WORD: 'word',
}