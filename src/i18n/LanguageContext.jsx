import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { uiText } from './uiText.js';

const STORAGE_KEY = 'vg-language';
const DEFAULT_LANGUAGE = 'en';

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key) => key,
});

function readStoredLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'en' || stored === 'id' ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore storage errors (private mode, etc.)
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.title = uiText[language].meta.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', uiText[language].meta.description);
    }
  }, [language]);

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'id') setLanguageState(lang);
  };

  const toggleLanguage = () => setLanguageState((prev) => (prev === 'en' ? 'id' : 'en'));

  const value = useMemo(() => {
    const dict = uiText[language];
    const t = (path) => {
      const parts = path.split('.');
      let node = dict;
      for (const p of parts) {
        node = node?.[p];
      }
      return node ?? path;
    };
    return { language, toggleLanguage, setLanguage, t };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
