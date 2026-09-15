import {
  Calendar,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  Shield,
  Bell,
  CheckCircle,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import '../Style/News.css';
import { useTranslation } from 'react-i18next';
import { useContent } from '../Context/ContentContext';
import { useAuth } from '../Context/AuthContext';

const NewsPage = () => {
  const { t, i18n } = useTranslation();
  const { news } = useContent();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [expandedId, setExpandedId] = useState(null);
  const [notificationModalOpen, setNotificationModalOpen] =
    useState(false);
  const [notificationModalType, setNotificationModalType] =
    useState('success');

  const getSeverityClass = (severity) => {
    const sev = severity?.[i18n.language] || '';

    if (
      sev.includes('Low') ||
      sev.includes('منخفض')
    ) {
      return 'sev-green';
    }

    if (
      sev.includes('Medium') ||
      sev.includes('متوسطة')
    ) {
      return 'sev-yellow';
    }

    if (
      sev.includes('High') ||
      sev.includes('عالية')
    ) {
      return 'sev-orange';
    }

    if (
      sev.includes('Critical') ||
      sev.includes('حرجة')
    ) {
      return 'sev-red';
    }

    return 'sev-gray';
  };

  const handleReadMore = (id) => {
    setExpandedId((current) =>
      current === id ? null : id
    );
  };

  const handleShare = async (item) => {
    const title =
      item.title?.[i18n.language] || '';

    const text =
      item.summary?.[i18n.language] || '';

    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setNotificationModalType('share');
      setNotificationModalOpen(true);
    } catch (error) {
      if (error?.name === 'AbortError') {
        return;
      }

      console.error(
        'Share error:',
        error
      );
    }
  };

  const handleSubscribe = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setNotificationModalType('success');
    setNotificationModalOpen(true);
  };

  const closeNotificationModal = () => {
    setNotificationModalOpen(false);
  };

  const handleLearnMore = () => {
    navigate('/prevention');
  };

  const isArabic = i18n.language === 'ar';

  return (
    <div className="news-page">
      <section className="news-header">
        <TrendingUp className="header-icon" />

        <h1>{t('newsPage.title')}</h1>

        <p>{t('newsPage.subtitle')}</p>
      </section>

      <section className="news-list">
        {news.map((item) => {
          const isExpanded =
            expandedId === item.id;

          return (
            <article
              key={item.id}
              className="news-card"
            >
              <div className="news-meta">
                <div className="news-tags">
                  <span className="tag">
                    {item.category?.[
                      i18n.language
                    ] || '-'}
                  </span>

                  <span
                    className={`tag ${getSeverityClass(
                      item.severity
                    )}`}
                  >
                    {item.severity?.[
                      i18n.language
                    ] || '-'}
                  </span>
                </div>

                <h2>
                  {item.title?.[
                    i18n.language
                  ] || '-'}
                </h2>

                <p className="summary">
                  {item.summary?.[
                    i18n.language
                  ] || '-'}
                </p>

                <div className="meta-info">
                  <span>
                    <Calendar size={16} />

                    {item.date
                      ? new Date(
                          item.date
                        ).toLocaleDateString(
                          isArabic
                            ? 'ar-SA'
                            : 'en-US'
                        )
                      : '-'}
                  </span>

                  <span>
                    <ExternalLink size={16} />

                    {item.source?.[
                      i18n.language
                    ] || '-'}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <>
                  <div className="news-content">
                    <p>
                      {item.content?.[
                        i18n.language
                      ] || '-'}
                    </p>
                  </div>

                  <div className="recommendations">
                    <h4>
                      <Shield size={18} />

                      {t(
                        'newsPage.recommendations'
                      )}
                    </h4>

                    <ul>
                      {(
                        item.recommendations ||
                        []
                      ).map((r, i) => (
                        <li key={i}>
                          -{' '}
                          {r?.[
                            i18n.language
                          ] || '-'}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <div className="actions">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleReadMore(item.id)
                  }
                >
                  {isExpanded
                    ? t(
                        'newsPage.hide_details'
                      )
                    : t(
                        'newsPage.read_more'
                      )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleShare(item)
                  }
                >
                  {t('newsPage.share')}
                </Button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="alert-box">
        <AlertTriangle className="alert-icon" />

        <div>
          <h3>
            {t('newsPage.alert_title')}
          </h3>

          <p>
            {t('newsPage.alert_text')}
          </p>

          <div className="alert-buttons">
            <Button
              className="btn-alert"
              onClick={handleSubscribe}
            >
              {t('newsPage.subscribe')}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="btn-outline-red"
              onClick={handleLearnMore}
            >
              {t('newsPage.learn_more')}
            </Button>
          </div>
        </div>
      </section>

      {notificationModalOpen && (
        <div
          className="news-notification-overlay"
          onClick={closeNotificationModal}
        >
          <div
            className="news-notification-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="news-notification-close"
              onClick={closeNotificationModal}
              aria-label={
                isArabic
                  ? 'إغلاق'
                  : 'Close'
              }
            >
              <X size={18} />
            </button>

            <div className="news-notification-icon">
              {notificationModalType ===
              'share' ? (
                <CheckCircle size={28} />
              ) : (
                <Bell size={28} />
              )}
            </div>

            <h3>
              {notificationModalType ===
              'share'
                ? isArabic
                  ? 'تم نسخ الرابط'
                  : 'Link copied'
                : isArabic
                  ? 'تنبيهات الأخبار مفعّلة'
                  : 'News notifications are enabled'}
            </h3>

            <p>
              {notificationModalType ===
              'share'
                ? isArabic
                  ? 'تم نسخ رابط الخبر إلى الحافظة ويمكنك مشاركته الآن.'
                  : 'The news link has been copied to your clipboard and is ready to share.'
                : isArabic
                  ? 'ستصلك إشعارات داخل ThreatIQ عند نشر أخبار جديدة.'
                  : 'You will receive in-app notifications when new news is published on ThreatIQ.'}
            </p>

            <Button
              onClick={closeNotificationModal}
            >
              {isArabic
                ? 'حسنًا'
                : 'Got it'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;