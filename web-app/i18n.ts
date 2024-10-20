import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend) // carga traducciones desde archivos
  .use(LanguageDetector) // detecta el idioma del navegador
  .use(initReactI18next) // conecta i18next con React
  .init({
    fallbackLng: "es", // idioma por defecto a español
    lng: "es", // idioma inicial predeterminado a español
    debug: true, // habilita el modo de depuración

    interpolation: {
      escapeValue: false, // no es necesario para React
    },

    backend: {
      // aquí puedes especificar la ruta a los archivos de traducción
      loadPath: "/locales/{{lng}}/translation.json", // Cambia la ruta según tu estructura de archivos
    },
  });

export default i18n;
