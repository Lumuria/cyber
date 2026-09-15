import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import ar from './locales/ar/translation.json';

const getStoredLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  try {
    return window.localStorage.getItem('lang') || 'en';
  } catch {
    return 'en';
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
