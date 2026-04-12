import { Shield, AlertTriangle, TrendingUp, Users, Lock, Eye } from 'lucide-react';
import { Button } from '../Button';
import '../Style/Home.css';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const stats = [
    {
      icon: AlertTriangle,
      value: '4,000+',
      label: i18n.language === "ar" ? 'هجمات يومية' : 'Daily Attacks',
      color: 'red'
    },
    {
      icon: TrendingUp,
      value: '67%',
      label: i18n.language === "ar" ? 'نمو التهديدات' : 'Threat Growth',
      color: 'orange'
    },
    {
      icon: Users,
      value: '1.7M',
      label: i18n.language === "ar" ? 'ضحايا سنوياً' : 'Yearly Victims',
      color: 'blue'
    },
    {
      icon: Lock,
      value: '$4.45M',
      label: i18n.language === "ar" ? 'تكلفة الاختراق' : 'Breach Cost',
      color: 'green'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: i18n.language === "ar" ? 'تعلم الحماية' : 'Learn Protection',
      description:
        i18n.language === "ar"
          ? 'اكتشف أحدث طرق الحماية من الهجمات السيبرانية'
          : 'Discover modern cybersecurity protection methods',
      action: () => navigate('/prevention')
    },
    {
      icon: Eye,
      title: i18n.language === "ar" ? 'فهم التهديدات' : 'Understand Threats',
      description:
        i18n.language === "ar"
          ? 'تعرف على أنواع الهجمات السيبرانية'
          : 'Learn about different cyber attacks',
      action: () => navigate('/attacks')
    },
    {
      icon: Lock,
      title: i18n.language === "ar" ? 'أدوات تفاعلية' : 'Interactive Tools',
      description:
        i18n.language === "ar"
          ? 'استخدم أدوات لفحص الأمان'
          : 'Use tools to test your security',
      action: () => navigate('/tools')
    }
  ];

  return (
    <div className="home-page">

      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <Shield className="hero-icon" />

          <h1>{t("homePage.title")}</h1>
          <p>{t("homePage.subtitle")}</p>

          <div className="hero-buttons">
            <Button onClick={() => navigate('/attacks')}>
              {t("homePage.explore_attacks")}
            </Button>

            <Button onClick={() => navigate('/prevention')}>
              {t("homePage.learn_protection")}
            </Button>
          </div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="stats-section">
        <h2>{t("homePage.stats_title")}</h2>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <stat.icon className={`icon ${stat.color}`} />
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="features-section">
        <h2>{t("homePage.features_title")}</h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <feature.icon className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

              <Button onClick={feature.action}>
                {t("homePage.discover_more")}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Warning ===== */}
      <section className="warning-section">
        <AlertTriangle className="warning-icon" />
        <h2>{t("homePage.warning_title")}</h2>

        <div className="warning-grid">
          <div className="warning-card">
            <h3>{i18n.language === "ar" ? "كل 39 ثانية" : "Every 39 seconds"}</h3>
            <p>
              {i18n.language === "ar"
                ? "يحدث هجوم سيبراني"
                : "A cyber attack occurs"}
            </p>
          </div>

          <div className="warning-card">
            <h3>95%</h3>
            <p>
              {i18n.language === "ar"
                ? "بسبب أخطاء بشرية"
                : "Due to human error"}
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <h2>{t("homePage.cta_title")}</h2>
        <p>{t("homePage.cta_text")}</p>

        <Button onClick={() => navigate('/prevention')}>
          {t("homePage.cta_button")}
        </Button>
      </section>

    </div>
  );
};

export default HomePage;