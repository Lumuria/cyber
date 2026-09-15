import { useEffect, useState } from 'react';
import {
  Search,
  Calendar,
  AlertTriangle,
  Shield,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import '../Style/Attacks.css';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../services/apiConfig';

const AttacksPage = () => {
  const { t, i18n } = useTranslation();

  const [attacks, setAttacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);

  const language = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  useEffect(() => {
    const fetchAttacks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/attacks`);

        if (!response.ok) {
          throw new Error('Failed to fetch attacks');
        }

        const data = await response.json();

        setAttacks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching attacks:', err);
        setError('Unable to load attacks');
      } finally {
        setLoading(false);
      }
    };

    fetchAttacks();
  }, []);

  const attackTypes = [
    ...new Map(
      attacks
        .map((attack) => attack?.type)
        .filter((type) => type?.ar && type?.en)
        .map((type) => [type.en, type])
    ).values(),
  ];

  const severityLevels = [
    ...new Map(
      attacks
        .map((attack) => attack?.severity)
        .filter((severity) => severity?.ar && severity?.en)
        .map((severity) => [severity.en, severity])
    ).values(),
  ];

  const filteredAttacks = attacks.filter((attack) => {
    const title = attack?.title?.[language] || '';
    const description = attack?.description?.[language] || '';
    const name = attack?.name || '';

    const type = attack?.type?.en || '';
    const severity = attack?.severity?.en || '';

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      name.toLowerCase().includes(search) ||
      title.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search);

    const matchesType =
      selectedType === 'all' ||
      type === selectedType;

    const matchesSeverity =
      selectedSeverity === 'all' ||
      severity === selectedSeverity;

    return (
      matchesSearch &&
      matchesType &&
      matchesSeverity
    );
  });

  const getSeverityClass = (severity) => {
    const value = severity?.[language] || '';

    if (
      value.includes('جداً') ||
      value.includes('Critical')
    ) {
      return 'sev-red';
    }

    if (
      value.includes('عالية') ||
      value.includes('High')
    ) {
      return 'sev-orange';
    }

    if (
      value.includes('متوسطة') ||
      value.includes('Medium')
    ) {
      return 'sev-yellow';
    }

    return 'sev-gray';
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedSeverity('all');
  };

  const toggleCard = (id) => {
    setExpandedCard(
      expandedCard === id ? null : id
    );
  };

  if (loading) {
    return (
      <div className="attacks-page">
        <section className="attacks-header">
          <AlertTriangle className="header-icon" />

          <h1>{t('attacks.title')}</h1>

          <p>{t('attacks.subtitle')}</p>
        </section>

        <div className="no-results">
          <p>
            {language === 'ar'
              ? 'جاري تحميل الهجمات...'
              : 'Loading attacks...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attacks-page">
        <section className="attacks-header">
          <AlertTriangle className="header-icon" />

          <h1>{t('attacks.title')}</h1>

          <p>{t('attacks.subtitle')}</p>
        </section>

        <div className="no-results">
          <AlertTriangle className="no-icon" />

          <h3>
            {language === 'ar'
              ? 'تعذر تحميل الهجمات'
              : 'Unable to load attacks'}
          </h3>

          <p>
            {language === 'ar'
              ? 'يرجى التأكد من تشغيل خادم Laravel.'
              : 'Please make sure Laravel is running.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="attacks-page">
      <section className="attacks-header">
        <AlertTriangle className="header-icon" />

        <h1>{t('attacks.title')}</h1>

        <p>{t('attacks.subtitle')}</p>
      </section>

      <section className="filter-box">
        <div className="filter-grid">

          <div className="input-group">
            <Search className="input-icon" />

            <input
              type="text"
              value={searchTerm}
              placeholder={t('attacks.search_placeholder')}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          <select
            className="filter-select"
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value)
            }
            aria-label={
              language === 'ar'
                ? 'نوع الهجوم'
                : 'Attack Type'
            }
          >
            <option value="all">
              {language === 'ar'
                ? 'كل الأنواع'
                : 'All Types'}
            </option>

            {attackTypes.map((type) => (
              <option
                key={type.en}
                value={type.en}
              >
                {type[language]}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedSeverity}
            onChange={(e) =>
              setSelectedSeverity(e.target.value)
            }
            aria-label={
              language === 'ar'
                ? 'مستوى الخطورة'
                : 'Severity Level'
            }
          >
            <option value="all">
              {language === 'ar'
                ? 'كل مستويات الخطورة'
                : 'All Severity Levels'}
            </option>

            {severityLevels.map((severity) => (
              <option
                key={severity.en}
                value={severity.en}
              >
                {severity[language]}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="reset-btn"
            onClick={resetFilters}
          >
            {t('attacks.reset')}
          </button>

        </div>
      </section>

      <p className="results-count">
        {t('attacks.results', {
          count: filteredAttacks.length,
          total: attacks.length,
        })}
      </p>

      <div className="attacks-list">
        {filteredAttacks.map((attack) => (
          <div
            key={attack.id}
            className="attack-card"
          >
            <div className="card-header">
              <div>
                <h3>
                  {attack?.title?.[language] || ''}
                </h3>

                <span className="eng-name">
                  ({attack?.name || ''})
                </span>

                <div className="card-meta">
                  <span>
                    <Calendar size={14} />
                    {attack?.date?.[language] || ''}
                  </span>

                  <span className="type">
                    {attack?.type?.[language] || ''}
                  </span>

                  <span
                    className={`sev-tag ${getSeverityClass(
                      attack?.severity
                    )}`}
                  >
                    {attack?.severity?.[language] || ''}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={`toggle-btn ${
                  expandedCard === attack.id
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  toggleCard(attack.id)
                }
              >
                {expandedCard === attack.id ? (
                  <>
                    <ChevronUp size={16} />
                    {t('attacks.hide_details')}
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    {t('attacks.show_details')}
                  </>
                )}
              </button>
            </div>

            <p className="desc">
              {attack?.description?.[language] || ''}
            </p>

            <div className="meta-grid">
              <div>
                <strong>
                  {t('attacks.target')}:
                </strong>{' '}
                {attack?.target?.[language] || ''}
              </div>

              <div>
                <strong>
                  {t('attacks.damage')}:
                </strong>{' '}
                {attack?.damage?.[language] || ''}
              </div>
            </div>

            {expandedCard === attack.id && (
              <div className="card-details">
                <div className="detail-box turquoise">
                  <div className="detail-title">
                    <Shield />
                    {t('attacks.prevention')}
                  </div>

                  <p>
                    {attack?.prevention?.[language] || ''}
                  </p>
                </div>

                <div className="detail-box blue">
                  <div className="detail-title">
                    <Eye />
                    {t('attacks.detection')}
                  </div>

                  <p>
                    {attack?.detection?.[language] || ''}
                  </p>
                </div>

                <div className="detail-box purple">
                  <div className="detail-title">
                    <AlertTriangle />
                    {t('attacks.solutions')}
                  </div>

                  <p>
                    {attack?.solution?.[language] || ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAttacks.length === 0 && (
        <div className="no-results">
          <AlertTriangle className="no-icon" />

          <h3>
            {t('attacks.no_results')}
          </h3>

          <p>
            {t('attacks.no_results_desc')}
          </p>
        </div>
      )}
    </div>
  );
};

export default AttacksPage;
