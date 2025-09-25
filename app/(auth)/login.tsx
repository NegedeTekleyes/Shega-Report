import { useAuth } from "@/providers/auth-providers";
import { useLanguage } from "@/providers/language-providers";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// emailvalidation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password State
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  // Animation setup
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t("pleaseEnterBoth"));
      return;
    }

    if (!isValidEmail(email)) {
      setError(t("invalidEmailFormat"));
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase,

          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.access_token && data.user) {
        await AsyncStorage.setItem("token", data.access_token);
        login(data.user, data.access_token);
        Alert.alert(t("loginSuccess"), `${t("welcome")} ${data.user.name}!`);
        router.replace("/(tabs)");
      } else {
        setError(data.error || t("loginError"));
      }
    } catch (error: any) {
      console.error("Login error:", error.message);
      setError(t("networkError") || t("loginError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Function
  const handleForgotPassword = async () => {
    const trimmedEmail = forgotPasswordEmail.trim().toLowerCase();

    if (!trimmedEmail) {
      Alert.alert(t("error"), t("pleaseEnterEmail"));
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      Alert.alert(t("error"), t("invalidEmailFormat"));
    }

    setIsSendingReset(true);

    try {
      const res = await fetch("http://192.168.1.4:3000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setResetSent(true);
        // auto close modal after 2 seconds
        setTimeout(() => {
          setForgotPasswordModal(false);
          setResetSent(false);
          setForgotPasswordEmail("");
        }, 2000);
      } else {
        Alert.alert(t("error"), data.error || t("resetEmailError"));
      }
    } catch (error: any) {
      console.error("Forgot password error:", error.message);
      Alert.alert(t("error"), t("networkError") || "resetEmailError");
    } finally {
      setIsSendingReset(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setForgotPasswordModal(false);
    setForgotPasswordEmail("");
    setResetSent(false);
  };
  return (
    <LinearGradient
      colors={["#0a5398ff", "#15bdc6ff"]}
      style={{ flex: 1, justifyContent: "center" }}
    >
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo */}
        <Animated.View
          entering={FadeInUp.delay(100)}
          className="items-center mb-8"
        >
          <Ionicons name="water-outline" size={64} color="white" />
          <Text className="italic text-2xl font-semibold mt-2 text-white">
            ShegaReport
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          entering={FadeInUp.delay(200)}
          className="bg-gray-200 rounded-2xl w-full p-6 shadow-lg"
        >
          <Text className="text-2xl font-bold text-green-600 text-center mb-4">
            {t("welcomeBack")}
          </Text>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-semibold">
              {t("email")}
            </Text>
            <View className="flex-row items-center">
              <View className="absolute left-3 z-10">
                <Ionicons name="mail-outline" size={20} color="gray" />
              </View>
              <TextInput
                className="flex-1 border border-gray-300 rounded-xl pl-10 pr-3 py-3 text-base"
                placeholder={t("enterEmail")}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-2">
            <Text className="text-gray-700 mb-2 font-semibold">
              {t("password")}
            </Text>
            <View className="flex-row items-center">
              <View className="absolute left-3 z-10">
                <Ionicons name="lock-closed-outline" size={20} color="gray" />
              </View>
              <TextInput
                className="flex-1 border border-gray-300 rounded-xl pl-10 pr-10 py-3 text-base"
                placeholder={t("enterPassword")}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <Pressable
                className="absolute right-3 z-10"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="gray"
                />
              </Pressable>
            </View>
          </View>

          {/* Forgot Password Link */}
          <Pressable
            onPress={() => !isLoading && setForgotPasswordModal(true)}
            disabled={isLoading}
            className="mb-4"
          >
            <Text
              className={`text-right ${
                isLoading ? "text-gray-400" : "text-green-600 font-semibold"
              }`}
            >
              {t("forgotPassword")}?
            </Text>
          </Pressable>

          {/* Error */}
          {error ? (
            <Text className="text-red-500 mb-4 text-center">{error}</Text>
          ) : null}

          {/* Login Button */}
          <Pressable
            onPressIn={() => !isLoading && (scale.value = withSpring(0.95))}
            onPressOut={() => !isLoading && (scale.value = withSpring(1))}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Animated.View
              style={animatedStyle}
              className={`py-3 rounded-xl items-center mb-4 ${
                isLoading ? "bg-green-400" : "bg-green-600"
              }`}
            >
              <Text className="text-white font-semibold text-lg">
                {isLoading ? t("loading") + "..." : t("login")}
              </Text>
            </Animated.View>
          </Pressable>

          {/* Redirect to Signup */}
          <Pressable
            onPress={() => !isLoading && router.push("/(auth)/signup")}
            disabled={isLoading}
            className="items-center"
          >
            <Text
              className={`${isLoading ? "text-gray-400" : "text-gray-600"}`}
            >
              {t("dontHaveAccount")}{" "}
              <Text
                className={
                  isLoading ? "text-green-400" : "text-green-600 font-semibold"
                }
              >
                {t("register")}
              </Text>
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Forgot Password Modal */}
      <Modal
        visible={forgotPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeForgotPasswordModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <Animated.View
            entering={FadeInUp}
            className="bg-white rounded-2xl w-full p-6 shadow-lg"
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-green-600">
                {t("forgotPassword")}
              </Text>
              <Pressable
                onPress={closeForgotPasswordModal}
                disabled={isSendingReset}
              >
                <Ionicons name="close-outline" size={24} color="gray" />
              </Pressable>
            </View>

            {resetSent ? (
              <View className="items-center py-4">
                <Ionicons name="checkmark-circle" size={64} color="#10B981" />
                <Text className="text-lg font-semibold text-green-600 mt-2">
                  {t("resetEmailSent")}
                </Text>
                <Text className="text-gray-600 text-center mt-2">
                  {t("resetEmailInstructions")}
                </Text>
              </View>
            ) : (
              <>
                <Text className="text-gray-600 mb-4">
                  {t("enterEmailToReset")}
                </Text>

                <View className="mb-4">
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-4"
                    placeholder={t("enterEmail")}
                    value={forgotPasswordEmail}
                    onChangeText={setForgotPasswordEmail}
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!isSendingReset}
                  />
                  <Pressable
                    onPress={handleForgotPassword}
                    disabled={isSendingReset || !forgotPasswordEmail.trim()}
                    className={`py-3 rounded-xl items-center ${
                      isSendingReset || !forgotPasswordEmail.trim()
                        ? "bg-green-400"
                        : "bg-green-600"
                    }`}
                  >
                    {isSendingReset ? (
                      <ActivityIndicator color="white" className="mr-2" />
                    ) : (
                      <Ionicons
                        name="send-outline"
                        size={20}
                        color="white"
                        className="mr-2"
                      />
                    )}
                    <Text className="text-white font-semibold text-lg">
                      {isSendingReset
                        ? t("sending") + "..."
                        : t("sendResetLink")}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
