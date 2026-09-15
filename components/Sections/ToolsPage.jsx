import { useState } from 'react';
import {
    Lock,
    Eye,
    EyeOff,
    Shield,
    AlertTriangle,
    CheckCircle,
    Zap,
} from 'lucide-react';
import '../Style/Tools.css';
import { useTranslation } from 'react-i18next';
import { useContent } from '../Context/ContentContext';
import { API_URL } from '../../services/apiConfig';

const ToolsPage = () => {
    const { t, i18n } = useTranslation();
    const { tools } = useContent();

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(null);
    const [phishingUrl, setPhishingUrl] = useState('');
    const [phishingResult, setPhishingResult] = useState(null);

    const checkPasswordStrength = (pwd) => {
        let score = 0;
        const feedback = [];

        if (pwd.length >= 8) {
            score++;
        } else {
            feedback.push(t('toolsPage.feedback_length'));
        }

        if (/[a-z]/.test(pwd)) {
            score++;
        } else {
            feedback.push(t('toolsPage.feedback_lower'));
        }

        if (/[A-Z]/.test(pwd)) {
            score++;
        } else {
            feedback.push(t('toolsPage.feedback_upper'));
        }

        if (/[0-9]/.test(pwd)) {
            score++;
        } else {
            feedback.push(t('toolsPage.feedback_number'));
        }

        if (/[^A-Za-z0-9]/.test(pwd)) {
            score++;
        } else {
            feedback.push(t('toolsPage.feedback_symbol'));
        }

        let strength = t('toolsPage.weak');
        let color = 'weak';
        let icon = AlertTriangle;

        if (score >= 5) {
            strength = t('toolsPage.very_strong');
            color = 'strong';
            icon = CheckCircle;
        } else if (score >= 4) {
            strength = t('toolsPage.strong');
            color = 'good';
            icon = Shield;
        } else if (score >= 2) {
            strength = t('toolsPage.medium');
            color = 'medium';
            icon = AlertTriangle;
        }

        return {
            strength,
            color,
            feedback,
            score,
            icon,
        };
    };

    const handlePasswordCheck = () => {
        if (!password.trim()) {
            setPasswordStrength(null);
            return;
        }

        setPasswordStrength(
            checkPasswordStrength(password)
        );
    };

    const getRiskKey = (risk) => {
        if (!risk) return 'low';

        const value = String(risk)
            .toLowerCase()
            .trim();

        if (
            value === 'low' ||
            value === 'منخفض'
        ) {
            return 'low';
        }

        if (
            value === 'medium' ||
            value === 'متوسط' ||
            value === 'متوسطة'
        ) {
            return 'medium';
        }

        if (
            value === 'high' ||
            value === 'مرتفع' ||
            value === 'مرتفعة'
        ) {
            return 'high';
        }

        return 'low';
    };

    const getWarningKey = (warning) => {
        if (!warning) return null;

        const value = String(warning).trim();

        const warningMap = {
            'The URL does not use HTTPS.':
                'warning_https',

            'The URL uses a shortened link service.':
                'warning_short',

            'The URL uses an IP address instead of a domain name.':
                'warning_ip',

            'The URL contains an @ symbol, which can be used to hide the real destination.':
                'warning_at_symbol',

            'The domain name is unusually long.':
                'warning_long_domain',

            'The domain contains an unusually high number of subdomains.':
                'warning_subdomains',

            'The URL contains a keyword that may be associated with sensitive information.':
                'warning_sensitive_keyword',

            'No obvious phishing indicators were detected.':
                'safe_note',
        };

        return warningMap[value] || value;
    };

    const getWarningText = (warning) => {
        if (!warning) return '';

        const key = getWarningKey(warning);

        const translationKeys = [
            'warning_https',
            'warning_short',
            'warning_ip',
            'warning_at_symbol',
            'warning_long_domain',
            'warning_subdomains',
            'warning_sensitive_keyword',
            'safe_note',
            'invalid_url',
        ];

        if (translationKeys.includes(key)) {
            return t(`toolsPage.${key}`);
        }

        return warning;
    };

    const checkPhishingUrl = async () => {
        if (!phishingUrl.trim()) {
            setPhishingResult(null);
            return;
        }

        setPhishingResult(null);

        try {
            const response = await fetch(
                `${API_URL}/tools/check-url`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        url: phishingUrl.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPhishingResult({
                    riskKey: 'high',
                    warningKeys: [
                        data?.message ||
                            'invalid_url',
                    ],
                    color: 'danger',
                });

                return;
            }

            const warningKeys =
                data.warningKeys ||
                data.warning_keys ||
                data.warnings?.map(getWarningKey) ||
                [];

            setPhishingResult({
                riskKey:
                    data.risk_key ||
                    getRiskKey(data.risk),
                warningKeys,
                color: data.color || 'safe',
            });
        } catch (error) {
            console.error(
                'URL check error:',
                error
            );

            setPhishingResult({
                riskKey: 'high',
                warningKeys: ['invalid_url'],
                color: 'danger',
            });
        }
    };

    return (
        <div className="tools-page">
            <section className="tools-header">
                <Zap className="header-icon" />

                <h1>
                    {t('toolsPage.title')}
                </h1>

                <p>
                    {t('toolsPage.subtitle')}
                </p>
            </section>

            <div className="tools-grid">
                <div className="tool-card">
                    <div className="tool-title">
                        <Lock />

                        <h2>
                            {t(
                                'toolsPage.password_checker'
                            )}
                        </h2>
                    </div>

                    <div className="tool-body">
                        <div className="input-wrapper">
                            <input
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                placeholder={t(
                                    'toolsPage.password_placeholder'
                                )}
                                value={password}
                                onChange={(e) => {
                                    const value =
                                        e.target.value;

                                    setPassword(value);

                                    if (!value.trim()) {
                                        setPasswordStrength(
                                            null
                                        );
                                    }
                                }}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword ? (
                                    <EyeOff />
                                ) : (
                                    <Eye />
                                )}
                            </button>
                        </div>

                        <button
                            type="button"
                            className="gradient-btn"
                            onClick={
                                handlePasswordCheck
                            }
                        >
                            {t(
                                'toolsPage.check_password'
                            )}
                        </button>

                        {passwordStrength && (
                            <div className="result-box">
                                <div
                                    className={`strength ${passwordStrength.color}`}
                                >
                                    {(() => {
                                        const Icon =
                                            passwordStrength.icon;

                                        return <Icon />;
                                    })()}

                                    <span>
                                        {
                                            passwordStrength.strength
                                        }
                                    </span>
                                </div>

                                <div className="progress-bar">
                                    <div
                                        className={`progress ${passwordStrength.color}`}
                                        style={{
                                            width: `${
                                                Math.max(
                                                    10,
                                                    (passwordStrength.score /
                                                        5) *
                                                        100
                                                )
                                            }%`,
                                        }}
                                    />
                                </div>

                                {passwordStrength.feedback
                                    .length > 0 && (
                                    <ul className="feedback">
                                        {passwordStrength.feedback.map(
                                            (
                                                feedback,
                                                index
                                            ) => (
                                                <li
                                                    key={
                                                        index
                                                    }
                                                >
                                                    •{' '}
                                                    {
                                                        feedback
                                                    }
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="tool-card">
                    <div className="tool-title">
                        <Shield />

                        <h2>
                            {t(
                                'toolsPage.url_checker'
                            )}
                        </h2>
                    </div>

                    <div className="tool-body">
                        <input
                            type="url"
                            placeholder={t(
                                'toolsPage.url_placeholder'
                            )}
                            value={phishingUrl}
                            onChange={(e) => {
                                const value =
                                    e.target.value;

                                setPhishingUrl(value);

                                if (!value.trim()) {
                                    setPhishingResult(
                                        null
                                    );
                                }
                            }}
                        />

                        <button
                            type="button"
                            className="gradient-btn"
                            onClick={
                                checkPhishingUrl
                            }
                        >
                            {t(
                                'toolsPage.check_url'
                            )}
                        </button>

                        {phishingResult && (
                            <div
                                className={`result-box ${phishingResult.color}`}
                            >
                                <h4>
                                    {t(
                                        'toolsPage.risk_level'
                                    )}
                                    :{' '}
                                    {t(
                                        `toolsPage.${phishingResult.riskKey}`
                                    )}
                                </h4>

                                <ul>
                                    {phishingResult.warningKeys.map(
                                        (
                                            warning,
                                            index
                                        ) => (
                                            <li
                                                key={
                                                    index
                                                }
                                            >
                                                ⚠️{' '}
                                                {getWarningText(
                                                    warning
                                                )}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <section className="tips">
                <h2>
                    {i18n.language === 'ar'
                        ? 'تحديثات قسم الأدوات'
                        : 'Tools Section Updates'}
                </h2>

                <div className="tips-grid">
                    {tools.map((item) => (
                        <div
                            key={item.id}
                            className="tip"
                        >
                            <div className="tip-icon">
                                <Shield />
                            </div>

                            <h3>
                                {item.title?.[
                                    i18n.language
                                ] || '-'}
                            </h3>

                            <p>
                                {item.description?.[
                                    i18n.language
                                ] || '-'}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ToolsPage;