import { AuthProvider, useAuth } from "@/providers/auth-providers";
import { LanguageProvider } from "@/providers/language-providers";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
import { useNotifications } from "@/hooks/useNotifications";
import Toast from "react-native-toast-message";

// Component to handle routing based on user role
function RootLayoutContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [redirected, setRedirected] = useState(false);
  useNotifications()

  useEffect(() => {
    if (!isLoading && !redirected) {
      console.log("Auth state:", { user, isLoading, redirected });
      if (!user) {
        // No user redirect to welcome auth
        // router.replace("/(auth)/welcome");
        setRedirected(true);
      } else if (user.role.toUpperCase() !== "TECHNICIAN") {
        router.replace("/(technician)");
        setRedirected(true);
      } else {
        // regular users - redirect to tabs
        router.replace("/(tabs)");
        setRedirected(true);
      }
    }
  }, [user, isLoading, redirected, router]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(technician)" />
    </Stack>
    <Toast/>
    </>
  );
}
    
    

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
