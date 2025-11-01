import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "mr";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (en: string, mr: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("mgnrega-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("mgnrega-language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "mr" : "en");
  };

  const t = (en: string, mr: string) => {
    return language === "en" ? en : mr;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
