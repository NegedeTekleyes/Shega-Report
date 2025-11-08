import { useLanguage } from "@/providers/language-providers";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const { t, language, changeLanguage } = useLanguage();

  return (
    <LinearGradient colors={["#0a5398", "#15bdc6"]} className="flex-1">
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        {/* Header with Language Button */}
        <View className="flex-row justify-between items-center px-6 pt-4">
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color="#FFDE00" />
            <Text className="italic text-[#FFDE00] text-sm font-medium ml-2">
              Debre Birhan
            </Text>
          </View>

          <TouchableOpacity
            className="flex-row items-center bg-white/20 px-4 py-2 rounded-full"
            onPress={() => changeLanguage(language === "en" ? "am" : "en")}
          >
            <Ionicons name="globe" size={18} color="#FFFFFF" />
            <Text className="text-white font-semibold text-base ml-2">
              {language === "en" ? "አማርኛ" : "English"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center items-center px-6">
          {/* Title */}
          <View className="items-center mb-8">
            <Text className="text-white text-4xl font-bold mb-2 text-center">
              Shega
              <Text className="text-[#FFDE00]">Report</Text>
            </Text>
            <Text className="text-white/90 text-center text-base font-medium">
              {language === "en"
                ? "Water & Sanitation Management"
                : "የውሃ እና የንፅህና አስተዳደር"}
            </Text>
          </View>

          {/* Stats Banner */}
          <View className="bg-white/10 rounded-2xl p-5 mb-8 w-[90%] border border-white/10 flex-row justify-around items-center">
            <View className="items-center flex-1">
              <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
              <Text className="text-white text-lg font-bold mt-2">1.2K+</Text>
              <Text className="text-white/80 text-xs text-center mt-1">
                {language === "en" ? "Issues Resolved" : "የተፈቱ ችግሮች"}
              </Text>
            </View>

            <View className="h-10 w-px bg-white/30" />

            <View className="items-center flex-1">
              <Ionicons name="people" size={24} color="#9b60fa" />
              <Text className="text-white text-lg font-bold mt-2">5K+</Text>
              <Text className="text-white/80 text-xs text-center mt-1">
                {language === "en" ? "Active Users" : "ንቁ ተጠቃሚዎች"}
              </Text>
            </View>

            <View className="h-10 w-px bg-white/30" />

            <View className="items-center flex-1">
              <Ionicons name="time" size={24} color="#FBBF24" />
              <Text className="text-white text-lg font-bold mt-2">12/7</Text>
              <Text className="text-white/80 text-xs text-center mt-1">
                {language === "en" ? "Support" : "ድጋፍ"}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View className="w-full space-y-4 mb-8 ">
            <TouchableOpacity
              className="bg-white py-5 rounded-2xl items-center "
              onPress={() => router.push("/(auth)/login")}
            >
              <View className="flex-row items-center">
                <Ionicons name="log-in" size={24} color="#009639" />
                <Text className="text-[#009639] font-bold text-lg ml-2">
                  {t("login")}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="border-2 mt-4 border-white/50 bg-white/10 py-5 rounded-2xl items-center"
              onPress={() => router.push("/(auth)/signup")}
            >
              <View className="flex-row items-center">
                <Ionicons name="person-add" size={24} color="#FFFFFF" />
                <Text className="text-white font-bold text-lg ml-2">
                  {t("register")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Feature Highlights */}
          <View className="w-full mb-6">
            <View className="flex-row justify-between mb-4">
              {[
                { text: language === "en" ? "Fast Response" : "ፈጣን ምላሽ" },
                { text: language === "en" ? "Easy Reporting" : "ቀላል ሪፖርት" },
                { text: language === "en" ? "GPS Tracking" : "ጂፒኤስ ክትትል" },
              ].map((item, index) => (
                <View key={index} className="flex-1 items-center px-1">
                  <Text className="italic text-white/80 text-xs text-center">
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
