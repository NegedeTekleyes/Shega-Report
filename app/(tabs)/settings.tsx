import { useAuth } from "@/providers/auth-providers";
import { useLanguage } from "@/providers/language-providers";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Define types for our settings items
interface SettingsItem {
  icon: string;
  label: string;
  type: "switch" | "action";
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function SettingScreen() {
  const { user, logout } = useAuth();
  const { t, language, changeLanguage } = useLanguage();

  const [settings, setSettings] = useState({
    notifications: true,
    locationServices: true,
    dataSaver: false,
    autoUpdate: true,
    darkMode: false,
  });

  const handleLogout = async () => {
    console.log("LOGOUT BUTTON PRESSED");
    // setMenuVisible(false);

    try {
      console.log(" 1. Calling logout function...");
      console.log(" Current user before logout:", user);

      await logout();

      console.log("2. Logout function completed");
      console.log("🔄 Checking auth state after logout...");

      // Add a small delay to ensure state updates
      setTimeout(() => {
        console.log("3. Navigating to welcome screen...");
        router.replace("/(auth)/welcome");
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      // Alert.alert("Error", "Logout failed: " + error.message);
    }
  };

  const handleContactSupport = () => {
    Linking.openURL("mailto:support@shegareport.com");
  };

  const handleRateApp = () => {
    Alert.alert(t("rateApp"), t("thankYou"));
  };

  const copyAppVersion = async () => {
    Alert.alert(t("appVersion"), "ShegaReport v1.0.0", [{ text: t("ok") }]);
  };

  const settingsSections: SettingsSection[] = [
    {
      title: t("preferences"),
      items: [
        {
          icon: "notifications",
          label: t("notifications"),
          type: "switch",
          value: settings.notifications,
          onValueChange: (value) =>
            setSettings((prev) => ({ ...prev, notifications: value })),
        },
        {
          icon: "language",
          label: t("language"),
          type: "action",
          onPress: () => changeLanguage(language === "en" ? "am" : "en"),
        },
        // {
        //     icon: 'moon',
        //     label: t('darkMode'),
        //     type: 'switch',
        //     value: settings.darkMode,
        //     onValueChange: (value) => setSettings(prev => ({ ...prev, darkMode: value }))
        // }
      ],
    },
    {
      title: t("privacySecurity"),
      items: [
        {
          icon: "lock-closed",
          label: t("privacyPolicy"),
          type: "action",
          onPress: () => router.push("/privacys"),
        },
        {
          icon: "shield-checkmark",
          label: t("termsOfService"),
          type: "action",
          onPress: () => router.push("/terms"),
        },
        {
          icon: "location",
          label: t("locationServices"),
          type: "switch",
          value: settings.locationServices,
          onValueChange: (value) =>
            setSettings((prev) => ({ ...prev, locationServices: value })),
        },
      ],
    },
    {
      title: t("support"),
      items: [
        {
          icon: "help-circle",
          label: t("helpCenter"),
          type: "action",
          onPress: () => router.push("/help"),
        },
        {
          icon: "chatbubble-ellipses",
          label: t("contactSupport"),
          type: "action",
          onPress: handleContactSupport,
        },
        {
          icon: "document-text",
          label: t("reportProblem"),
          type: "action",
          onPress: () => router.push("/reports"),
        },
      ],
    },
    {
      title: t("about"),
      items: [
        {
          icon: "information",
          label: t("aboutApp"),
          type: "action",
          onPress: () => router.push("/(modals)/about"),
        },
        {
          icon: "star",
          label: t("rateApp"),
          type: "action",
          onPress: handleRateApp,
        },
        {
          icon: "share-social",
          label: t("shareApp"),
          type: "action",
          onPress: () => Alert.alert(t("share"), t("sharingComingSoon")),
        },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-gray-400">
      {/* Header */}
      <View className="px-6 pt-12 pb-4 bg-[#0a5398ff]">
        <Text className="text-xl font-bold text-white">{t("settings")}</Text>
        <Text className="text-green-100 text-sm mt-1">
          {t("customizeExperience")}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pb-4">
        {/* Account Section */}
        <View className="rounded-xl p-4 mt-4 bg-[#15bdc6ff] shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold mb-3 text-gray-900">
            {t("account")}
          </Text>

          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-green-100 rounded-full justify-center items-center mr-3">
              <Text className="text-green-700 text-lg font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">{user?.name}</Text>
              <Text className="text-sm text-gray-800">{user?.email}</Text>
              <Text className="text-xs text-gray-700 capitalize">
                {user?.role}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="flex-row items-center justify-between py-3 border-t border-gray-100"
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out" size={20} color="#160404ff" />
              <Text className="text-black font-bold ml-3">{t("logout")}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View
            key={sectionIndex}
            className="rounded-xl p-4 mt-4 bg-[#15bdc6ff] shadow-sm border border-gray-100"
          >
            <Text className="text-lg font-semibold mb-4 text-gray-900">
              {section.title}
            </Text>

            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                className={`flex-row items-center justify-between py-3 ${
                  itemIndex < section.items.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
                onPress={item.onPress}
                disabled={item.type === "switch"}
              >
                <View className="flex-row items-center flex-1">
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color="#6B7280"
                    className="mr-3"
                  />
                  <Text className="flex-1 text-gray-900">{item.label}</Text>
                </View>

                {item.type === "switch" ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    trackColor={{ false: "#5b95ecff", true: "#0c5feeff" }}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* App Version */}
        <TouchableOpacity
          onPress={copyAppVersion}
          className="items-center mt-6"
        >
          <Text className="text-sm text-gray-900">ShegaReport v1.0.0</Text>
          <Text className="text-xs mt-1 mb-2 text-gray-900">
            {t("servingCommunity")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
