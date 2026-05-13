import {
  ADMIN_PERMISSIONS,
  ADMIN_ROLE,
  ADMIN_SESSION_EMAIL,
} from '../config/admin';

const USERS_KEY = 'threatiq_users_v1';

function hasWindow() {
  return typeof window !== 'undefined';
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function readUsers() {
  if (!hasWindow()) return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  if (!hasWindow()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function ensureAdminSeed(adminPassword) {
  const users = readUsers();
  const adminEmail = normalizeEmail(ADMIN_SESSION_EMAIL);
  const exists = users.some((u) => normalizeEmail(u.email) === adminEmail);
  if (exists) return;

  users.push({
    email: adminEmail,
    password: adminPassword,
    role: ADMIN_ROLE,
    isAdmin: true,
    isVerified: true,
    permissions: [...ADMIN_PERMISSIONS],
    createdAt: Date.now(),
    verifiedAt: Date.now(),
  });
  writeUsers(users);
}

export function getAllUsers() {
  return readUsers();
}

export function getUserByEmail(email) {
  const target = normalizeEmail(email);
  if (!target) return null;
  return readUsers().find((u) => normalizeEmail(u.email) === target) || null;
}

export function registerVerifiedUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return { ok: false, reason: 'invalid_email' };
  }

  const users = readUsers();
  const exists = users.some((u) => normalizeEmail(u.email) === normalizedEmail);
  if (exists) {
    return { ok: false, reason: 'already_exists' };
  }

  users.push({
    email: normalizedEmail,
    password,
    role: 'member',
    isAdmin: false,
    isVerified: true,
    permissions: [],
    createdAt: Date.now(),
    verifiedAt: Date.now(),
  });
  writeUsers(users);
  return { ok: true };
}

export function verifyMemberCredentials({ email, password }) {
  const account = getUserByEmail(email);
  if (!account) {
    return { ok: false, reason: 'not_found' };
  }
  if (!account.isVerified) {
    return { ok: false, reason: 'not_verified' };
  }
  if (account.password !== password) {
    return { ok: false, reason: 'wrong_password' };
  }

  return {
    ok: true,
    user: {
      email: account.email,
      role: account.role || 'member',
      isAdmin: Boolean(account.isAdmin),
      permissions: Array.isArray(account.permissions) ? account.permissions : [],
    },
  };
}
