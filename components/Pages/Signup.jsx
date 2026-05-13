import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Style/Signup.css';
import { Button } from '../Button';
import { useAuth } from '../Context/AuthContext';
import { useTranslation } from 'react-i18next';
import { isAdminLoginIdentifier } from '../../config/admin';
import { getUserByEmail, registerVerifiedUser } from '../../services/userAccounts';
import {
  generateVerificationCode,
  savePendingSignup,
  loadPendingSignup,
  clearPendingSignup,
  sendVerificationEmail,
  shouldRevealCodeInUI,
} from '../../services/verificationEmail';

const Signup = () => {
  const { t } = useTranslation();

  const [step, setStep] = useState('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [resendTick, setResendTick] = useState(0);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (step !== 'verify') return;
    if (!loadPendingSignup()) {
      setStep('form');
      setError(t('signup.verify.session_expired'));
    }
  }, [step, t]);

  const pending = loadPendingSignup();
  const revealCode = shouldRevealCodeInUI() && pending && step === 'verify';

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError(t('signup.errors.required'));
      return false;
    }
    if (isAdminLoginIdentifier(email)) {
      setError(t('signup.errors.reserved'));
      return false;
    }
    if (getUserByEmail(email)) {
      setError(t('signup.verify.already_exists'));
      return false;
    }
    if (!email.trim().includes('@')) {
      setError(t('signup.errors.invalid_email'));
      return false;
    }
    if (password.length < 6) {
      setError(t('signup.errors.password_length'));
      return false;
    }
    if (password !== confirmPassword) {
      setError(t('signup.errors.password_match'));
      return false;
    }
    return true;
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    const trimmed = email.trim();
    const code = generateVerificationCode();
    savePendingSignup({ email: trimmed, password, code });

    setSending(true);
    try {
      await sendVerificationEmail(trimmed, code);
      setStep('verify');
      setCodeInput('');
    } catch (err) {
      clearPendingSignup();
      setError(t('signup.verify.send_failed'));
    } finally {
      setSending(false);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');
    const p = loadPendingSignup();
    if (!p) {
      setError(t('signup.verify.session_expired'));
      setStep('form');
      return;
    }
    if (Date.now() > p.expiresAt) {
      clearPendingSignup();
      setError(t('signup.verify.expired'));
      setStep('form');
      return;
    }
    const entered = codeInput.replace(/\D/g, '');
    if (entered.length !== 6) {
      setError(t('signup.verify.code_invalid'));
      return;
    }
    if (entered !== p.code) {
      setError(t('signup.verify.code_wrong'));
      return;
    }
    const registered = registerVerifiedUser({ email: p.email, password: p.password });
    if (!registered.ok) {
      setError(t('signup.verify.already_exists'));
      return;
    }

    login({ email: p.email, isAdmin: false, role: 'member', permissions: [] });
    clearPendingSignup();
    navigate('/');
  };

  const handleResend = async () => {
    setError('');
    const p = loadPendingSignup();
    if (!p) {
      setError(t('signup.verify.session_expired'));
      setStep('form');
      return;
    }
    if (Date.now() > p.expiresAt) {
      clearPendingSignup();
      setError(t('signup.verify.expired'));
      setStep('form');
      return;
    }
    const newCode = generateVerificationCode();
    savePendingSignup({
      email: p.email,
      password: p.password,
      code: newCode,
    });
    setSending(true);
    try {
      await sendVerificationEmail(p.email, newCode);
      setResendTick((x) => x + 1);
      setCodeInput('');
    } catch {
      setError(t('signup.verify.send_failed'));
    } finally {
      setSending(false);
    }
  };

  const handleBackToForm = () => {
    clearPendingSignup();
    setStep('form');
    setCodeInput('');
    setError('');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {step === 'form' ? (
          <>
            <h2 className="signup-title">{t('signup.title')}</h2>
            <p className="signup-subtitle">{t('signup.subtitle')}</p>

            <form onSubmit={handleRequestCode}>
              <input
                type="email"
                placeholder={t('signup.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              <input
                type="password"
                placeholder={t('signup.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />

              <input
                type="password"
                placeholder={t('signup.confirm_password')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />

              {error && <p className="error-message">{error}</p>}

              <Button className="btn-primary" type="submit" disabled={sending}>
                {sending ? t('signup.sending') : t('signup.send_code')}
              </Button>
            </form>

            <p className="signup-verify-note">{t('signup.verify.note_form')}</p>
          </>
        ) : (
          <>
            <h2 className="signup-title">{t('signup.verify.title')}</h2>
            <p className="signup-subtitle">
              {t('signup.verify.sent_to')} <strong>{pending?.email}</strong>
            </p>

            {revealCode && (
              <div className="signup-dev-code" key={resendTick}>
                <span className="signup-dev-code-label">{t('signup.verify.demo_code_label')}</span>
                <span className="signup-dev-code-value" aria-live="polite">
                  {pending?.code}
                </span>
                <p className="signup-dev-code-hint">{t('signup.verify.demo_code_hint')}</p>
              </div>
            )}

            {!revealCode && (
              <p className="signup-verify-note">{t('signup.verify.note_inbox')}</p>
            )}

            <form onSubmit={handleVerify}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder={t('signup.verify.code_placeholder')}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="signup-code-input"
                autoComplete="one-time-code"
              />

              {error && <p className="error-message">{error}</p>}

              <Button className="btn-primary" type="submit">
                {t('signup.verify.confirm')}
              </Button>
            </form>

            <div className="signup-verify-actions">
              <button type="button" className="signup-text-btn" onClick={handleResend} disabled={sending}>
                {sending ? t('signup.sending') : t('signup.verify.resend')}
              </button>
              <span className="signup-verify-sep">·</span>
              <button type="button" className="signup-text-btn" onClick={handleBackToForm}>
                {t('signup.verify.edit_email')}
              </button>
            </div>
          </>
        )}

        <div className="signup-links">
          <p>
            {t('signup.have_account')}{' '}
            <Link to="/login">{t('signup.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
