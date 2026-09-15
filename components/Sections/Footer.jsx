import React from 'react';
import '../Style/Footer.css';
import { useTranslation } from 'react-i18next';
import {
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from 'react-icons/fa';
import BrandMark from '../BrandMark';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <BrandMark className="footer-mark" />

          <div>
            <strong>ThreatIQ</strong>
            <p>{t('footer.made_with')}</p>
          </div>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <p className="footer-contact-title">
            {t('footer.contact')}
          </p>

          <div className="contact-icons">

            {/* Instagram */}
            <a
              href="https://www.instagram.com/threatiqsy/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <FaInstagram />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/966530640625"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <FaWhatsapp />
            </a>

            {/* Email */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=threatiqsy@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email"
              title="Email"
            >
              <FaEnvelope />
            </a>

          </div>
        </div>

        {/* Copyright */}
        <div className="footer-meta">
          <p>
            Copyright {new Date().getFullYear()}
          </p>
        </div>

      </div>
    </footer>
  );
}