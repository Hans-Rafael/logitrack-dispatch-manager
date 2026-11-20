import { createContext, useContext, useState, useEffect } from 'react';
import { es } from '../locales/es';
import { en } from '../locales/en';

const translations = { es, en };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('logitrack_lang') || 'es');

  useEffect(() => {
    localStorage.setItem('logitrack_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => translations[lang]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);