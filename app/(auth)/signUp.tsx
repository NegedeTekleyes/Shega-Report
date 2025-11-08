import { useLanguage } from "@/providers/language-providers";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function Signup() {
  const { t, language, changeLanguage } = useLanguage();
  const router = useRouter();

  // State management
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("RESIDENT");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animation setup
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError(t("pleaseFillAllFields"));
      return;
    }

    if (!isValidEmail(email)) {
      setError(t("invalidEmailFormat"));
      return;
    }

    if (password.length < 6) {
      setError(t("passwordMinLength"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: role,
        }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        Alert.alert(
          t("signupSuccess"),
          t("accountCreatedSuccessfully"),
          [
            {
              text: t("ok"),
              onPress: () => router.replace("/(auth)/login"),
            },
          ]
        );
      } else {
        setError(data.message || data.error || t("signupError"));
      }
    } catch (error: any) {
      console.error("Signup error:", error.message);
      setError(t("networkError") || t("signupError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#0a5398", "#15bdc6"]} className="flex-1">
      <SafeAreaView className="flex-1">
        {/* Header with Language Button and Back */}
        <View className="flex-row justify-between items-center px-6 pt-4">
          <Pressable 
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            <Text className="text-white font-semibold text-base ml-2">
              {t("back")}
            </Text>
          </Pressable>

          <Pressable
            className="flex-row items-center bg-white/20 px-4 py-2 rounded-full"
            onPress={() => changeLanguage(language === "en" ? "am" : "en")}
          >
            <Ionicons name="globe" size={18} color="#FFFFFF" />
            <Text className="text-white font-semibold text-base ml-2">
              {language === "en" ? "አማርኛ" : "English"}
            </Text>
          </Pressable>
        </View>

        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center items-center px-6 py-8">
            {/* Logo and Title */}
            <Animated.View
              entering={FadeInUp.delay(100)}
              className="items-center mb-8"
            >
              <Animated.View entering={FadeInUp.delay(300)}>
                <Ionicons name="person-add" size={64} color="#FFDE00" />
              </Animated.View>
              <Text className="italic text-3xl font-bold mt-4 text-white text-center">
                Shega<Text className="text-[#FFDE00]">Report</Text>
              </Text>
              <Text className="text-white/80 text-lg font-medium mt-2 text-center">
                {t("createAccount")}
              </Text>
            </Animated.View>

            {/* Form */}
            <Animated.View
              entering={FadeInUp.delay(200)}
              className="bg-white/10 rounded-2xl w-full p-6 border border-white/20"
            >
              {/* Name Input */}
              <View className="mb-4">
                <Text className="text-white font-semibold text-base mb-3">
                  {t("fullName")}
                </Text>
                <View className="flex-row items-center bg-white/5 border border-white/20 rounded-2xl px-4 py-4">
                  <Ionicons name="person-outline" size={20} color="#FFFFFF" />
                  <TextInput
                    className="flex-1 ml-3 text-white text-base"
                    placeholder={t("enterFullName")}
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={name}
                    onChangeText={setName}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-white font-semibold text-base mb-3">
                  {t("email")}
                </Text>
                <View className="flex-row items-center bg-white/5 border border-white/20 rounded-2xl px-4 py-4">
                  <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
                  <TextInput
                    className="flex-1 ml-3 text-white text-base"
                    placeholder={t("enterEmail")}
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Role Selection
              <View className="mb-4">
                <Text className="text-white font-semibold text-base mb-3">
                  {t("accountType")}
                </Text>
                <View className="flex-row space-x-3">
                  {[
                    { value: "RESIDENT", label: t("resident"), icon: "home" },
                    { value: "TECHNICIAN", label: t("technician"), icon: "construct" },
                  ].map((roleOption) => (
                    <Pressable
                      key={roleOption.value}
                      onPress={() => setRole(roleOption.value)}
                      className={`flex-1 flex-row items-center justify-center py-3 rounded-2xl border-2 ${
                        role === roleOption.value
                          ? "bg-[#FFDE00] border-[#FFDE00]"
                          : "bg-white/5 border-white/20"
                      }`}
                    >
                      <Ionicons
                        name={roleOption.icon}
                        size={18}
                        color={role === roleOption.value ? "#0a5398" : "#FFFFFF"}
                      />
                      <Text
                        className={`ml-2 font-semibold text-sm ${
                          role === roleOption.value ? "text-[#0a5398]" : "text-white"
                        }`}
                      >
                        {roleOption.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View> */}

              {/* Password Input */}
              <View className="mb-4">
                <Text className="text-white font-semibold text-base mb-3">
                  {t("password")}
                </Text>
                <View className="flex-row items-center bg-white/5 border border-white/20 rounded-2xl px-4 py-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" />
                  <TextInput
                    className="flex-1 ml-3 text-white text-base"
                    placeholder={t("enterPassword")}
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#FFFFFF"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className="text-white font-semibold text-base mb-3">
                  {t("confirmPassword")}
                </Text>
                <View className="flex-row items-center bg-white/5 border border-white/20 rounded-2xl px-4 py-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" />
                  <TextInput
                    className="flex-1 ml-3 text-white text-base"
                    placeholder={t("confirmPassword")}
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    editable={!isLoading}
                  />
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#FFFFFF"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Error Message */}
              {error ? (
                <View className="bg-red-400/100 border border-red-500/100 rounded-2xl p-4 mb-4">
                  <Text className="text-white-300 text-center text-sm">{error}</Text>
                </View>
              ) : null}

              {/* Signup Button */}
              <Pressable
                onPressIn={() => !isLoading && (scale.value = withSpring(0.95))}
                onPressOut={() => !isLoading && (scale.value = withSpring(1))}
                onPress={handleSignup}
                disabled={isLoading}
                className="w-full"
              >
                <Animated.View
                  style={animatedStyle}
                  className={`bg-white py-5 rounded-2xl items-center ${
                    isLoading ? "opacity-70" : ""
                  }`}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#0a5398" size="small" />
                  ) : (
                    <View className="flex-row items-center">
                      <Ionicons name="person-add" size={24} color="#0a5398" />
                      <Text className="text-[#0a5398] font-bold text-lg ml-2">
                        {t("register")}
                      </Text>
                    </View>
                  )}
                </Animated.View>
              </Pressable>

              {/* Login Redirect */}
              <View className="flex-row justify-center items-center mt-6">
                <Text className="text-white/80 text-base">
                  {t("alreadyHaveAccount")}
                </Text>
                <Pressable
                  onPress={() => !isLoading && router.push("/(auth)/login")}
                  disabled={isLoading}
                  className="ml-2"
                >
                  <Text className={`font-bold text-base ${isLoading ? "text-[#FFDE00]/60" : "text-[#FFDE00]"}`}>
                    {t("login")}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}