import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useLocalSearchParams();

  useEffect(() => {
    console.log("Reset password token:", token);

    if (!token) {
      Alert.alert(
        "Error",
        "Invalid reset link. Please request a new password reset."
      );
      router.replace("/(auth)/login");
    }
  }, [token]);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please enter both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending reset request with token:", token);

      const res = await fetch("http://localhost:3000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword,
        }),
      });

      const data = await res.json();
      console.log("Reset response:", data);

      if (res.ok) {
        Alert.alert(
          "Success",
          "Password reset successfully! You can now login with your new password.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(auth)/login"),
            },
          ]
        );
      } else {
        Alert.alert("Error", data.message || "Failed to reset password");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      Alert.alert(
        "Error",
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#0a5398ff", "#15bdc6ff"]} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View className="flex-1 justify-center items-center px-6 py-8">
          {/* Header */}
          <Animated.View
            entering={FadeInUp.delay(100)}
            className="items-center mb-8"
          >
            <Ionicons name="lock-closed-outline" size={64} color="white" />
            <Text className="text-3xl font-bold mt-4 text-white text-center">
              Set New Password
            </Text>
            <Text className="text-white text-center mt-2 opacity-90">
              Create a new password for your account
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInUp.delay(200)}
            className="bg-white rounded-2xl w-full p-6 shadow-lg"
          >
            {/* New Password Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-semibold">
                New Password
              </Text>
              <View className="flex-row items-center">
                <View className="absolute left-3 z-10">
                  <Ionicons name="lock-closed-outline" size={20} color="gray" />
                </View>
                <TextInput
                  className="flex-1 border border-gray-300 rounded-xl pl-10 pr-10 py-3 text-base"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  editable={!isLoading}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="absolute right-3 z-10"
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters long
              </Text>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-semibold">
                Confirm Password
              </Text>
              <View className="flex-row items-center">
                <View className="absolute left-3 z-10">
                  <Ionicons name="lock-closed-outline" size={20} color="gray" />
                </View>
                <TextInput
                  className="flex-1 border border-gray-300 rounded-xl pl-10 pr-10 py-3 text-base"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!isLoading}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="absolute right-3 z-10"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              onPress={handleResetPassword}
              disabled={isLoading}
              className={`py-4 rounded-xl items-center mb-4 ${
                isLoading ? "bg-green-400" : "bg-green-600"
              }`}
            >
              <Text className="text-white font-semibold text-lg">
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/login")}
              disabled={isLoading}
              className="items-center py-2"
            >
              <Text
                className={`${
                  isLoading ? "text-gray-400" : "text-green-600"
                } font-semibold`}
              >
                Back to Login
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
