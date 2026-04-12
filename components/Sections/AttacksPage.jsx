import { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  Shield,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import cyberAttacksData from '../../data/attacksData';
import '../Style/Attacks.css';
import { useTranslation } from "react-i18next";

const AttacksPage = () => {
  const { t, i18n } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);

  const attackTypes = ['all'];
  const severityLevels = ['all'];

  const filteredAttacks = cyberAttacksData.filter((attack) => {
    const matchesSearch =
      attack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attack.title[i18n.language].toLowerCase().includes(searchTerm.toLowerCase()) ||
      attack.description[i18n.language].toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === 'all' || attack.type[i18n.language] === selectedType;

    const matchesSeverity =
      selectedSeverity === 'all' || attack.severity[i18n.language] === selectedSeverity;

    return matchesSearch && matchesType && matchesSeverity;
  });

  const getSeverityClass = (severity) => {
    const sev = severity[i18n.language];

    if (sev.includes("متوسطة") || sev.includes("Medium")) return 'sev-yellow';
    if (sev.includes("عالية") || sev.includes("High")) return 'sev-orange';
    if (sev.includes("جداً") || sev.includes("Critical")) return 'sev-red';

    return 'sev-gray';
  };

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="attacks-page">

      <section className="attacks-header">
        <AlertTriangle className="header-icon" />
        <h1>{t("attacks.title")}</h1>
        <p>{t("attacks.subtitle")}</p>
      </section>

      <section className="filter-box">
        <div className="filter-grid">

          <div className="input-group">
            <Search className="input-icon" />
            <input
              type="text"
              placeholder={t("attacks.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="reset-btn"
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedSeverity('all');
            }}
          >
            {t("attacks.reset")}
          </button>

        </div>
      </section>

      <p className="results-count">
        {t("attacks.results", {
          count: filteredAttacks.length,
          total: cyberAttacksData.length
        })}
      </p>

      <div className="attacks-list">
        {filteredAttacks.map((attack) => (
          <div key={attack.id} className="attack-card">

            <div className="card-header">
              <div>
                <h3>{attack.title[i18n.language]}</h3>
                <span className="eng-name">({attack.name})</span>

                <div className="card-meta">
                  <span>
                    <Calendar size={14} /> {attack.date[i18n.language]}
                  </span>

                  <span className="type">
                    {attack.type[i18n.language]}
                  </span>

                  <span className={`sev-tag ${getSeverityClass(attack.severity)}`}>
                    {attack.severity[i18n.language]}
                  </span>
                </div>
              </div>

              <button
                className={`toggle-btn ${expandedCard === attack.id ? 'active' : ''}`}
                onClick={() => toggleCard(attack.id)}
              >
                {expandedCard === attack.id ? (
                  <>
                    <ChevronUp size={16} /> {t("attacks.hide_details")}
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} /> {t("attacks.show_details")}
                  </>
                )}
              </button>
            </div>

            <p className="desc">
              {attack.description[i18n.language]}
            </p>

            <div className="meta-grid">
              <div>
                <strong>{t("attacks.target")}:</strong>{" "}
                {attack.target[i18n.language]}
              </div>

              <div>
                <strong>{t("attacks.damage")}:</strong>{" "}
                {attack.damage[i18n.language]}
              </div>
            </div>

            {expandedCard === attack.id && (
              <div className="card-details">

                <div className="detail-box turquoise">
                  <div className="detail-title">
                    <Shield /> {t("attacks.prevention")}
                  </div>
                  <p>{attack.prevention[i18n.language]}</p>
                </div>

                <div className="detail-box blue">
                  <div className="detail-title">
                    <Eye /> {t("attacks.detection")}
                  </div>
                  <p>{attack.detection[i18n.language]}</p>
                </div>

                <div className="detail-box purple">
                  <div className="detail-title">
                    <AlertTriangle /> {t("attacks.solutions")}
                  </div>
                  <p>{attack.solution[i18n.language]}</p>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAttacks.length === 0 && (
        <div className="no-results">
          <AlertTriangle className="no-icon" />
          <h3>{t("attacks.no_results")}</h3>
          <p>{t("attacks.no_results_desc")}</p>
        </div>
      )}
    </div>
  );
};

export default AttacksPage;