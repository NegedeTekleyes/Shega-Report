import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "@/providers/language-providers";
import { useAuth } from "@/providers/auth-providers";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();
  // state manegment
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // animation setup
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));


  const handleLogin = async () => {
    if (!email || !password) {
      setError(t("pleaseEnterBoth"));
      return;
    }

    setIsLoading(true);
    setError("");
  
    try {
      // Call the backend
      const res = await fetch("http://192.168.1.4:3000/auth/login", {
        method: "POST",
        headers: {
           "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email,
           password : password,
          }),
      });

      const data = await res.json()

      if(res.ok && data.access_token && data.user){
        // save login token 
        await AsyncStorage.setItem("token", data.access_token)
      // update app state to show user is logged in
        login(data.user, data.access_token)

        Alert.alert(t("loginSuccess"), `${t("welcome")} ${data.user.name}!`);

        // navigate to home
        router.replace("/(tabs)")
      } else{
        setError(data.error || t("loginError"));
      }
    } catch (error: any) {
        console.error("Login error:", error.message);
      setError(t("loginError"));
     } finally {
         setIsLoading(false);
    }
  }
  return (
    <LinearGradient colors={["#0a5398ff", "#15bdc6ff"]} style={{ flex: 1, justifyContent: "center" }}>
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo */}
        <Animated.View entering={FadeInUp.delay(100)} className="items-center mb-8">
          <Ionicons name="water-outline" size={64} color="white" />
          <Text className=" italic text-2xl font-semibold mt-2 text-white">ShegaReport</Text>
        </Animated.View>

        {/* Form */}
        <Animated.View entering={FadeInUp.delay(200)} className="bg-gray-200 rounded-2xl w-full p-6 shadow-lg">
          <Text className="text-2xl font-bold text-green-600 text-center mb-4">{t("welcomeBack")}</Text>
            {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-semibold">{t("email")}</Text>
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
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-semibold">{t("password")}</Text>
            <View className="flex-row items-center ">
              <View className="absolute left-3 z-10">
              <Ionicons name="lock-closed-outline" size={20} color="gray" />

              </View>
              <TextInput
                className="flex-1 border border-gray-300 rounded-xl pl-10 pr-3 py-3 text-base"
                placeholder={t("enterPassword")}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
              </Pressable>
            </View>
          </View>

          {/* Error */}
          {error ? <Text className="text-red-500 mb-4 text-center">{error}</Text> : null}

          {/* Login Button */}
          <Pressable
            onPressIn={() => !isLoading && (scale.value = withSpring(0.95))}
            onPressOut={() => !isLoading && (scale.value = withSpring(1))}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Animated.View
              style={animatedStyle}
              className={`py-3 rounded-xl items-center mb-4 ${isLoading ? "bg-green-400" : "bg-green-600"}`}
            >
              <Text className="text-white font-semibold text-lg">
                {isLoading ? t("loading") + "..." : t("login")}
              </Text>
            </Animated.View>
          </Pressable>

          {/* Redirect to Signup */}
          <Pressable onPress={() => !isLoading && router.push("/(auth)/signup")} disabled={isLoading} className="items-center">
            <Text className={`${isLoading ? "text-gray-400" : "text-gray-600"}`}>
              {t("dontHaveAccount")}{" "}
              <Text className={isLoading ? "text-green-400" : "text-green-600 font-semibold"}>{t("register")}</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

