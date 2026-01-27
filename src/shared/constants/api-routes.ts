export const API_ROUTES = {
  USERS: {
    ROOT: 'users',
    BY_ID: 'users/:id',
  },
  HEALTH: {
    ROOT: 'health',
    READY: 'health/ready',
    LIVE: 'health/live',
  },
} as const;
