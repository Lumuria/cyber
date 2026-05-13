import { Shield, AlertTriangle, TrendingUp, Users, Lock, Eye } from 'lucide-react';
import { Button } from '../Button';
import '../Style/Home.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const stats = [
    {
      icon: AlertTriangle,
      value: '4,000+',
      label: i18n.language === 'ar' ? 'هجمات يومية' : 'Daily Attacks',
      color: 'red',
    },
    {
      icon: TrendingUp,
      value: '67%',
      label: i18n.language === 'ar' ? 'نمو التهديدات' : 'Threat Growth',
      color: 'orange',
    },
    {
      icon: Users,
      value: '1.7M',
      label: i18n.language === 'ar' ? 'ضحايا سنوياً' : 'Yearly Victims',
      color: 'blue',
    },
    {
      icon: Lock,
      value: '$4.45M',
      label: i18n.language === 'ar' ? 'تكلفة الاختراق' : 'Breach Cost',
      color: 'green',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: i18n.language === 'ar' ? 'تعلم الحماية' : 'Learn Protection',
      description:
        i18n.language === 'ar'
          ? 'اكتشف طرقاً عملية تقلل من الخطر السيبراني قبل وقوع الحوادث.'
          : 'Discover modern cybersecurity protection methods you can apply quickly.',
      action: () => navigate('/prevention'),
    },
    {
      icon: Eye,
      title: i18n.language === 'ar' ? 'فهم التهديدات' : 'Understand Threats',
      description:
        i18n.language === 'ar'
          ? 'تعرف على أنماط الهجمات والإشارات التحذيرية وسلوك المهاجمين.'
          : 'Learn about attack categories, indicators, and common tactics.',
      action: () => navigate('/attacks'),
    },
    {
      icon: Lock,
      title: i18n.language === 'ar' ? 'أدوات تفاعلية' : 'Interactive Tools',
      description:
        i18n.language === 'ar'
          ? 'استخدم أدوات سريعة لاختبار ممارساتك الأمنية اليومية وتحسينها.'
          : 'Use quick tools to test habits and improve your security baseline.',
      action: () => navigate('/tools'),
    },
  ];

  const checklist = [
    t('preventionPage.tip1_title'),
    t('preventionPage.tip2_title'),
    t('preventionPage.tip3_title'),
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-shell">
          <div className="hero-content">
            <span className="hero-badge">ThreatIQ</span>
            <Shield className="hero-icon" />
            <h1>{t('homePage.title')}</h1>
            <p>{t('homePage.subtitle')}</p>

            <div className="hero-buttons">
              <Button onClick={() => navigate('/attacks')}>{t('homePage.explore_attacks')}</Button>
              <Button variant="outline" onClick={() => navigate('/prevention')}>
                {t('homePage.learn_protection')}
              </Button>
            </div>

            <div className="hero-trust">
              <span>{t('prevention')}</span>
              <span>{t('attacks_nav')}</span>
              <span>{t('tools')}</span>
            </div>
          </div>

          <aside className="hero-panel">
            <span className="hero-panel-kicker">{t('homePage.warning_title')}</span>
            <h2>{t('homePage.stats_title')}</h2>

            <div className="hero-panel-grid">
              {stats.slice(0, 2).map((stat, index) => (
                <article key={index} className="hero-panel-card">
                  <stat.icon className={`icon ${stat.color}`} />
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>

            <div className="hero-checklist">
              {checklist.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <h2>{t('homePage.stats_title')}</h2>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <article key={index} className="stat-card">
                <stat.icon className={`icon ${stat.color}`} />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>{t('homePage.features_title')}</h2>

          <div className="features-grid">
            {features.map((feature, index) => (
              <article key={index} className="feature-card">
                <feature.icon className="feature-icon" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <Button onClick={feature.action}>{t('homePage.discover_more')}</Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="warning-section">
        <div className="container">
          <AlertTriangle className="warning-icon" />
          <h2>{t('homePage.warning_title')}</h2>

          <div className="warning-grid">
            <article className="warning-card">
              <h3>{i18n.language === 'ar' ? 'كل 39 ثانية' : 'Every 39 seconds'}</h3>
              <p>{i18n.language === 'ar' ? 'يحدث هجوم سيبراني.' : 'A cyber attack occurs.'}</p>
            </article>

            <article className="warning-card">
              <h3>95%</h3>
              <p>{i18n.language === 'ar' ? 'بسبب أخطاء بشرية' : 'Due to human error'}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>{t('homePage.cta_title')}</h2>
          <p>{t('homePage.cta_text')}</p>
          <Button onClick={() => navigate('/prevention')}>{t('homePage.cta_button')}</Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
