import React from 'react';
import '../Style/Footer.css';
import { useTranslation } from 'react-i18next';
import BrandMark from '../BrandMark';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-inner">
        <div className="footer-brand">
          <BrandMark className="footer-mark" />
          <div>
            <strong>ThreatIQ</strong>
            <p>{t('footer.made_with')}</p>
          </div>
        </div>

        <div className="footer-meta">
          <p>Copyright {new Date().getFullYear()}</p>
          <small>
            {t('footer.contact')}{' '}
            <a href="mailto:hello@example.com">hello@example.com</a>
          </small>
        </div>
      </div>
    </footer>
  );
}
