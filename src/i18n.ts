import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translations
import enTranslations from './locales/en/translation.json';
import zhCNTranslations from './locales/zh-CN/translation.json';
import zhTWTranslations from './locales/zh-TW/translation.json';
import zhHKTranslations from './locales/zh-HK/translation.json';

const resources = {
  en: {
    translation: enTranslations
  },
  'zh-CN': {
    translation: zhCNTranslations
  },
  'zh-TW': {
    translation: zhTWTranslations
  },
  'zh-HK': {
    translation: zhHKTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;