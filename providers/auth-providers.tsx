import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

export type UserRole = "resident" | "technician";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  location: string;
  profilePhoto?: string;
  phone: string;
  photoURL: string;
  specialization?: string;
  phoneNumber?: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => void;
}

// -------------------- STORAGE --------------------
const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },

  getItem: async (key: string) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },

  removeItem: async (key: string) => {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
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
    try {
      setIsLoading(true);
      const [storedUser, storedToken] = await Promise.all([
        storage.getItem("user"),
        storage.getItem("token"),
      ]);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading stored auth:", error);
      // Clear corrupted storage
      await clearStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User, token: string) => {
    try {
      await Promise.all([
        storage.setItem("user", JSON.stringify(userData)),
        storage.setItem("token", token),
      ]);
      setUser(userData);
    } catch (error) {
      console.error("Login storage error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear all auth-related storage
      await clearStorage();
      setUser(null);
    } catch (error) {
      console.error("Logout Failed", error);
      throw error;
    }
  };

  const clearStorage = async () => {
    try {
      await Promise.all([
        storage.removeItem("user"),
        storage.removeItem("token"),
        storage.removeItem("authToken"), // Remove any legacy items
      ]);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error("No user logged in");

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    // Update storage
    await storage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Role based navigation
export const getRoleBasedRedirect = (role: string) => {
  switch (role) {
    case "technician":
      return "/(technician)";
    default:
      return "/(tabs)";
  }
};

// -------------------- HOOK --------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
