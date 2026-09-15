import { useState } from 'react';
import {
  Shield,
  Target,
  Users,
  BookOpen,
  Heart,
  Mail,
  MessageCircle,
  Instagram,
  X,
} from 'lucide-react';

import '../Style/About.css';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t, i18n } = useTranslation();

  const language = i18n.language?.startsWith('ar')
    ? 'ar'
    : 'en';

  const [showContact, setShowContact] = useState(false);

  // Team Members
  const teamMembers = [
    {
      name: {
        ar: 'المهندسة رهف الأحمر',
      en: 'Eng. Rahaf Alahmar',
      },
      specialty: {
        ar: 'أخصائي أمن سيبراني',
        en: 'Cybersecurity Specialist',
      },
      icon: Shield,
    },
    {
      name: {
        ar: 'المهندس محمود الفاعوري',
      en: 'Eng. Mahmoud Alfaoure',
      },
      specialty: {
        ar: 'أخصائي أمن سيبراني',
        en: 'Cybersecurity Specialist',
      },
      icon: Shield,
    },
    {
      name: {
        ar: 'المهندسة شام الموصللي',
        en: 'Eng. Shaam Almouselly',
      },
      specialty: {
        ar: 'أخصائي أمن سيبراني',
        en: 'Cybersecurity Specialist',
      },
      icon: Shield,
    },
    {
      name: {
        ar: 'المهندس نور عبد الغفور',
        en: 'Eng. Nour Abd Alghafour',
      },
      specialty: {
        ar: 'أخصائي أمن سيبراني',
        en: 'Cybersecurity Specialist',
      },
      icon: Shield,
    },
  ];

  // Project Values
  const values = [
    {
      icon: Shield,
      title: {
        ar: 'الأمان أولاً',
        en: 'Security First',
      },
      description: {
        ar: 'نضع الأمان في المقدمة',
        en: 'We prioritize security',
      },
    },
    {
      icon: BookOpen,
      title: {
        ar: 'التعليم المستمر',
        en: 'Continuous Learning',
      },
      description: {
        ar: 'نؤمن بالتعلم المستمر',
        en: 'We believe in continuous learning',
      },
    },
    {
      icon: Users,
      title: {
        ar: 'المجتمع أولاً',
        en: 'Community First',
      },
      description: {
        ar: 'نبني مجتمع واعي',
        en: 'Building a safe community',
      },
    },
    {
      icon: Heart,
      title: {
        ar: 'الشفافية',
        en: 'Transparency',
      },
      description: {
        ar: 'نقدم معلومات دقيقة',
        en: 'We provide accurate info',
      },
    },
  ];

  return (
    <div className="about-page">

      {/* =========================
          Header
      ========================== */}
      <section className="about-header">
        <Shield className="about-icon" />

        <h1>{t('about.title')}</h1>

        <p>{t('about.subtitle')}</p>
      </section>

      {/* =========================
          Mission
      ========================== */}
      <section className="about-section">
        <Target className="section-icon" />

        <h2>{t('about.mission_title')}</h2>

        <p>{t('about.mission_text')}</p>

        <div className="mission-grid">

          <div className="mission-card blue">
            <h3>{t('about.goal_title')}</h3>

            <p>{t('about.goal_text')}</p>
          </div>

          <div className="mission-card blue1">
            <h3>{t('about.vision_title')}</h3>

            <p>{t('about.vision_text')}</p>
          </div>

        </div>
      </section>

      {/* =========================
          Values
      ========================== */}
      <section className="values-section">

        <h2>{t('about.values_title')}</h2>

        <div className="values-grid">

          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <div
                className="value-card"
                key={index}
              >
                <Icon className="value-icon" />

                <h3>
                  {value.title[language]}
                </h3>

                <p>
                  {value.description[language]}
                </p>
              </div>
            );
          })}

        </div>
      </section>

      {/* =========================
          Team
      ========================== */}
      <section className="team-section">

        <h2>{t('about.team_title')}</h2>

        <p>
          {language === 'ar'
            ? 'فريق متخصص في بناء منصة توعوية للأمن السيبراني.'
            : 'A team specialized in building a cybersecurity awareness platform.'}
        </p>

        <div className="team-grid">

          {teamMembers.map((member, index) => {
            const Icon = member.icon;

            return (
              <div
                className="team-card"
                key={index}
              >

                {/* Team Icon */}
                <div className="team-avatar">
                  <Icon className="avatar-icon" />
                </div>

                {/* Team Member Name */}
                <h3>
                  {member.name[language]}
                </h3>

                {/* Team Member Specialty */}
                <p className="team-specialty">
                  {member.specialty[language]}
                </p>

              </div>
            );
          })}

        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}
      <section className="cta-section">

        <h2>{t('about.cta_title')}</h2>

        <p>{t('about.cta_text')}</p>

        <div className="cta-buttons">

          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowContact(true)}
          >
            {t('about.contact')}
          </button>

          <a
            href="/"
            className="btn-outline"
          >
            {language === 'ar'
              ? 'اكتشف ThreatIQ'
              : 'Explore ThreatIQ'}
          </a>

        </div>
      </section>

      {/* =========================
          Contact Modal
      ========================== */}
      {showContact && (
        <div
          className="contact-modal-overlay"
          onClick={() => setShowContact(false)}
        >

          <div
            className="contact-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >

            {/* Close Button */}
            <button
              type="button"
              className="contact-modal-close"
              onClick={() => setShowContact(false)}
              aria-label={
                language === 'ar'
                  ? 'إغلاق'
                  : 'Close'
              }
            >
              <X size={20} />
            </button>

            {/* Modal Icon */}
            <Mail className="contact-modal-icon" />

            {/* Modal Title */}
            <h3 id="contact-modal-title">
              {language === 'ar'
                ? 'تواصل معنا'
                : 'Contact Us'}
            </h3>

            {/* Modal Description */}
            <p>
              {language === 'ar'
                ? 'اختر الطريقة المناسبة للتواصل معنا'
                : 'Choose your preferred way to contact us'}
            </p>

            {/* Contact Options */}
            <div className="contact-options">

              {/* Email */}
              <a
                href="mailto:threatiqsy@gmail.com"
                className="contact-option"
              >
                <Mail size={22} />

                <span>
                  {language === 'ar'
                    ? 'البريد الإلكتروني'
                    : 'Email'}
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/966530640625"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-option"
              >
                <MessageCircle size={22} />

                <span>
                  WhatsApp
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/threatiqsy/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-option"
              >
                <Instagram size={22} />

                <span>
                  Instagram
                </span>
              </a>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AboutPage;