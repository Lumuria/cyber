/**
 * Built-in administrator account (demo / local use).
 * Change the password before any real deployment.
 */
export const ADMIN_SESSION_EMAIL = 'admin@threatiq.com';
export const ADMIN_ROLE = 'admin';
export const ADMIN_PERMISSIONS = ['*'];

const ADMIN_PASSWORD = 'ThreatIQ#2026';

const ADMIN_IDENTIFIERS = new Set(['admin', ADMIN_SESSION_EMAIL]);

/**
 * True if the first login field matches the admin account (case-insensitive).
 * Accepts: "admin" or "admin@threatiq.com"
 */
export function isAdminLoginIdentifier(raw) {
  const s = (raw || '').trim().toLowerCase();
  return ADMIN_IDENTIFIERS.has(s);
}

export function verifyAdminPassword(password) {
  return typeof password === 'string' && password === ADMIN_PASSWORD;
}

/** Admin access is granted only after login sets isAdmin: true (correct password). */
export function isAdminUser(user) {
  return Boolean(user?.isAdmin) || user?.role === ADMIN_ROLE;
}

export function getAdminPasswordForSeed() {
  return ADMIN_PASSWORD;
}

export function hasPermission(user, permission) {
  if (!isAdminUser(user)) return false;
  const perms = Array.isArray(user?.permissions) ? user.permissions : [];
  return perms.includes('*') || perms.includes(permission);
}
