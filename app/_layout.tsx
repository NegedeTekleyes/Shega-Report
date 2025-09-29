import { AuthProvider, useAuth } from "@/providers/auth-providers";
import { LanguageProvider } from "@/providers/language-providers";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

// Component to handle routing based on user role
function RootLayoutContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [redirected, setRedirected] = useState(false);
  useEffect(() => {
    if (!isLoading && !redirected) {
      console.log("Auth state:", { user, isLoading, redirected });
      if (!user) {
        //  No user redirect to welco e auth
        router.replace("/(auth)/welcome");
        setRedirected(true);
      } else if (user.role === "technician") {
        router.replace("/(technician)/dashboard");
        setRedirected(true);
      } else {
        // regular users -redirect to tabs
        router.replace("/(tabs)");
        setRedirected(true);
      }
    }
  }, [user, isLoading, redirected, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  // render empty stack while redirecting
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(technician)" />
    </Stack>
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
