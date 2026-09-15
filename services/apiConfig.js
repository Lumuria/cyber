/**
 * Backend API base URL.
 * Local default: http://localhost:8000/api
 * Production: set VITE_API_URL in .env.production (e.g. https://your-app.up.railway.app/api)
 */
export const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
).replace(/\/$/, '');
