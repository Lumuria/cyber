import { BookOpenCheck, Clock3, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../Style/Awareness.css';
import { useContent } from '../Context/ContentContext';

export default function AwarenessPage() {
  const { i18n } = useTranslation();
  const { awareness } = useContent();
  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  return (
    <div className="awareness-page">
      <section className="awareness-header">
        <BookOpenCheck className="awareness-header-icon" />
        <h1>{lang === 'ar' ? 'مسارات التوعية الأمنية' : 'Security Awareness Tracks'}</h1>
        <p>
          {lang === 'ar'
            ? 'خطط تعلم قصيرة قابلة للتطبيق للمستخدمين والفرق.'
            : 'Short, practical learning paths for users and teams.'}
        </p>
      </section>

      <section className="awareness-grid">
        {awareness.map((track) => (
          <article key={track.id} className="awareness-card">
            <div className="awareness-title-row">
              <h2>{track.title[lang]}</h2>
              <span>
                <Clock3 size={15} />
                {track.duration[lang]}
              </span>
            </div>

            <ul>
              {track.modules.map((module, index) => (
                <li key={`${track.id}-${index}`}>
                  <CheckCircle2 size={16} />
                  {module[lang]}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
