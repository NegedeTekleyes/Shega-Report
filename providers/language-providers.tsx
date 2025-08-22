import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

// Supported languages
export type Language = "en" | "am";

// Translation keys
export const translations = {
  welcome: { en: "Welcome to ShegaReport", am: "እንኳን ወደ ሸጋሪፖርት በደህና መጡ" },
  login: { en: "Login", am: "ግባ" },
  register: { en: "Sign Up", am: "ተመዝገብ" },
  email: { en: "Email", am: "ኢሜይል" },
  password: { en: "Password", am: "የይለፍ ቃል" },
};

export type TranslationKey = keyof typeof translations;

// Context type
interface LanguageContextProps {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  // Load saved language from SecureStore
  useEffect(() => {
    (async () => {
      try {
        const storedLang = await SecureStore.getItemAsync("language");
        if (storedLang === "en" || storedLang === "am") {
          setLanguage(storedLang);
        }
      } catch (error) {
        console.error("Error loading language:", error);
      }
    })();
  }, []);

  // Change language
  const changeLanguage = async (lang: Language) => {
    setLanguage(lang);
    try {
      await SecureStore.setItemAsync("language", lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  // Translation function
  const t = (key: TranslationKey) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use in screens
export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
