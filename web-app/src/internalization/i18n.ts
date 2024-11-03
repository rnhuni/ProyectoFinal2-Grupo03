import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import translationEs from './../locales/es/translation.json';
import translationEn from './../locales/en/translation.json';


i18n
  .use(HttpBackend) // carga traducciones desde archivos
  .use(LanguageDetector) // detecta el idioma del navegador
  .use(initReactI18next) // conecta i18next con React
  .init({
    resources: {
      es: {
        translation: translationEs,
      },
      en: {
        translation: translationEn,
      },
    },
    lng: "es",
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
