import { useAuth } from "@/providers/auth-providers";
import { useLanguage } from "@/providers/language-providers";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TechnicianTask {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: "low" | "medium" | "high" | "emergency";
  location: string;
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled";
  assignedDate: string;
  residentName: string;
  residentPhone: string;
  estimatedDuration?: string;
  priority: number;
}

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [tasks, setTasks] = useState<TechnicianTask[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
  });

  useEffect(() => {
    loadTechnicianTasks();
  }, []);

  const loadTechnicianTasks = async () => {
    try {
      // Mock data - replace with API call
      const mockTasks: TechnicianTask[] = [
        {
          id: "1",
          title: "Water Leak Repair",
          description:
            "Major water leak in kitchen pipe needs immediate attention",
          category: "water_leak",
          urgency: "high",
          location: "Kebele 03, House #25",
          status: "assigned",
          assignedDate: "2024-09-20",
          residentName: "John Doe",
          residentPhone: "+251911223344",
          estimatedDuration: "2 hours",
          priority: 1,
        },
        {
          id: "2",
          title: "Pipe Replacement",
          description: "Replace old rusted pipes in bathroom",
          category: "pipe_burst",
          urgency: "medium",
          location: "Kebele 05, House #12",
          status: "in-progress",
          assignedDate: "2024-09-19",
          residentName: "Sarah Smith",
          residentPhone: "+251922334455",
          estimatedDuration: "4 hours",
          priority: 2,
        },
        {
          id: "3",
          title: "Drainage Cleaning",
          description: "Clear blocked drainage system",
          category: "drainage",
          urgency: "medium",
          location: "Kebele 02, House #8",
          status: "completed",
          assignedDate: "2024-09-18",
          residentName: "Mike Johnson",
          residentPhone: "+251933445566",
          estimatedDuration: "1 hour",
          priority: 3,
        },
      ];

      setTasks(mockTasks);
      calculateStats(mockTasks);
    } catch (error) {
      Alert.alert(t("error"), t("failedToLoadTasks"));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTechnicianTasks();
    setRefreshing(false);
  };

  const calculateStats = (tasks: TechnicianTask[]) => {
    setStats({
      total: tasks.length,
      pending: tasks.filter(
        (t) => t.status === "pending" || t.status === "assigned"
      ).length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      highPriority: tasks.filter(
        (t) => t.urgency === "high" || t.urgency === "emergency"
      ).length,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-500";
      case "in-progress":
        return "bg-blue-100 border-blue-500";
      case "assigned":
        return "bg-yellow-100 border-yellow-500";
      case "pending":
        return "bg-gray-100 border-gray-500";
      default:
        return "bg-red-100 border-red-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t("completed");
      case "in-progress":
        return t("inProgress");
      case "assigned":
        return t("assigned");
      case "pending":
        return t("pending");
      default:
        return t("cancelled");
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-green-600 bg-green-100";
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      // Update task status - replace with API call
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus as any } : task
        )
      );

      Alert.alert(t("success"), t("taskStatusUpdated"));
    } catch (error) {
      Alert.alert(t("error"), t("updateFailed"));
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="bg-blue-600 px-6 pt-12 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-white text-2xl font-bold">
              {t("technicianDashboard")}
            </Text>
            <Text className="text-blue-200 mt-1">
              {t("welcome")}, {user?.name}
            </Text>
            <Text className="text-blue-200 text-sm mt-1">
              {user?.specialization} • {t("active")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(technician)/profile")}
            className="bg-blue-500 p-2 rounded-full"
          >
            <Ionicons name="person-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistics Cards */}
      <View className="px-6 py-4 -mt-4">
        <View className="flex-row flex-wrap justify-between">
          <View className="bg-white p-4 rounded-xl shadow-sm w-[48%] mb-3">
            <View className="flex-row items-center">
              <View className="bg-blue-100 p-2 rounded-lg">
                <Ionicons name="list-circle" size={24} color="#2563eb" />
              </View>
              <View className="ml-3">
                <Text className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </Text>
                <Text className="text-gray-600 text-sm">{t("totalTasks")}</Text>
              </View>
            </View>
          </View>

          <View className="bg-white p-4 rounded-xl shadow-sm w-[48%] mb-3">
            <View className="flex-row items-center">
              <View className="bg-red-100 p-2 rounded-lg">
                <Ionicons name="warning" size={24} color="#dc2626" />
              </View>
              <View className="ml-3">
                <Text className="text-2xl font-bold text-red-600">
                  {stats.highPriority}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {t("highPriority")}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white p-4 rounded-xl shadow-sm w-[48%]">
            <View className="flex-row items-center">
              <View className="bg-yellow-100 p-2 rounded-lg">
                <Ionicons name="time" size={24} color="#d97706" />
              </View>
              <View className="ml-3">
                <Text className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </Text>
                <Text className="text-gray-600 text-sm">{t("pending")}</Text>
              </View>
            </View>
          </View>

          <View className="bg-white p-4 rounded-xl shadow-sm w-[48%]">
            <View className="flex-row items-center">
              <View className="bg-green-100 p-2 rounded-lg">
                <Ionicons name="checkmark-circle" size={24} color="#059669" />
              </View>
              <View className="ml-3">
                <Text className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </Text>
                <Text className="text-gray-600 text-sm">{t("completed")}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 py-4">
        <Text className="text-lg font-semibold mb-3">{t("quickActions")}</Text>
        <View className="flex-row flex-wrap gap-3">
          <TouchableOpacity
            onPress={() => router.push("/(technician)/assigned-tasks")}
            className="bg-blue-600 px-4 py-3 rounded-xl flex-row items-center flex-1 min-w-[48%]"
          >
            <Ionicons name="list" size={20} color="white" />
            <Text className="text-white font-medium ml-2 text-center">
              {t("viewAllTasks")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(technician)/assigned-tasks")}
            className="bg-green-600 px-4 py-3 rounded-xl flex-row items-center flex-1 min-w-[48%]"
          >
            <Ionicons name="person" size={20} color="white" />
            <Text className="text-white font-medium ml-2 text-center">
              {t("myProfile")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Tasks */}
      <View className="px-6 py-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold">{t("recentTasks")}</Text>
          <TouchableOpacity
            onPress={() => router.push("/(technician)/assigned-tasks")}
          >
            <Text className="text-blue-600 font-medium">{t("viewAll")}</Text>
          </TouchableOpacity>
        </View>

        {tasks.slice(0, 3).map((task) => (
          <TouchableOpacity
            key={task.id}
            onPress={() =>
              router.push(`/(technician)/task-details?id=${task.id}`)
            }
            className="bg-white p-4 rounded-xl shadow-sm mb-3"
          >
            <View className="flex-row justify-between items-start mb-2">
              <Text className="font-semibold flex-1 mr-2 text-base">
                {task.title}
              </Text>
              <View
                className={`px-2 py-1 rounded-full ${getUrgencyColor(
                  task.urgency
                )}`}
              >
                <Text className="text-xs font-medium capitalize">
                  {task.urgency}
                </Text>
              </View>
            </View>

            <Text className="text-gray-600 text-sm mb-2">
              {task.description}
            </Text>

            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <Ionicons name="location" size={14} color="#6b7280" />
                <Text className="text-gray-500 text-sm ml-1">
                  {task.location}
                </Text>
              </View>
              <View
                className={`px-2 py-1 rounded-full border ${getStatusColor(
                  task.status
                )}`}
              >
                <Text
                  className={`text-xs font-medium ${
                    task.status === "completed"
                      ? "text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  {getStatusText(task.status)}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500 text-sm">{task.residentName}</Text>
              <Text className="text-gray-500 text-sm">
                {task.estimatedDuration}
              </Text>
            </View>

            {/* Quick Action Buttons */}
            {task.status !== "completed" && (
              <View className="flex-row gap-2 mt-3">
                {task.status === "assigned" && (
                  <TouchableOpacity
                    onPress={() => updateTaskStatus(task.id, "in-progress")}
                    className="bg-blue-500 px-3 py-1 rounded-full flex-1"
                  >
                    <Text className="text-white text-xs text-center font-medium">
                      {t("startTask")}
                    </Text>
                  </TouchableOpacity>
                )}
                {task.status === "in-progress" && (
                  <TouchableOpacity
                    onPress={() => updateTaskStatus(task.id, "completed")}
                    className="bg-green-500 px-3 py-1 rounded-full flex-1"
                  >
                    <Text className="text-white text-xs text-center font-medium">
                      {t("markComplete")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}

        {tasks.length === 0 && (
          <View className="bg-white p-6 rounded-xl items-center">
            <Ionicons name="checkmark-done-circle" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-2 text-center">
              {t("noAssignedTasks")}
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              {t("noTasksDescription")}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
