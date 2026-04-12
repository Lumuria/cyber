import { useState } from 'react';
import { Shield, CheckCircle, Star, Filter, Search } from 'lucide-react';
import { Button } from '../Button';
import preventionData from '../../data/preventionData';
import '../Style/Prevention.css';
import { useTranslation } from "react-i18next";

const PreventionPage = () => {
  const { t, i18n } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const filteredPrevention = preventionData.filter(item => {
    const matchesSearch =
      item.title[i18n.language].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description[i18n.language].toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || item.category[i18n.language] === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === 'all' || item.difficulty[i18n.language] === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="prevention-page">

      <section className="prevention-header">
        <Shield className="header-icon" />
        <h1>{t("preventionPage.title")}</h1>
        <p>{t("preventionPage.subtitle")}</p>
      </section>

      <section className="filter-box">
        <div className="filter-grid">

          <div className="input-group">
            <Search className="input-icon" />
            <input
              type="text"
              placeholder={t("preventionPage.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* زر إعادة فقط */}
          <Button
            className="reset-btn"
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
          >
            {t("preventionPage.reset")}
          </Button>

        </div>
      </section>

      <p className="results-count">
        {t("preventionPage.results", {
          count: filteredPrevention.length,
          total: preventionData.length
        })}
      </p>

      <div className="prevention-grid">
        {filteredPrevention.map((item) => (
          <div key={item.id} className="prevention-card">

            <div className="card-header">
              <div>
                <h3>{item.title[i18n.language]}</h3>
                <p>{item.description[i18n.language]}</p>
              </div>
              <Shield className="card-icon" />
            </div>

            <div className="card-tags">
              <span className="tag blue">
                {item.category[i18n.language]}
              </span>

              <span className={`tag importance-${item.importance.ar}`}>
                {t("preventionPage.importance")}:
                {" "}
                {item.importance[i18n.language]}
              </span>

              <span className={`tag difficulty-${item.difficulty.ar}`}>
                {t("preventionPage.difficulty")}:
                {" "}
                {item.difficulty[i18n.language]}
              </span>
            </div>

            <div className="tips-box">
              <h4>
                <CheckCircle size={18} /> {t("preventionPage.tips_title")}
              </h4>

              <ul>
                {item.tips.map((tip, i) => (
                  <li key={i}>
                    • {tip[i18n.language]}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-footer">
              <Button className="apply-btn">
                {t("preventionPage.apply")}
              </Button>
            </div>

          </div>
        ))}
      </div>

      {filteredPrevention.length === 0 && (
        <div className="no-results">
          <Shield className="no-icon" />
          <h3>{t("preventionPage.no_results")}</h3>
          <p>{t("preventionPage.no_results_desc")}</p>
        </div>
      )}

      <section className="general-tips">
        <h2>{t("preventionPage.general_title")}</h2>

        <div className="tips-grid">

          <div className="tip-card">
            <div className="tip-icon"><Shield /></div>
            <h3>{t("preventionPage.tip1_title")}</h3>
            <p>{t("preventionPage.tip1_desc")}</p>
          </div>

          <div className="tip-card">
            <div className="tip-icon"><CheckCircle /></div>
            <h3>{t("preventionPage.tip2_title")}</h3>
            <p>{t("preventionPage.tip2_desc")}</p>
          </div>

          <div className="tip-card">
            <div className="tip-icon"><Star /></div>
            <h3>{t("preventionPage.tip3_title")}</h3>
            <p>{t("preventionPage.tip3_desc")}</p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default PreventionPage;