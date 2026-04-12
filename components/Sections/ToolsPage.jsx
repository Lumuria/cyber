import { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { Button } from '../Button';
import '../Style/Tools.css';
import { useTranslation } from "react-i18next";

const ToolsPage = () => {
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [phishingUrl, setPhishingUrl] = useState('');
  const [phishingResult, setPhishingResult] = useState(null);

  // ===== فحص كلمة المرور =====
  const checkPasswordStrength = (pwd) => {
    let score = 0;
    let feedback = [];

    if (pwd.length >= 8) score++;
    else feedback.push(t("toolsPage.feedback_length"));

    if (/[a-z]/.test(pwd)) score++;
    else feedback.push(t("toolsPage.feedback_lower"));

    if (/[A-Z]/.test(pwd)) score++;
    else feedback.push(t("toolsPage.feedback_upper"));

    if (/[0-9]/.test(pwd)) score++;
    else feedback.push(t("toolsPage.feedback_number"));

    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    else feedback.push(t("toolsPage.feedback_symbol"));

    let strength = t("toolsPage.weak");
    let color = 'weak';
    let icon = AlertTriangle;

    if (score >= 5) {
      strength = t("toolsPage.very_strong");
      color = 'strong';
      icon = CheckCircle;
    } else if (score >= 4) {
      strength = t("toolsPage.strong");
      color = 'good';
      icon = Shield;
    } else if (score >= 2) {
      strength = t("toolsPage.medium");
      color = 'medium';
      icon = AlertTriangle;
    }

    return { strength, color, feedback, score, icon };
  };

  const handlePasswordCheck = () => {
    if (!password) return;
    setPasswordStrength(checkPasswordStrength(password));
  };

  // ===== فحص الرابط =====
  const checkPhishingUrl = () => {
    if (!phishingUrl) return;

    let warnings = [];
    let risk = t("toolsPage.low");
    let color = 'safe';

    if (!phishingUrl.startsWith('https://')) {
      warnings.push(t("toolsPage.warning_https"));
      risk = t("toolsPage.medium");
      color = 'warn';
    }

    if (/bit\.ly|tinyurl/i.test(phishingUrl)) {
      warnings.push(t("toolsPage.warning_short"));
      risk = t("toolsPage.high");
      color = 'danger';
    }

    if (warnings.length === 0) {
      warnings.push(t("toolsPage.safe_note"));
    }

    setPhishingResult({ risk, warnings, color });
  };

  return (
    <div className="tools-page">

      {/* ===== Header ===== */}
      <section className="tools-header">
        <Zap className="header-icon" />
        <h1>{t("toolsPage.title")}</h1>
        <p>{t("toolsPage.subtitle")}</p>
      </section>

      <div className="tools-grid">

        {/* ===== Password Checker ===== */}
        <div className="tool-card">
          <div className="tool-title">
            <Lock /> <h2>{t("toolsPage.password_checker")}</h2>
          </div>

          <div className="tool-body">

            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t("toolsPage.password_placeholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button className="gradient-btn" onClick={handlePasswordCheck}>
              {t("toolsPage.check_password")}
            </button>

            {passwordStrength && (
              <div className="result-box">

                <div className={`strength ${passwordStrength.color}`}>
                  {(() => {
                    const Icon = passwordStrength.icon;
                    return <Icon />;
                  })()}
                  <span>{passwordStrength.strength}</span>
                </div>

                <div className="progress-bar">
                  <div
                    className={`progress ${passwordStrength.color}`}
                    style={{
                      width: `${Math.max(10, (passwordStrength.score / 5) * 100)}%`
                    }}
                  ></div>
                </div>

                {passwordStrength.feedback.length > 0 && (
                  <ul className="feedback">
                    {passwordStrength.feedback.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                )}

              </div>
            )}
          </div>
        </div>

        {/* ===== URL Checker ===== */}
        <div className="tool-card">
          <div className="tool-title">
            <Shield /> <h2>{t("toolsPage.url_checker")}</h2>
          </div>

          <div className="tool-body">
            <input
              type="url"
              placeholder={t("toolsPage.url_placeholder")}
              value={phishingUrl}
              onChange={(e) => setPhishingUrl(e.target.value)}
            />

            <button className="gradient-btn" onClick={checkPhishingUrl}>
              {t("toolsPage.check_url")}
            </button>

            {phishingResult && (
              <div className={`result-box ${phishingResult.color}`}>
                <h4>{t("toolsPage.risk_level")}: {phishingResult.risk}</h4>
                <ul>
                  {phishingResult.warnings.map((w, i) => (
                    <li key={i}>⚠️ {w}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

export default ToolsPage;