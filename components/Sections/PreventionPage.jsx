import { useState } from 'react';
import { Shield, CheckCircle, Star, Search } from 'lucide-react';
import { Button } from '../Button';
import '../Style/Prevention.css';
import { useTranslation } from 'react-i18next';
import { useContent } from '../Context/ContentContext';

const PreventionPage = () => {
  const { t, i18n } = useTranslation();
  const { prevention } = useContent();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const language = i18n.language === 'ar' ? 'ar' : 'en';

  const categories = [
    ...new Map(
      prevention
        .map((item) => item?.category)
        .filter((category) => category?.ar && category?.en)
        .map((category) => [category.en, category])
    ).values(),
  ];

  const difficulties = [
    ...new Map(
      prevention
        .map((item) => item?.difficulty)
        .filter((difficulty) => difficulty?.ar && difficulty?.en)
        .map((difficulty) => [difficulty.en, difficulty])
    ).values(),
  ];

  const filteredPrevention = prevention.filter((item) => {
    const title = item?.title?.[language] || '';
    const description = item?.description?.[language] || '';
    const category = item?.category?.en || '';
    const difficulty = item?.difficulty?.en || '';
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      title.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === 'all' ||
      category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

  return (
    <div className="prevention-page">
      <section className="prevention-header">
        <Shield className="header-icon" />

        <h1>{t('preventionPage.title')}</h1>

        <p>{t('preventionPage.subtitle')}</p>
      </section>

      <section className="filter-box">
        <div className="filter-grid">
          <div className="input-group">
            <Search className="input-icon" />

            <input
              type="text"
              value={searchTerm}
              placeholder={t('preventionPage.search_placeholder')}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label={language === 'ar' ? 'التصنيف' : 'Category'}
          >
            <option value="all">
              {language === 'ar' ? 'الكل' : 'All'}
            </option>

            {categories.map((category) => (
              <option key={category.en} value={category.en}>
                {category[language]}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            aria-label={
              language === 'ar' ? 'مستوى الصعوبة' : 'Difficulty'
            }
          >
            <option value="all">
              {language === 'ar' ? 'الكل' : 'All'}
            </option>

            {difficulties.map((difficulty) => (
              <option key={difficulty.en} value={difficulty.en}>
                {difficulty[language]}
              </option>
            ))}
          </select>

          <Button
            className="reset-btn"
            variant="outline"
            onClick={resetFilters}
          >
            {t('preventionPage.reset')}
          </Button>
        </div>
      </section>

      <p className="results-count">
        {t('preventionPage.results', {
          count: filteredPrevention.length,
          total: prevention.length,
        })}
      </p>

      <div className="prevention-grid">
        {filteredPrevention.map((item) => (
          <div key={item.id} className="prevention-card">
            <div className="card-header">
              <div>
                <h3>{item?.title?.[language] || '-'}</h3>

                <p>{item?.description?.[language] || '-'}</p>
              </div>

              <Shield className="card-icon" />
            </div>

            <div className="card-tags">
              <span className="tag blue">
                {item?.category?.[language] || '-'}
              </span>

              <span
                className={`tag importance-${
                  item?.importance?.ar || ''
                }`}
              >
                {t('preventionPage.importance')}:{' '}
                {item?.importance?.[language] || '-'}
              </span>

              <span
                className={`tag difficulty-${
                  item?.difficulty?.ar || ''
                }`}
              >
                {t('preventionPage.difficulty')}:{' '}
                {item?.difficulty?.[language] || '-'}
              </span>
            </div>

            <div className="tips-box">
              <h4>
                <CheckCircle size={18} />
                {t('preventionPage.tips_title')}
              </h4>

              <ul>
                {(item?.tips?.[language] || []).map((tip, index) => (
                  <li key={index}>- {tip}</li>
                ))}
              </ul>
            </div>

            <div className="card-footer">
              <Button className="apply-btn">
                {t('preventionPage.apply')}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredPrevention.length === 0 && (
        <div className="no-results">
          <Shield className="no-icon" />

          <h3>{t('preventionPage.no_results')}</h3>

          <p>{t('preventionPage.no_results_desc')}</p>
        </div>
      )}

      <section className="general-tips">
        <h2>{t('preventionPage.general_title')}</h2>

        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">
              <Shield />
            </div>

            <h3>{t('preventionPage.tip1_title')}</h3>

            <p>{t('preventionPage.tip1_desc')}</p>
          </div>

          <div className="tip-card">
            <div className="tip-icon">
              <CheckCircle />
            </div>

            <h3>{t('preventionPage.tip2_title')}</h3>

            <p>{t('preventionPage.tip2_desc')}</p>
          </div>

          <div className="tip-card">
            <div className="tip-icon">
              <Star />
            </div>

            <h3>{t('preventionPage.tip3_title')}</h3>

            <p>{t('preventionPage.tip3_desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PreventionPage;

