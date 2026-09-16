import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../Style/Signup.css';
import { Button } from '../Button';
import { useAuth } from '../Context/AuthContext';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../services/apiConfig';

const Signup = () => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [demoCode, setDemoCode] = useState('');
    const [step, setStep] = useState('form');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (
            !name.trim() ||
            !username.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            setError(t('signup.errors.required'));
            return;
        }

        if (!email.trim().includes('@')) {
            setError(t('signup.errors.invalid_email'));
            return;
        }

        if (password.length < 6) {
            setError(t('signup.errors.password_length'));
            return;
        }

        if (password !== confirmPassword) {
            setError(t('signup.errors.password_match'));
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    username: username.trim(),
                    email: email.trim(),
                    password,
                    password_confirmation: confirmPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const firstError = data?.errors
                    ? Object.values(data.errors)[0]?.[0]
                    : null;

                setError(
                    firstError ||
                    data?.message ||
                    'Unable to create account.'
                );

                return;
            }

            setStep('verify');
            setCode('');
            setDemoCode('');
        } catch (error) {
            console.error('Signup error:', error);
            setError('Unable to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        const cleanCode = code.replace(/\D/g, '');

        if (cleanCode.length !== 6) {
            setError('Please enter the 6-digit verification code.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    code: cleanCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const firstError = data?.errors
                    ? Object.values(data.errors)[0]?.[0]
                    : null;

                setError(
                    firstError ||
                    data?.message ||
                    'Verification code is incorrect.'
                );

                return;
            }

            login({
                id: data.user.id,
                name: data.user.name,
                username: data.user.username,
                email: data.user.email,
                avatar: data.user.avatar || null,
                role: data.user.role || 'member',
                isAdmin: Boolean(data.user.is_admin),
                permissions: Array.isArray(data.user.permissions)
                    ? data.user.permissions
                    : [],
                token: data.token,
            });

            navigate('/');
        } catch (error) {
            console.error('Verification error:', error);
            setError('Unable to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep('form');
        setCode('');
        setError('');
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                {step === 'form' && (
                    <>
                        <h2 className="signup-title">
                            {t('signup.title')}
                        </h2>

                        <p className="signup-subtitle">
                            {t('signup.subtitle')}
                        </p>

                        <form onSubmit={handleSignup}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                            />

                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />

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
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                autoComplete="new-password"
                            />

                            {error && (
                                <p className="error-message">
                                    {error}
                                </p>
                            )}

                            <Button
                                className="btn-primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? 'Creating...'
                                    : t('signup.button')}
                            </Button>
                        </form>
                    </>
                )}

                {step === 'verify' && (
                    <>
                        <h2 className="signup-title">
                            Verify Your Email
                        </h2>

                        <p className="signup-subtitle">
                            We sent a 6-digit verification code to:
                            <br />
                            <strong>{email}</strong>
                        </p>

                        <form onSubmit={handleVerify}>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="Enter verification code"
                                value={code}
                                onChange={(e) =>
                                    setCode(
                                        e.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 6)
                                    )
                                }
                                autoComplete="one-time-code"
                                autoFocus
                            />

                            {error && (
                                <p className="error-message">
                                    {error}
                                </p>
                            )}

                            <Button
                                className="btn-primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? 'Verifying...'
                                    : 'Verify Email'}
                            </Button>
                        </form>

                        <button
                            type="button"
                            className="signup-text-btn"
                            onClick={handleBack}
                        >
                            Change email
                        </button>
                    </>
                )}

                <div className="signup-links">
                    <p>
                        {t('signup.have_account')}{' '}
                        <Link to="/login">
                            {t('signup.login')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;