import { useLanguage } from "@/providers/language-providers";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AuthLayout() {
  const {t } = useLanguage();
  return (
    <View className="flex-1 bg-white">
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#16a34a" },
          headerTintColor: "#ffffff",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false,
        }}
      >
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: t("login") }} />
        <Stack.Screen name="signup" options={{ title: t("register") }} />
        <Stack.Screen
          name="reset-password"
          options={{ title: t("register") }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({});
