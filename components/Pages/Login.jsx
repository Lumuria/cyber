import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Login.css';
import { Button } from '../Button';
import { useAuth } from '../Context/AuthContext';
import { useTranslation } from "react-i18next";
import {
    ADMIN_SESSION_EMAIL,
    ADMIN_PERMISSIONS,
    ADMIN_ROLE,
    isAdminLoginIdentifier,
    verifyAdminPassword,
} from '../../config/admin';
import { verifyMemberCredentials } from '../../services/userAccounts';

const Login = () => {
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError(t("login.errors.required"));
            return;
        }

        const id = email.trim();

        if (isAdminLoginIdentifier(id)) {
            if (!verifyAdminPassword(password)) {
                setError(t("login.errors.invalid_credentials"));
                return;
            }
            setError('');
            login({
                email: ADMIN_SESSION_EMAIL,
                isAdmin: true,
                role: ADMIN_ROLE,
                permissions: [...ADMIN_PERMISSIONS],
            });
            navigate('/');
            return;
        }

        if (!id.includes('@')) {
            setError(t("login.errors.invalid_email"));
            return;
        }

        const result = verifyMemberCredentials({ email: id, password });
        if (!result.ok) {
            setError(t("login.errors.invalid_credentials"));
            return;
        }

        setError('');
        login(result.user);
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <h2 className="login-title">
                    {t("login.title")}
                </h2>

                <p className="login-subtitle">
                    {t("login.subtitle")}
                </p>

                <form onSubmit={handleLogin}>

                    <input
                        type="text"
                        autoComplete="username"
                        placeholder={t("login.email_or_user")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder={t("login.password")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="error-message">{error}</p>}

                    <Button className="btn-primary" type="submit">
                        {t("login.button")}
                    </Button>

                </form>

                <div className="login-links">
                    <p>
                        {t("login.no_account")}{" "}
                        <a href="/signup">{t("login.signup")}</a>
                    </p>

                    <p>
                        <a href="/forgot-password">
                            {t("login.forgot")}
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;
