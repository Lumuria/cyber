import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Shield,
    ArrowLeft,
    Eye,
    EyeOff,
} from 'lucide-react';

import '../Style/ForgotPassword.css';
import { API_URL } from '../../services/apiConfig';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const language = i18n.language?.startsWith('ar')
        ? 'ar'
        : 'en';

    const isArabic = language === 'ar';

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] =
        useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const [loading, setLoading] = useState(false);

    /*
     * Messages are stored as translation keys.
     * Backend password errors are converted to local keys.
     */
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    /*
     * Translate password reset errors immediately
     * when the language changes.
     */
    const getResetErrorMessage = (errorKey) => {
        switch (errorKey) {
            case 'PASSWORD_REUSE_CURRENT':
                return isArabic
                    ? 'لا يمكنك استخدام كلمة المرور الحالية مرة أخرى.'
                    : 'You cannot reuse your current password.';

            case 'PASSWORD_REUSE_PREVIOUS':
                return isArabic
                    ? 'لا يمكنك استخدام كلمة مرور سابقة مرة أخرى.'
                    : 'You cannot reuse a previous password.';

            case 'PASSWORD_GENERAL_ERROR':
                return isArabic
                    ? 'حدث خطأ أثناء إعادة تعيين كلمة المرور.'
                    : 'Something went wrong while resetting your password.';

            default:
                return errorKey;
        }
    };

    /*
     * Render an error.
     * Translation keys are translated using i18n.
     * Password reset keys use the local helper above.
     */
    const renderError = (errorKey) => {
        if (!errorKey) {
            return null;
        }

        if (
            errorKey ===
            'PASSWORD_REUSE_CURRENT' ||
            errorKey ===
            'PASSWORD_REUSE_PREVIOUS' ||
            errorKey ===
            'PASSWORD_GENERAL_ERROR'
        ) {
            return getResetErrorMessage(errorKey);
        }

        if (errorKey.startsWith('forgotPassword.')) {
            return t(errorKey);
        }

        return errorKey;
    };

    /* =========================================
       Step 1 - Send Reset Code
       ========================================= */

    const handleSendCode = async (e) => {
        e.preventDefault();

        setError('');
        setMessage('');

        if (!email.trim()) {
            setError(
                'forgotPassword.errors.email_required'
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/forgot-password`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const serverError =
                    data?.errors?.email?.[0] ||
                    data?.message;

                if (
                    serverError ===
                    'No account was found with this email address.'
                ) {
                    setError(
                        isArabic
                            ? 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني.'
                            : 'No account was found with this email address.'
                    );
                } else {
                    setError(
                        'forgotPassword.errors.send_failed'
                    );
                }

                return;
            }

            setMessage(
                'forgotPassword.messages.reset_code_sent'
            );

            setStep(2);
        } catch (err) {
            setError(
                'forgotPassword.errors.connection'
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================
       Step 2 - Verify Reset Code
       ========================================= */

    const handleVerifyCode = async (e) => {
        e.preventDefault();

        setError('');
        setMessage('');

        if (!code.trim()) {
            setError(
                'forgotPassword.errors.code_required'
            );
            return;
        }

        if (code.trim().length !== 6) {
            setError(
                'forgotPassword.errors.code_length'
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/verify-reset-code`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        code: code.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const serverError =
                    data?.errors?.code?.[0] ||
                    data?.errors?.email?.[0] ||
                    data?.message;

                if (serverError) {
                    setError(serverError);
                } else {
                    setError(
                        'forgotPassword.errors.verify_failed'
                    );
                }

                return;
            }

            setMessage(
                'forgotPassword.messages.code_verified'
            );

            setStep(3);
        } catch (err) {
            setError(
                'forgotPassword.errors.connection'
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================
       Step 3 - Reset Password
       ========================================= */

    const handleResetPassword = async (e) => {
        e.preventDefault();

        setError('');
        setMessage('');

        if (!password) {
            setError(
                'forgotPassword.errors.password_required'
            );
            return;
        }

        if (password.length < 6) {
            setError(
                'forgotPassword.errors.password_length'
            );
            return;
        }

        if (!passwordConfirmation) {
            setError(
                'forgotPassword.errors.confirm_password_required'
            );
            return;
        }

        if (password !== passwordConfirmation) {
            setError(
                'forgotPassword.errors.password_match'
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/reset-password`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        code: code.trim(),
                        password,
                        password_confirmation:
                            passwordConfirmation,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const serverError =
                    data?.errors?.code?.[0] ||
                    data?.errors?.password?.[0] ||
                    data?.errors?.email?.[0] ||
                    data?.message ||
                    '';

                /*
                 * Password reuse errors
                 * are converted to keys so the language
                 * can change immediately.
                 */
                if (
                    serverError ===
                    'You cannot reuse your current password.'
                ) {
                    setError(
                        'PASSWORD_REUSE_CURRENT'
                    );
                } else if (
                    serverError ===
                    'You cannot reuse a previous password.' ||
                    serverError ===
                    'You cannot reuse previous password.'
                ) {
                    setError(
                        'PASSWORD_REUSE_PREVIOUS'
                    );
                } else {
                    setError(
                        'PASSWORD_GENERAL_ERROR'
                    );
                }

                return;
            }

            setMessage(
                'forgotPassword.messages.password_reset'
            );

            setPassword('');
            setPasswordConfirmation('');

            setShowPassword(false);
            setShowPasswordConfirmation(false);

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(
                'forgotPassword.errors.connection'
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================
       Back
       ========================================= */

    const handleBack = () => {
        setError('');
        setMessage('');

        if (step === 3) {
            setPassword('');
            setPasswordConfirmation('');

            setShowPassword(false);
            setShowPasswordConfirmation(false);

            setStep(2);
            return;
        }

        if (step === 2) {
            setCode('');
            setStep(1);
        }
    };

    return (
        <div
            className={`forgot-password-container ${
                isArabic ? 'rtl' : 'ltr'
            }`}
            dir={isArabic ? 'rtl' : 'ltr'}
        >
            <div className="forgot-password-card">

                {/* =================================
                    Shield Icon
                ================================= */}

                <div className="forgot-password-icon">
                    <Shield size={42} />
                </div>

                {/* =================================
                    Step 1
                ================================= */}

                {step === 1 && (
                    <>
                        <h1 className="forgot-password-title">
                            {t(
                                'forgotPassword.step1.title'
                            )}
                        </h1>

                        <p className="forgot-password-subtitle">
                            {t(
                                'forgotPassword.step1.subtitle'
                            )}
                        </p>

                        {error && (
                            <div
                                className="forgot-error"
                                dir={
                                    isArabic
                                        ? 'rtl'
                                        : 'ltr'
                                }
                            >
                                {renderError(error)}
                            </div>
                        )}

                        {message && (
                            <div
                                className="forgot-success"
                                dir={
                                    isArabic
                                        ? 'rtl'
                                        : 'ltr'
                                }
                            >
                                {t(message)}
                            </div>
                        )}

                        <form
                            onSubmit={handleSendCode}
                        >
                            <input
                                type="email"
                                placeholder={t(
                                    'forgotPassword.step1.email_placeholder'
                                )}
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                autoComplete="email"
                                disabled={loading}
                            />

                            <button
                                type="submit"
                                className="forgot-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? t(
                                          'forgotPassword.buttons.sending'
                                      )
                                    : t(
                                          'forgotPassword.buttons.send_code'
                                      )}
                            </button>
                        </form>
                    </>
                )}

                {/* =================================
                    Step 2
                ================================= */}

                {step === 2 && (
                    <>
                        <h1 className="forgot-password-title">
                            {t(
                                'forgotPassword.step2.title'
                            )}
                        </h1>

                        <p className="forgot-password-subtitle">
                            {t(
                                'forgotPassword.step2.subtitle'
                            )}
                        </p>

                        {error && (
                            <div
                                className="forgot-error"
                                dir={
                                    isArabic
                                        ? 'rtl'
                                        : 'ltr'
                                }
                            >
                                {renderError(error)}
                            </div>
                        )}

                        {message && (
                            <div
                                className="forgot-success"
                                dir={
                                    isArabic
                                        ? 'rtl'
                                        : 'ltr'
                                }
                            >
                                {t(message)}
                            </div>
                        )}

                        <form
                            onSubmit={handleVerifyCode}
                        >
                            <input
                                type="text"
                                className="verification-code-input"
                                placeholder={t(
                                    'forgotPassword.step2.code_placeholder'
                                )}
                                value={code}
                                onChange={(e) =>
                                    setCode(
                                        e.target.value
                                            .replace(
                                                /\D/g,
                                                ''
                                            )
                                            .slice(
                                                0,
                                                6
                                            )
                                    )
                                }
                                inputMode="numeric"
                                maxLength={6}
                                autoComplete="one-time-code"
                                disabled={loading}
                            />

                            <button
                                type="submit"
                                className="forgot-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? t(
                                          'forgotPassword.buttons.verifying'
                                      )
                                    : t(
                                          'forgotPassword.buttons.verify_code'
                                      )}
                            </button>
                        </form>

                        <button
                            type="button"
                            className="forgot-back-button"
                            onClick={handleBack}
                            disabled={loading}
                        >
                            <ArrowLeft size={17} />

                            {t(
                                'forgotPassword.buttons.different_email'
                            )}
                        </button>
                    </>
                )}

                {/* =================================
                    Step 3
                ================================= */}

                {step === 3 && (
                    <>
                        <h1 className="forgot-password-title">
                            {t(
                                'forgotPassword.step3.title'
                            )}
                        </h1>

                        <p className="forgot-password-subtitle">
                            {t(
                                'forgotPassword.step3.subtitle'
                            )}
                        </p>

                        {error && (
                            <div
                                className="forgot-error"
                                dir={
                                    isArabic
                                        ? 'rtl'
                                        : 'ltr'
                                }
                            >
                                {renderError(error)}
                            </div>
                        )}

                        {message && (
                            <div
                                className="forgot-success"
                                dir={
                                    isArabic
                                        ? 'rtl'
                                        : 'ltr'
                                }
                            >
                                {t(message)}
                            </div>
                        )}

                        <form
                            onSubmit={
                                handleResetPassword
                            }
                        >

                            {/* New Password */}
                            <div className="forgot-password-input-wrapper">

                                <input
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder={t(
                                        'forgotPassword.step3.password_placeholder'
                                    )}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="new-password"
                                    disabled={loading}
                                />

                                <button
                                    type="button"
                                    className="forgot-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    disabled={loading}
                                    aria-label={
                                        showPassword
                                            ? isArabic
                                                ? 'إخفاء كلمة المرور'
                                                : 'Hide password'
                                            : isArabic
                                                ? 'إظهار كلمة المرور'
                                                : 'Show password'
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                            {/* Confirm Password */}
                            <div className="forgot-password-input-wrapper">

                                <input
                                    type={
                                        showPasswordConfirmation
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder={t(
                                        'forgotPassword.step3.confirm_password_placeholder'
                                    )}
                                    value={
                                        passwordConfirmation
                                    }
                                    onChange={(e) =>
                                        setPasswordConfirmation(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="new-password"
                                    disabled={loading}
                                />

                                <button
                                    type="button"
                                    className="forgot-password-toggle"
                                    onClick={() =>
                                        setShowPasswordConfirmation(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    disabled={loading}
                                    aria-label={
                                        showPasswordConfirmation
                                            ? isArabic
                                                ? 'إخفاء كلمة المرور'
                                                : 'Hide password'
                                            : isArabic
                                                ? 'إظهار كلمة المرور'
                                                : 'Show password'
                                    }
                                >
                                    {showPasswordConfirmation ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                            <button
                                type="submit"
                                className="forgot-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? t(
                                          'forgotPassword.buttons.resetting'
                                      )
                                    : t(
                                          'forgotPassword.buttons.reset_password'
                                      )}
                            </button>
                        </form>

                        <button
                            type="button"
                            className="forgot-back-button"
                            onClick={handleBack}
                            disabled={loading}
                        >
                            <ArrowLeft size={17} />

                            {t(
                                'forgotPassword.buttons.back_to_verification'
                            )}
                        </button>
                    </>
                )}

                {/* =================================
                    Back to Login
                ================================= */}

                <div className="forgot-login-link">
                    <button
                        type="button"
                        onClick={() =>
                            navigate('/login')
                        }
                    >
                        {t(
                            'forgotPassword.buttons.back_to_login'
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}