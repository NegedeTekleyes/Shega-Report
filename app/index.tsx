import { useAuth } from "@/providers/auth-providers";
import { useLanguage } from "@/providers/language-providers";
import { FontAwesome5 } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import LoadingScreen from "../components/loadingScreen";
import "./global.css";

export default function Index() {
  const { language, t, changeLanguage } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-green-600 px-6">
      {/* Logo & Title */}
      <Animated.View
        entering={FadeInDown.delay(200)}
        className="items-center mb-10"
      >
        <View className="w-28 h-28 bg-white rounded-full justify-center items-center mb-5 shadow-lg">
          <FontAwesome5 name="tint" size={60} color="#009639" />
        </View>
        <Text className="text-3xl font-bold text-white mb-2">ShegaReport</Text>
        <Text className="text-white/90 text-center text-base leading-6">
          {t("welcome")}
        </Text>
      </Animated.View>

      {/* Municipality */}
      <Animated.View entering={FadeInDown.delay(400)} className="mb-10">
        <Text className="text-yellow-400 font-semibold text-lg text-center">
          {language === "en"
            ? "Debre Birhan Municipality"
            : "የደብረ ብርሃን ውሃ ልማት "}
        </Text>
      </Animated.View>

      {/* Buttons */}
      <Animated.View
        entering={FadeInUp.delay(600)}
        className="w-full space-y-4 mb-8"
      >
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="bg-white py-4 rounded-xl items-center shadow-md"
        >
          <Text className="text-green-600 font-semibold text-lg">
            {t("login")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          className="border-2 border-white py-4 rounded-xl items-center mt-6"
        >
          <Text className="text-white font-semibold text-lg">
            {t("register")}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Description */}
      <Animated.View entering={FadeInUp.delay(800)} className="px-5 mb-6">
        <Text className="text-white/80 text-center text-sm leading-5">
          {language === "en"
            ? "Report water supply and sanitation issues in your community"
            : "በማህበረሰብዎ ውስጥ የውሃ አቅርቦት እና የንፅህና ችግሮችን ሪፖርት ያድርጉ"}
        </Text>
      </Animated.View>

      {/* Language Switcher */}
      <Animated.View entering={FadeInUp.delay(1000)}>
        <TouchableOpacity
          onPress={() => changeLanguage(language === "en" ? "am" : "en")}
          className="px-4 py-2 bg-white/20 rounded-lg"
        >
          <Text className="text-white font-semibold">
            {language === "en" ? "አማርኛ" : "English"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
