export const APP_ROUTES = {
  ROOT: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  ONBOARDING: {
    WORKSPACE: '/onboarding/workspace',
  },
  TOPIC: {
    LIST: '/topic',
    DETAIL: '/topic/$topicId',
  },
} as const;
