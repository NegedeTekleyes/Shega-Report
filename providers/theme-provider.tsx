// providers/theme-provider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the theme colors structure
interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
}

// Define the theme structure
interface Theme {
  colors: ThemeColors;
  isDark: boolean;
}

// Define the context structure
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setThemeMode: (dark: boolean) => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme: ColorSchemeName = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    systemColorScheme === 'dark' || false
  );
  
  const [theme, setTheme] = useState<Theme>({
    colors: {
      primary: '#10B981',
      background: isDarkMode ? '#111827' : '#F9FAFB',
      card: isDarkMode ? '#1F2937' : '#FFFFFF',
      text: isDarkMode ? '#F9FAFB' : '#111827',
      textSecondary: isDarkMode ? '#D1D5DB' : '#4B5563',
      border: isDarkMode ? '#374151' : '#E5E7EB',
      notification: '#EF4444',
    },
    isDark: isDarkMode,
  });

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light');
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    };
    
    saveThemePreference();
  }, [isDarkMode]);

  // Update theme when dark mode changes
  useEffect(() => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        background: isDarkMode ? '#111827' : '#F9FAFB',
        card: isDarkMode ? '#1F2937' : '#FFFFFF',
        text: isDarkMode ? '#F9FAFB' : '#111827',
        textSecondary: isDarkMode ? '#D1D5DB' : '#4B5563',
        border: isDarkMode ? '#374151' : '#E5E7EB',
      },
      isDark: isDarkMode,
    }));
  }, [isDarkMode]);

  const toggleTheme = (): void => {
    setIsDarkMode(prev => !prev);
  };

  const setThemeMode = (dark: boolean): void => {
    setIsDarkMode(dark);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};