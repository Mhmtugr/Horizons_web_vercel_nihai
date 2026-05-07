import { useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n/translations.js';

export function useI18n() {
  const [lang, setLang] = useState('TR');

  useEffect(() => {
    const saved = localStorage.getItem('nova_lang');
    if (saved && translations[saved]) {
      setLang(saved);
    } else {
      const browserLang = navigator.language.split('-')[0].toUpperCase();
      if (translations[browserLang]) {
        setLang(browserLang);
      }
    }
  }, []);

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('nova_lang', newLang);
    }
  };

  const t = useCallback((path) => {
    const keys = path.split('.');
    let current = translations[lang];
    for (const key of keys) {
      if (current[key] === undefined) return path;
      current = current[key];
    }
    return current;
  }, [lang]);

  return { lang, changeLanguage, t };
}