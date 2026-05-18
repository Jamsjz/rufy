import { useState, useCallback, useEffect } from 'react';

export type Language = 'en' | 'np';

const LANGUAGE_KEY = 'rufy-language';

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored === 'en' || stored === 'np') {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'np' : 'en';
    setLanguage(newLang);
  }, [language, setLanguage]);

  return {
    language,
    setLanguage,
    toggleLanguage,
    isEnglish: language === 'en',
    isNepali: language === 'np',
  };
}
