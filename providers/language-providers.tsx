import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

// Supported languages
export type Language = "en" | "am";

// Extended translation keys
export const translations = {
  welcome: { en: "Welcome to ShegaReport", am: "እንኳን ወደ ሸጋሪፖርት በደህና መጡ" },
  login: { en: "Login", am: "ግባ" },
   pleaseFillAll: { 
    en: "Please fill all fields", 
    am: "እባክዎ ሁሉንም መስኮች ይሙሉ" 
  },
   passwordsDontMatch: { 
    en: "Passwords do not match", 
    am: "የይለፍ ቃላት አይጣጣሙም" 
  },
  passwordTooShort: { 
    en: "Password must be at least 6 characters", 
    am: "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች ሊኖሩት ይገባል" 
  },
  signupSuccess: { 
    en: "Signup Success", 
    am: "በተሳካ ሁኔታ ተመዝግበዋል" 
  },
   signupError: { 
    en: "Signup failed. Please try again.", 
    am: "ምዝገባ አልተሳካም። እባክዎ ደግሞ ይሞክሩ።" 
  },
  createAccount: { 
    en: "Create Account", 
    am: "መለያ ይፍጠሩ" 
  },
  joinOurCommunity: { 
    en: "Join our water management community", 
    am: "ወደ ውሃ አስተዳደር ማህበረሰባችን ይቀላቀሉ" 
  },
  register: { en: "Sign Up", am: "ተመዝገብ" },
  fullName: {en: 'Full name', am: 'ሙሉ ስም'},
  enterFullName: {en: 'Enter Full Name', am: 'ሙሉ ስም ያስግቡ'},
  email: { en: "Email", am: "ኢሜይል" },
  password: { en: "Password", am: "የይለፍ ቃል" },
  confirmPassword: {en: 'Confirm Password', am: 'የይለፍ ቃል ያረጋግጡ'},
  enterEmail: { en: "Enter your email", am: "ኢሜይልዎን ያስገቡ" },
  enterPassword: { en: "Enter your password", am: "የይለፍ ቃልዎን ያስገቡ" },
  dontHaveAccount: { en: "Don't have an account?", am: "መለያ የሎትም?" },
  signUp: { en: "Sign up", am: "ተመዝገብ" },
  welcomeBack: { en: "Welcome back", am: "እንኳን በደህና መጡ" },
  pleaseEnterBoth: { en: "Please enter both email and password", am: "እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ" },
  loginError: { en: "Login failed. Please try again.", am: "ግባት አልተሳካም። እባክዎ ደግሞ ይሞክሩ።" },
  loading: {en: 'loading plase wait', am: 'እባኮ ይታገሱ'},
  alreadyHaveAccount: {en: 'Already Have Account', am: "ቀድሞውኑ መለያ አሎት?"},
  creatingAccount: {en: 'Create account', am: "በመጫን ላይ"}
  // Add more translations as needed
};

export type TranslationKey = keyof typeof translations;

// Context type
interface LanguageContextProps {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(true)

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
      } finally{
        setIsLoading(false)
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
  // dont rennder children until language is loaded
  if (isLoading) {
    return null
  }

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
