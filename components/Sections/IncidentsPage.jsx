import { AlertOctagon, ShieldCheck, Siren } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../Style/Incidents.css';
import { useContent } from '../Context/ContentContext';

const levelClass = {
  critical: 'incident-level-critical',
  high: 'incident-level-high',
  medium: 'incident-level-medium',
};

export default function IncidentsPage() {
  const { i18n } = useTranslation();
  const { incidents } = useContent();
  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  return (
    <div className="incidents-page">
      <section className="incidents-header">
        <Siren className="incidents-header-icon" />
        <h1>{lang === 'ar' ? 'حوادث سيبرانية واقعية' : 'Real Cyber Incidents'}</h1>
        <p>
          {lang === 'ar'
            ? 'أمثلة مختصرة من هجمات حقيقية مع الدروس العملية لتقليل المخاطر.'
            : 'Concise real-world incidents with practical defensive lessons.'}
        </p>
      </section>

      <section className="incidents-grid">
        {incidents.map((incident) => (
          <article key={incident.id} className="incident-card">
            <div className="incident-top">
              <span className="incident-year">{incident.year}</span>
              <span className={`incident-level ${levelClass[incident.level]}`}>
                {incident.level.toUpperCase()}
              </span>
            </div>

            <h2>{incident.title[lang]}</h2>

            <div className="incident-block">
              <AlertOctagon size={18} />
              <p>{incident.impact[lang]}</p>
            </div>

            <div className="incident-block">
              <ShieldCheck size={18} />
              <p>{incident.lesson[lang]}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
