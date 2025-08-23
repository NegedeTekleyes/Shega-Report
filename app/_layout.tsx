import { AuthProvider } from "@/providers/auth-providers";
import { LanguageProvider } from "@/providers/language-providers";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <LanguageProvider>
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
    </LanguageProvider>
  );
}
