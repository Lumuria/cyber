import React from 'react';
import '../Style/Footer.css';
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-inner">

        <p>
          {t("footer.made_with")} © {new Date().getFullYear()}
        </p>

        <small>
          {t("footer.contact")}{" "}
          <a href="mailto:hello@example.com">hello@example.com</a>
        </small>

      </div>
    </footer>
  );
}