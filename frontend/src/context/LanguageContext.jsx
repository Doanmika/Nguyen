import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext(null);

const LANGUAGE_STORAGE_KEY = 'charity-language';
const SUPPORTED_LANGUAGES = ['vi', 'en'];

const importTranslation = async (lang) => {
  try {
    const module = await import(`../locales/${lang}.json`);
    return module.default;
  } catch (err) {
    console.error(`Failed to load translation for ${lang}:`, err);
    return {};
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === 'undefined') return 'vi';
    try {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.includes(stored)) return stored;
    } catch {
      // ignore
    }
    const browserLang = navigator.language.split('-')[0];
    return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'vi';
  });

  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  const loadTranslations = useCallback(async (lang) => {
    setLoading(true);
    const translation = await importTranslation(lang);
    setTranslations(translation);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTranslations(language);
  }, [language, loadTranslations]);

  const setLanguage = (lang) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      } catch {
        // ignore
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
    }
    if (typeof value !== 'string') return key;
    return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => 
      params[paramKey] !== undefined && params[paramKey] !== null ? params[paramKey] : `{{${paramKey}}}`
    );
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    loading,
    supportedLanguages: SUPPORTED_LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};