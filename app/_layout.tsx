import { LanguageProvider } from "@/providers/language-providers";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LanguageProvider>
  );
}
