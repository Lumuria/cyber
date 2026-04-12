import { Calendar, ExternalLink, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { Button } from '../Button';
import '../Style/News.css';
import { useTranslation } from "react-i18next";

const NewsPage = () => {
  const { t, i18n } = useTranslation();

  const newsData = [
    {
      id: 1,

      title: {
        ar: "اكتشاف ثغرة أمنية جديدة في متصفحات الويب",
        en: "New Security Vulnerability in Web Browsers"
      },

      summary: {
        ar: "باحثون أمنيون يكتشفون ثغرة خطيرة قد تسمح بسرقة البيانات",
        en: "Researchers discovered a critical vulnerability"
      },

      date: "2024-01-15",

      category: {
        ar: "ثغرات أمنية",
        en: "Security"
      },

      severity: {
        ar: "عالية",
        en: "High"
      },

      source: {
        ar: "مركز الأمن السيبراني",
        en: "Cyber Security Center"
      },

      content: {
        ar: "اكتشف فريق من الباحثين الأمنيين ثغرة جديدة في المتصفحات.",
        en: "Researchers found a vulnerability in web browsers."
      },

      recommendations: [
        {
          ar: "تحديث المتصفح إلى أحدث إصدار",
          en: "Update your browser"
        },
        {
          ar: "تجنب المواقع غير الموثوقة",
          en: "Avoid untrusted websites"
        },
        {
          ar: "استخدام أدوات الحماية",
          en: "Use security tools"
        }
      ]
    }
  ];

  const getSeverityClass = (severity) => {
    const sev = severity[i18n.language];

    if (sev.includes("Low") || sev.includes("منخفض")) return 'sev-green';
    if (sev.includes("Medium") || sev.includes("متوسط")) return 'sev-yellow';
    if (sev.includes("High") || sev.includes("عالية")) return 'sev-orange';
    if (sev.includes("Critical") || sev.includes("جداً")) return 'sev-red';

    return 'sev-gray';
  };

  return (
    <div className="news-page">

      <section className="news-header">
        <TrendingUp className="header-icon" />
        <h1>{t("newsPage.title")}</h1>
        <p>{t("newsPage.subtitle")}</p>
      </section>

      <section className="news-list">
        {newsData.map((news) => (
          <article key={news.id} className="news-card">

            <div className="news-meta">
              <div className="news-tags">

                <span className="tag">
                  {news.category[i18n.language]}
                </span>

                <span className={`tag ${getSeverityClass(news.severity)}`}>
                  {news.severity[i18n.language]}
                </span>

              </div>

              <h2>{news.title[i18n.language]}</h2>

              <p className="summary">
                {news.summary[i18n.language]}
              </p>

              <div className="meta-info">
                <span>
                  <Calendar size={16} />{" "}
                  {new Date(news.date).toLocaleDateString(
                    i18n.language === "ar" ? "ar-SA" : "en-US"
                  )}
                </span>

                <span>
                  <ExternalLink size={16} /> {news.source[i18n.language]}
                </span>
              </div>
            </div>

            <div className="news-content">
              <p>{news.content[i18n.language]}</p>
            </div>

            <div className="recommendations">
              <h4>
                <Shield size={18} /> {t("newsPage.recommendations")}
              </h4>

              <ul>
                {news.recommendations.map((r, i) => (
                  <li key={i}>• {r[i18n.language]}</li>
                ))}
              </ul>
            </div>

            <div className="actions">
              <Button variant="outline" size="sm">
                {t("newsPage.read_more")}
              </Button>

              <Button variant="outline" size="sm">
                {t("newsPage.share")}
              </Button>
            </div>

          </article>
        ))}
      </section>

      <section className="alert-box">
        <AlertTriangle className="alert-icon" />

        <div>
          <h3>{t("newsPage.alert_title")}</h3>
          <p>{t("newsPage.alert_text")}</p>

          <div className="alert-buttons">
            <Button className="btn-alert">
              {t("newsPage.subscribe")}
            </Button>

            <Button variant="outline" size="sm" className="btn-outline-red">
              {t("newsPage.learn_more")}
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default NewsPage;