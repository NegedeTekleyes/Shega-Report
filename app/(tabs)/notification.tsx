import { useLanguage } from "@/providers/language-providers";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { io, Socket } from "socket.io-client";
import { apiRequest } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SOCKET_URL = "http://192.168.1.4:3000";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  priority: string;
}

export default function NotificationScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { language } = useLanguage();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // FETCH NOTIFICATIONS
  const fetchNotifications = useCallback(async () => {
    try {
      console.log("Loading notifications...");
      const data = await apiRequest<Notification[]>(
        "/notifications/my-notifications",
        true
      );

      setNotifications(
        data.map((n: { id: string; createdAt: string | number | Date; }) => ({
          ...n,
          id: n.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
          createdAt: new Date(n.createdAt),
        }))
      );
    } catch (error) {
      console.log("❌ Failed to load notifications:", error);
    }
  }, []);

  // LOAD TOKEN FOR AUTH & CONNECT SOCKET
  useEffect(() => {
    let socket: Socket;

    const connectSocket = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No token found → cannot connect to socket");
        return;
      }

      console.log("Connecting WebSocket with token");

      socket = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: {
          token: token,
        },
      });

      socket.on("connect", () => {
        console.log("✅ Connected to Notifications WebSocket");
      });

      socket.on("connect_error", (err) => {
        console.log("❌ Socket connection error:", err.message);
      });

      socket.on("new-notification", (data) => {
        console.log("🔥 Received new notification:", data);

        // Create unique ID to prevent duplicate keys
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        setNotifications((prev) => [
          {
            id: uniqueId,
            ...data,
            createdAt: new Date(),
            read: false,
          },
          ...prev,
        ]);
      });

      socket.on("disconnect", () => {
        console.log("🔌 Disconnected from WebSocket");
      });
    };

    fetchNotifications();
    connectSocket();

    // Cleanup function
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [fetchNotifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearAll = () => {
    Alert.alert(
      language === "en" ? "Clear All Notifications" : "ሁሉንም ማስታወቂያዎች አጥፋ",
      language === "en"
        ? "Are you sure?"
        : "በትክክል ሁሉንም ማጥፋት ይፈልጋሉ?",
      [
        { text: language === "en" ? "Cancel" : "ተው", style: "cancel" },
        {
          text: language === "en" ? "Clear All" : "ሁሉንም አጥፋ",
          style: "destructive",
          onPress: () => setNotifications([]),
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications().finally(() => setRefreshing(false));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "issue_update": return { name: "refresh" as const, color: "#0a0303ff" };
      case "new_issue": return { name: "warning" as const, color: "#100606ff" };
      case "resolution": return { name: "checkmark-circle" as const, color: "#100606ff" };
      case "system": return { name: "information" as const, color: "#100606ff" };
      default: return { name: "notifications" as const, color: "#100606ff" };
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return language === "en" ? "Just now" : "አሁን";
    if (minutes < 60) return `${minutes} ${language === "en" ? "min ago" : "ደቂቃ በፊት"}`;
    if (hours < 24) return `${hours} ${language === "en" ? "hours ago" : "ሰዓት በፊት"}`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View className="bg-[#0a5398ff] px-6 pt-12 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-white text-xl font-bold">
              {language === "en" ? "Notifications" : "ማስታወቂያዎች"}
            </Text>
            <Text className="text-green-100 text-sm">
              {unreadCount > 0
                ? `${unreadCount} ${language === "en" ? "unread" : "ያልተነበቡ"}`
                : language === "en"
                ? "All caught up"
                : "ሁሉም ተነትቷል"}
            </Text>
          </View>

          <View className="flex-row space-x-2">
            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={markAllAsRead}
                className="bg-white/20 p-2 rounded-full"
              >
                <Ionicons name="checkmark-done" size={20} color="white" />
              </TouchableOpacity>
            )}
            {notifications.length > 0 && (
              <TouchableOpacity
                onPress={clearAll}
                className="bg-white/20 p-2 rounded-full"
              >
                <Ionicons name="trash" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* NOTIFICATION CONTENT */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={["#0a5398ff"]} 
          />
        }
      >
        <View className="mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            {language === "en" ? "Recent Notifications" : "የቅርብ ጊዜ ማስታወቂያዎች"}
          </Text>

          {notifications.length === 0 ? (
            <View className="bg-[#15bdc6ff] rounded-xl p-8 items-center">
              <Ionicons name="notifications-off" size={64} color="#E5E7EB" />
              <Text className="text-gray-800 text-lg font-medium mt-4 text-center">
                {language === "en"
                  ? "No notifications yet"
                  : "እስካሁን ምንም ማስታወቂያዎች የሉም"}
              </Text>
            </View>
          ) : (
            notifications.map((notification, index) => {
              const icon = getNotificationIcon(notification.type);
              return (
                <Animated.View
                  key={notification.id} 
                  entering={FadeInUp.delay(index * 100)}
                  className={`bg-[#15bdc6ff] rounded-xl p-4 mb-3 shadow-sm ${
                    !notification.read ? "border-l-4 border-green-500" : ""
                  }`}
                >
                  <View className="flex-row items-start space-x-3">
                    <View
                      className="w-10 h-10 rounded-full justify-center items-center mt-1"
                      style={{ backgroundColor: `${icon.color}20` }}
                    >
                      <Ionicons name={icon.name} size={20} color={icon.color} />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row justify-between items-start">
                        <Text className="text-gray-800 font-semibold flex-1">
                          {notification.title}
                        </Text>
                        <Text className="text-gray-400 text-xs">
                          {formatTime(notification.createdAt)}
                        </Text>
                      </View>

                      <Text className="text-gray-600 mt-1 text-sm">
                        {notification.message}
                      </Text>

                      {!notification.read && (
                        <TouchableOpacity
                          onPress={() => markAsRead(notification.id)}
                          className="self-start mt-2"
                        >
                          <Text className="text-green-600 text-xs font-medium">
                            {language === "en"
                              ? "Mark as read"
                              : "እንደተነበበ ምልክት ያድርጉ"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Animated.View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}