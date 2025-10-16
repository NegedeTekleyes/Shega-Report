// app/(tabs)/index.tsx
import { useAuth } from "@/providers/auth-providers";
import { useLanguage } from "@/providers/language-providers";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface ReportStats {
  total: number;
  resolved: number;
  pending: number;
  inProgress: number;
}

interface RecentActivity {
  id: string;
  type: string;
  status: "pending" | "in-progress" | "resolved" | "rejected";
  time: string;
  location: string;
  category: string;
  createdAt: string;
}

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const [menuVisible, setMenuVisible] = useState(false);
  const [stats, setStats] = useState<ReportStats>({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Fetch user's report data
  const fetchUserData = async () => {
    try {
      console.log("=== FETCH USER REPORTS DEBUG ===");
      const token = await AsyncStorage.getItem("token");
      console.log("Token exists:", !!token);

      if (!token) {
        console.log("No token found");
        setFallbackData();
        return;
      }

      const API_BASE = "http://192.168.1.3:3000";
      const url = `${API_BASE}/complaints/my-complaints`;
      console.log("Fetching from URL:", url);

      const reportsResponse = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", reportsResponse.status);

      if (reportsResponse.ok) {
        const userReports = await reportsResponse.json();

        // Calculate statistics
        const calculatedStats: ReportStats = {
          total: userReports.length,
          resolved: userReports.filter(
            (report: any) => report.status === "resolved"
          ).length,
          pending: userReports.filter(
            (report: any) => report.status === "pending"
          ).length,
          inProgress: userReports.filter(
            (report: any) => report.status === "in-progress"
          ).length,
        };

        setStats(calculatedStats);

        // Format recent activities (last 5 reports)
        const formattedActivities: RecentActivity[] = userReports
          .slice(0, 5)
          .map((report: any) => ({
            id: report.id,
            type: report.title || getCategoryLabel(report.category, language),
            status: report.status || "pending",
            time: formatTimeAgo(report.createdAt, language),
            location:
              report.location ||
              report.locationData?.address ||
              "Unknown location",
            category: report.category,
            createdAt: report.createdAt,
          }));

        setRecentActivities(formattedActivities);
      } else {
        console.error("Failed to fetch user reports");
        setFallbackData();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setFallbackData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fallback to mock data if API fails
  const setFallbackData = () => {
    setStats({
      total: 0,
      resolved: 0,
      pending: 0,
      inProgress: 0,
    });
    setRecentActivities([]);
  };

  // Helper function to get category label
  const getCategoryLabel = (category: string, lang: string): string => {
    const categories: { [key: string]: { en: string; am: string } } = {
      water_leak: { en: "Water Leak Report", am: "የውሃ ፍሳሽ ሪፖርት" },
      no_water: { en: "No Water Supply", am: "ውሃ አለመገኘት" },
      dirty_water: { en: "Dirty Water Report", am: "እርጥበት ውሃ ሪፖርት" },
      sanitation: { en: "Sanitation Issue", am: "ንፅህና ችግር" },
      pipe_burst: { en: "Pipe Repair", am: "የቧንቧ ጥገና" },
      drainage: { en: "Drainage Problem", am: "የመፍሰሻ ችግር" },
    };

    return categories[category]?.[lang === "am" ? "am" : "en"] || category;
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string, lang: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (lang === "am") {
      if (diffInHours < 1) return "አዲስ";
      if (diffInHours < 24) return `${diffInHours} ሰዓት በፊት`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} ቀን በፊት`;
      return `${Math.floor(diffInHours / 168)} ሳምንት በፊት`;
    } else {
      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
      return `${Math.floor(diffInHours / 168)} weeks ago`;
    }
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "resolved":
        return {
          icon: "checkmark-done" as const,
          color: "#10B981",
          text: language === "en" ? "Resolved" : "ተጠናቋል",
        };
      case "in-progress":
        return {
          icon: "time" as const,
          color: "#F59E0B",
          text: language === "en" ? "In Progress" : "በሂደት ላይ",
        };
      case "rejected":
        return {
          icon: "close" as const,
          color: "#EF4444",
          text: language === "en" ? "Rejected" : "ተቀባይነት አላገኘም",
        };
      default:
        return {
          icon: "time-outline" as const,
          color: "#6B7280",
          text: language === "en" ? "Pending" : "በጥበቃ",
        };
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const handleLogout = async () => {
    console.log("LOGOUT BUTTON PRESSED");
    setMenuVisible(false);

    try {
      console.log("1. Calling logout function...");
      await logout();
      console.log("2. Logout function completed");

      setTimeout(() => {
        console.log("3. Navigating to welcome screen...");
        router.replace("/(auth)/welcome");
      }, 100);
    } catch (error: any) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Logout failed: " + error.message);
    }
  };

  const statsCards = [
    {
      icon: "water-outline" as const,
      label: t("reportsSubmitted"),
      value: stats.total.toString(),
      color: "#3B82F6",
      gradient: ["#3B82F6", "#60A5FA"],
    },
    {
      icon: "checkmark-done-outline" as const,
      label: t("issuesResolved"),
      value: stats.resolved.toString(),
      color: "#10B981",
      gradient: ["#10B981", "#34D399"],
    },
    {
      icon: "time-outline" as const,
      label: t("pendingIssues"),
      value: (stats.pending + stats.inProgress).toString(),
      color: "#F59E0B",
      gradient: ["#F59E0B", "#FBBF24"],
    },
  ];

  const quickActions = [
    {
      icon: "add-circle",
      label: t("reportIssue"),
      screen: "/reports",
      color: "#EF4444",
      gradient: ["#EF4444", "#F87171"],
    },
    {
      icon: "map",
      label: t("viewMap"),
      screen: "/map",
      color: "#8B5CF6",
      gradient: ["#8B5CF6", "#A78BFA"],
    },
    {
      icon: "list",
      label: t("myReports"),
      screen: "/reports-history",
      color: "#06B6D4",
      gradient: ["#06B6D4", "#22D3EE"],
    },
    {
      icon: "notifications",
      label: t("notifications"),
      screen: "/(tabs)/notification",
      color: "#F97316",
      gradient: ["#F97316", "#FB923C"],
    },
  ];

  const getRoleStyles = (role?: string) => {
    switch (role) {
      case "admin":
        return { bg: "bg-red-100", text: "text-red-800" };
      case "technician":
        return { bg: "bg-blue-400", text: "text-red-800" };
      default:
        return { bg: "bg-green-100", text: "text-green-800" };
    }
  };

  const roleStyles = getRoleStyles(user?.role);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">{t("loading")}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#0a5398ff", "#15bdc6ff"]}
        className="px-6 pt-12 pb-8 rounded-b-3xl"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">ShegaReport</Text>
            <Text className="text-blue-100 text-sm">
              {t("waterManagement")}
            </Text>
          </View>

          <View className="relative">
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              className="w-10 h-10 bg-white/20 rounded-full justify-center items-center border-2 border-white/30"
            >
              <Text className="text-white font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={menuVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setMenuVisible(false)}
            >
              <TouchableOpacity
                className="flex-1 bg-black/40"
                activeOpacity={1}
                onPress={() => setMenuVisible(false)}
              />
              <View className="absolute top-14 right-4 bg-white rounded-xl shadow-lg p-3 w-40">
                <TouchableOpacity
                  className="flex-row items-center p-2"
                  onPress={() => {
                    setMenuVisible(false);
                    router.push("/(tabs)/profile");
                  }}
                >
                  <Ionicons
                    name="person-circle-outline"
                    size={20}
                    color="black"
                  />
                  <Text className="ml-2 text-black">Profile</Text>
                </TouchableOpacity>
                <View className="h-px bg-gray-200 my-1" />
                <TouchableOpacity
                  className="flex-row items-center px-4 py-3 rounded-lg active:bg-gray-100"
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="black" />
                  <Text className="ml-2 text-black">Logout</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </View>

        {/* Welcome Section */}
        <Animated.View
          entering={FadeInDown.delay(200)}
          className="bg-white/10 p-5 rounded-3xl border border-white/20"
        >
          <Text className="text-white text-lg font-semibold mb-1">
            👋 {t("welcome")}, {user?.name}!
          </Text>
          <Text className="text-green-100 text-sm mb-3">{user?.email}</Text>
          <View className="flex-row items-center justify-between">
            <View className={`px-4 py-2 rounded-full ${roleStyles.bg}`}>
              <Text className={`text-xs font-semibold ${roleStyles.text}`}>
                {user?.role?.toUpperCase() || "USER"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location" size={14} color="#FFDE00" />
              <Text className="text-yellow-300 text-xs ml-1">Debre Birhan</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Statistics Cards */}
        <Text className="text-xl font-bold mt-6 mb-4 text-gray-800">
          {t("overview")}
        </Text>

        <View className="flex-row justify-between mb-6 -mx-1.5">
          {statsCards.map((stat, index) => (
            <Animated.View
              key={stat.label}
              entering={FadeInDown.delay(300 + index * 100)}
              className="w-[31%] mx-1.5 mb-3"
            >
              <LinearGradient
                colors={stat.gradient}
                className="p-4 rounded-2xl shadow-lg aspect-square min-h-[120px]"
              >
                <View className="items-center justify-center h-full">
                  <View className="w-12 h-12 bg-white/20 rounded-full justify-center items-center mb-2">
                    <Ionicons name={stat.icon} size={24} color="white" />
                  </View>
                  <Text className="text-white text-2xl font-bold">
                    {stat.value}
                  </Text>
                  <Text className="text-white/90 text-xs text-center mt-1">
                    {stat.label}
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text className="text-xl font-bold mb-4 text-gray-800">
          {t("quickActions")}
        </Text>

        <View className="flex-row flex-wrap justify-between mb-6">
          {quickActions.map((action, index) => (
            <Animated.View
              key={action.label}
              entering={FadeInUp.delay(500 + index * 100)}
              className="w-[48%] mb-4"
            >
              <TouchableOpacity
                onPress={() => router.push(action.screen as any)}
                className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 active:scale-95"
              >
                <View className="items-center">
                  <LinearGradient
                    colors={action.gradient}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons name={action.icon} size={28} color="white" />
                  </LinearGradient>
                </View>
                <Text className="text-gray-800 font-semibold text-center text-sm">
                  {action.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Recent Activity */}
        <Text className="text-xl font-bold mb-4 text-gray-800">
          {t("recentActivity")}
        </Text>

        <View className="mb-8">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => {
              const statusInfo = getStatusInfo(activity.status);
              return (
                <Animated.View
                  key={activity.id}
                  entering={FadeInUp.delay(700 + index * 100)}
                  className="bg-white rounded-2xl shadow-sm p-4 mb-3 border border-gray-100"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center mr-3">
                        <Ionicons
                          name={statusInfo.icon}
                          size={20}
                          color={statusInfo.color}
                        />
                      </View>
                      <View>
                        <Text className="text-gray-800 font-semibold">
                          {activity.type}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {activity.location}
                        </Text>
                      </View>
                    </View>
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${statusInfo.color}20` }}
                    >
                      <Text
                        className="text-xs font-medium"
                        style={{ color: statusInfo.color }}
                      >
                        {statusInfo.text}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-400 text-xs">{activity.time}</Text>
                </Animated.View>
              );
            })
          ) : (
            <View className="bg-white rounded-2xl p-6 items-center">
              <Ionicons
                name="document-text-outline"
                size={48}
                color="#D1D5DB"
              />
              <Text className="text-gray-500 mt-2 text-center">
                {language === "en"
                  ? "No reports yet. Submit your first issue!"
                  : "እስካሁን ምንም ሪፖርት የለም። የመጀመሪያዎን ችግር ይለግሱ!"}
              </Text>
              <TouchableOpacity
                className="bg-blue-600 px-4 py-2 rounded-lg mt-3"
                onPress={() => router.push("/reports")}
              >
                <Text className="text-white font-semibold">
                  {t("reportIssue")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Emergency Quick Action */}
        <Animated.View
          entering={FadeInUp.delay(900)}
          className="bg-red-50 rounded-2xl p-5 mb-8 border border-red-200"
        >
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 bg-red-100 rounded-full justify-center items-center mr-3">
              <Ionicons name="warning" size={24} color="#EF4444" />
            </View>
            <View className="flex-1">
              <Text className="text-red-800 font-semibold text-lg">
                {language === "en" ? "Emergency Issue?" : "አስቸኳይ ችግር?"}
              </Text>
              <Text className="text-red-600 text-sm">
                {language === "en"
                  ? "Report critical issues immediately"
                  : "አስቸኳይ ችግሮችን ወዲያውኑ ይለግሱ"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-red-600 py-3 rounded-xl"
            onPress={() => router.push("/reports")}
          >
            <Text className="text-white font-semibold text-center">
              {language === "en" ? "Report Emergency" : "አስቸኳይ ሪፖርት"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
