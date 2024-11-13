import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importa i file di traduzione
import translationEN from './translations/en.json';
import translationIT from './translations/it.json';

const resources = {
  en: { translation: translationEN },
  it: { translation: translationIT },
};

i18n
  .use(LanguageDetector) // Rileva automaticamente la lingua del browser
  .use(initReactI18next) // Inizializza i18next per React
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
