import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { uiText } from './uiText.js';

const STORAGE_KEY = 'vg-language';
const DEFAULT_LANGUAGE = 'en';

const COVER_MS = 320;
const REVEAL_MS = 420;

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  isTransitioning: false,
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const coverTimeout = useRef(null);
  const revealTimeout = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.title = uiText[language].meta.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', uiText[language].meta.description);
    }
  }, [language]);

  useEffect(() => {
    return () => {
      window.clearTimeout(coverTimeout.current);
      window.clearTimeout(revealTimeout.current);
    };
  }, []);

  const changeLanguage = (nextLang) => {
    if (nextLang !== 'en' && nextLang !== 'id') return;
    if (nextLang === language) return;

    window.clearTimeout(coverTimeout.current);
    window.clearTimeout(revealTimeout.current);

    setIsTransitioning(true);

    coverTimeout.current = window.setTimeout(() => {
      setLanguageState(nextLang);

      revealTimeout.current = window.setTimeout(() => {
        setIsTransitioning(false);
      }, REVEAL_MS);
    }, COVER_MS);
  };

  const setLanguage = (lang) => changeLanguage(lang);
  const toggleLanguage = () => changeLanguage(language === 'en' ? 'id' : 'en');

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
    return { language, isTransitioning, toggleLanguage, setLanguage, t };
  }, [language, isTransitioning]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}