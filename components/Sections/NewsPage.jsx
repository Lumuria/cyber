import { Calendar, ExternalLink, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { Button } from '../Button';
import '../Style/News.css';
import { useTranslation } from 'react-i18next';
import { useContent } from '../Context/ContentContext';

const NewsPage = () => {
  const { t, i18n } = useTranslation();
  const { news } = useContent();

  const getSeverityClass = (severity) => {
    const sev = severity?.[i18n.language] || '';

    if (sev.includes('Low') || sev.includes('منخفض')) return 'sev-green';
    if (sev.includes('Medium') || sev.includes('متوسطة')) return 'sev-yellow';
    if (sev.includes('High') || sev.includes('عالية')) return 'sev-orange';
    if (sev.includes('Critical') || sev.includes('حرجة')) return 'sev-red';

    return 'sev-gray';
  };

  return (
    <div className="news-page">
      <section className="news-header">
        <TrendingUp className="header-icon" />
        <h1>{t('newsPage.title')}</h1>
        <p>{t('newsPage.subtitle')}</p>
      </section>

      <section className="news-list">
        {news.map((item) => (
          <article key={item.id} className="news-card">
            <div className="news-meta">
              <div className="news-tags">
                <span className="tag">{item.category?.[i18n.language] || '-'}</span>
                <span className={`tag ${getSeverityClass(item.severity)}`}>
                  {item.severity?.[i18n.language] || '-'}
                </span>
              </div>

              <h2>{item.title?.[i18n.language] || '-'}</h2>
              <p className="summary">{item.summary?.[i18n.language] || '-'}</p>

              <div className="meta-info">
                <span>
                  <Calendar size={16} />{' '}
                  {item.date
                    ? new Date(item.date).toLocaleDateString(
                        i18n.language === 'ar' ? 'ar-SA' : 'en-US'
                      )
                    : '-'}
                </span>
                <span>
                  <ExternalLink size={16} /> {item.source?.[i18n.language] || '-'}
                </span>
              </div>
            </div>

            <div className="news-content">
              <p>{item.content?.[i18n.language] || '-'}</p>
            </div>

            <div className="recommendations">
              <h4>
                <Shield size={18} /> {t('newsPage.recommendations')}
              </h4>
              <ul>
                {(item.recommendations || []).map((r, i) => (
                  <li key={i}>- {r?.[i18n.language] || '-'}</li>
                ))}
              </ul>
            </div>

            <div className="actions">
              <Button variant="outline" size="sm">
                {t('newsPage.read_more')}
              </Button>
              <Button variant="outline" size="sm">
                {t('newsPage.share')}
              </Button>
            </div>
          </article>
        ))}
      </section>

      <section className="alert-box">
        <AlertTriangle className="alert-icon" />

        <div>
          <h3>{t('newsPage.alert_title')}</h3>
          <p>{t('newsPage.alert_text')}</p>

          <div className="alert-buttons">
            <Button className="btn-alert">{t('newsPage.subscribe')}</Button>
            <Button variant="outline" size="sm" className="btn-outline-red">
              {t('newsPage.learn_more')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
