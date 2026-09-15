import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../Style/Login.css';
import { Button } from '../Button';
import { useAuth } from '../Context/AuthContext';
import { API_URL } from '../../services/apiConfig';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loginValue, setLoginValue] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        setError('');

        if (!loginValue.trim() || !password) {
            setError(t('login.errors.required'));
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        login: loginValue.trim(),
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data?.errors?.login?.[0] ||
                    data?.message ||
                    t('login.errors.invalid_credentials')
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
                permissions: Array.isArray(
                    data.user.permissions
                )
                    ? data.user.permissions
                    : [],
                token: data.token,
            });

            navigate('/');
        } catch (error) {
            console.error('Login error:', error);

            setError(
                'Unable to connect to the server.'
            );
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">
                    {t('login.title')}
                </h2>

                <p className="login-subtitle">
                    {t('login.subtitle')}
                </p>

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        autoComplete="username"
                        placeholder={t(
                            'login.email_or_user'
                        )}
                        value={loginValue}
                        onChange={(e) =>
                            setLoginValue(
                                e.target.value
                            )
                        }
                    />

                    <input
                        type="password"
                        autoComplete="current-password"
                        placeholder={t(
                            'login.password'
                        )}
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                    />

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <Button
                        className="btn-primary"
                        type="submit"
                    >
                        {t('login.button')}
                    </Button>
                </form>

                <div className="login-links">
                    <p>
                        {t('login.no_account')}{' '}
                        <a href="/signup">
                            {t('login.signup')}
                        </a>
                    </p>

                    <p>
    <Link
        to="/forgot-password"
        className="forgot-password-link"
        dir="ltr"
    >
        {t('login.forgot')}
    </Link>
</p>
                </div>
            </div>
        </div>
    );
};

export default Login;