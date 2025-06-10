import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import en from "./translations/en.json";
import es from "./translations/es.json";
import qu from "./translations/qu.json";
import ay from "./translations/ay.json";

type Translations = typeof en | typeof es | typeof qu | typeof ay;
type Language = "en" | "es" | "qu" | "ay";

interface I18nContextType {
  language: Language;
  currentLanguage: Language; // Alias para compatibilidad
  setLanguage: (lang: Language) => void;
  changeLanguage: (lang: Language) => void; // Alias para compatibilidad
  t: (key: string) => string;
  translations: Translations;
}

const translations = {
  en,
  es,
  qu,
  ay,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Load language preference from localStorage on client side
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "es", "qu", "ay"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // Alias para compatibilidad
  const changeLanguage = setLanguage;

  // Function to get nested translation by dot notation
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }

    return value || key;
  };

  return (
    <I18nContext.Provider
      value={{ 
        language, 
        currentLanguage: language, // Alias para compatibilidad
        setLanguage, 
        changeLanguage, // Alias para compatibilidad
        t, 
        translations: translations[language] 
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}