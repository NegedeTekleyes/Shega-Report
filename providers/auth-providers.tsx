import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

// -------------------- TYPES --------------------
export type UserRole = 'resident' | 'technician';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  profilePhoto?: string
  // add technicial-specific properties if needed
  specialization?: string
  phoneNumber?: string
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// -------------------- STORAGE --------------------
const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") localStorage.setItem(key, value);
    else await Promise.resolve(); // replace with secure storage if needed
  },
  getItem: async (key: string) => {
    if (Platform.OS === "web") return localStorage.getItem(key);
    else return null;
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web") localStorage.removeItem(key);
    else await Promise.resolve();
  },
};

// -------------------- CONTEXT --------------------
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// -------------------- PROVIDER --------------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    const storedUser = await storage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  };

  const login = async (userData: User, token: string) => {
    setUser(userData);
    await storage.setItem("user", JSON.stringify(userData));
    await storage.setItem("token", token);
  };

  const logout = async () => {
    setUser(null);
    await storage.removeItem("user");
    await storage.removeItem("token");
  };
 
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// -------------------- HOOK --------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
