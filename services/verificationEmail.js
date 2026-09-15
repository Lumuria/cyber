/**
 * Signup email verification (client-side).
 *
 * Real emails require a backend endpoint:
 * VITE_VERIFICATION_API_URL -> POST JSON { to, code, purpose }.
 *
 * Local/dev mode: the code can be revealed in UI (or console) for testing.
 */

const PENDING_KEY = 'threatiq_pending_signup';
const CODE_TTL_MS = 15 * 60 * 1000;

export function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function savePendingSignup({ email, password, code }) {
  const payload = {
    email: email.trim().toLowerCase(),
    password,
    code,
    expiresAt: Date.now() + CODE_TTL_MS,
  };
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload));
}

export function loadPendingSignup() {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPendingSignup() {
  sessionStorage.removeItem(PENDING_KEY);
}

export function shouldRevealCodeInUI() {
  return (
    import.meta.env.DEV === true ||
    import.meta.env.VITE_SHOW_VERIFICATION_CODE === 'true'
  );
}

/**
 * @returns {Promise<{ apiUsed: boolean }>}
 */
export async function sendVerificationEmail(email, code) {
  const endpoint = import.meta.env.VITE_VERIFICATION_API_URL;
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email.trim(),
        code,
        purpose: 'signup',
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `HTTP ${res.status}`);
    }
    return { apiUsed: true };
  }

  if (import.meta.env.DEV) {
    console.info(`[Verification] Demo code for ${email}: ${code}`);
    return { apiUsed: false };
  }

  throw new Error('Missing VITE_VERIFICATION_API_URL for production email delivery.');
}
