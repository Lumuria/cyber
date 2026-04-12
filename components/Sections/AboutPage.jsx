import { Shield, Target, Users, BookOpen, Award, Heart } from 'lucide-react';
import '../Style/About.css';
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t, i18n } = useTranslation();

  const teamMembers = [
    {
      name: {
        ar: "د. أحمد محمد",
        en: "Dr. Ahmed Mohammed"
      },
      role: {
        ar: "خبير الأمن السيبراني",
        en: "Cybersecurity Expert"
      },
      description: {
        ar: "أكثر من 15 عاماً من الخبرة",
        en: "Over 15 years of experience"
      },
      icon: Shield
    }
  ];

  const values = [
    {
      icon: Shield,
      title: {
        ar: "الأمان أولاً",
        en: "Security First"
      },
      description: {
        ar: "نضع الأمان في المقدمة",
        en: "We prioritize security"
      }
    },
    {
      icon: BookOpen,
      title: {
        ar: "التعليم المستمر",
        en: "Continuous Learning"
      },
      description: {
        ar: "نؤمن بالتعلم المستمر",
        en: "We believe in continuous learning"
      }
    },
    {
      icon: Users,
      title: {
        ar: "المجتمع أولاً",
        en: "Community First"
      },
      description: {
        ar: "نبني مجتمع واعي",
        en: "Building a safe community"
      }
    },
    {
      icon: Heart,
      title: {
        ar: "الشفافية",
        en: "Transparency"
      },
      description: {
        ar: "نقدم معلومات دقيقة",
        en: "We provide accurate info"
      }
    }
  ];

  return (
    <div className="about-page">

      <section className="about-header">
        <Shield className="about-icon" />
        <h1>{t("about.title")}</h1>
        <p>{t("about.subtitle")}</p>
      </section>

      <section className="about-section">
        <Target className="section-icon" />
        <h2>{t("about.mission_title")}</h2>
        <p>{t("about.mission_text")}</p>

        <div className="mission-grid">
          <div className="mission-card blue">
            <h3>{t("about.goal_title")}</h3>
            <p>{t("about.goal_text")}</p>
          </div>

          <div className="mission-card blue1">
            <h3>{t("about.vision_title")}</h3>
            <p>{t("about.vision_text")}</p>
          </div>
        </div>
      </section>

      <section className="values-section">
        <h2>{t("about.values_title")}</h2>

        <div className="values-grid">
          {values.map((v, i) => (
            <div className="value-card" key={i}>
              <v.icon className="value-icon" />
              <h3>{v.title[i18n.language]}</h3>
              <p>{v.description[i18n.language]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section">
        <h2>{t("about.team_title")}</h2>
        <p>{t("about.team_desc")}</p>

        <div className="team-grid">
          {teamMembers.map((m, i) => (
            <div className="team-card" key={i}>
              <div className="team-avatar">
                <m.icon className="avatar-icon" />
              </div>

              <h3>{m.name[i18n.language]}</h3>
              <span>{m.role[i18n.language]}</span>
              <p>{m.description[i18n.language]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>{t("about.cta_title")}</h2>
        <p>{t("about.cta_text")}</p>

        <div className="cta-buttons">
          <button className="btn-primary">
            {t("about.contact")}
          </button>

          <button className="btn-outline">
            {t("about.subscribe")}
          </button>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;