const STORAGE_KEY_PREFIX = 'easy-english';

export const STORAGE_KEYS = {
  PREFIX: STORAGE_KEY_PREFIX,
  AUTH: `${STORAGE_KEY_PREFIX}-auth`,
  THEME: `${STORAGE_KEY_PREFIX}-theme`,
  WORKSPACE: `${STORAGE_KEY_PREFIX}-workspace`,
};

export const QUERY_KEYS = {
  AUTH: {
    LOGIN: 'auth-login',
    LOGOUT: 'auth-logout',
    REGISTER: 'auth-register',
  },
  WORKSPACE: 'workspace',
  TOPIC: 'topic',
  WORD: 'word',
  WORD_SENSE: 'word-sense',
  DICTIONARY: 'dictionary',
  ACCOUNT: 'account',
  ME: 'me',
  PRODUCT: 'product',
} as const;


export const API_KEYS = {
  TOPIC: 'topic',
  WORD: 'word',
  USER_WORD_SENSE: 'user-word-sense',
  DICTIONARY_LOOKUP: 'dictionary/lookup',
}