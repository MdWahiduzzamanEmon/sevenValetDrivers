import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locales/en.json';
import bn from './locales/bn.json';
import ur from './locales/ur.json';

const resources = {
  en: {
    translation: en,
  },
  bn: {
    translation: bn,
  },
  ur: {
    translation: ur,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
