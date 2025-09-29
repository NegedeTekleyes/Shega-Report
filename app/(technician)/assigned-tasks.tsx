import { useLanguage } from "@/providers/language-providers";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
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

export default function AssignedTasks() {
  const { t } = useLanguage();
  const router = useRouter();
  const [tasks, setTasks] = useState<TechnicianTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TechnicianTask[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "in-progress" | "completed"
  >("all");

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, statusFilter]);

  const loadTasks = async () => {
    // Mock data - same as dashboard
    const mockTasks: TechnicianTask[] = [
      // ... same tasks as above
    ];
    setTasks(mockTasks);
  };

  const filterTasks = () => {
    let filtered = tasks;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "assigned":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return { icon: "warning", color: "#dc2626" };
      case "high":
        return { icon: "flash", color: "#ea580c" };
      case "medium":
        return { icon: "time", color: "#d97706" };
      default:
        return { icon: "checkmark", color: "#16a34a" };
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          {t("assignedTasks")}
        </Text>
      </View>

      {/* Filters and Search */}
      <View className="p-4 bg-white border-b border-gray-200">
        <TextInput
          className="bg-gray-100 px-4 py-3 rounded-lg mb-3"
          placeholder={t("searchTasks")}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row gap-2"
        >
          {["all", "pending", "in-progress", "completed"].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-full ${
                statusFilter === status ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <Text
                className={
                  statusFilter === status
                    ? "text-white font-medium"
                    : "text-gray-800"
                }
              >
                {status === "all"
                  ? t("all")
                  : status === "pending"
                  ? t("pending")
                  : status === "in-progress"
                  ? t("inProgress")
                  : t("completed")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tasks List */}
      <View className="p-4">
        {filteredTasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            onPress={() =>
              router.push(`/(technician)/task-details?id=${task.id}`)
            }
            className="bg-white p-4 rounded-xl shadow-sm mb-3"
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1 mr-2">
                <Text className="font-semibold text-lg mb-1">{task.title}</Text>
                <Text className="text-gray-600 text-sm">
                  {task.description}
                </Text>
              </View>
              <Ionicons
                name={getUrgencyIcon(task.urgency).icon as any}
                size={20}
                color={getUrgencyIcon(task.urgency).color}
              />
            </View>

            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <Ionicons name="location" size={14} color="#6b7280" />
                <Text className="text-gray-500 text-sm ml-1">
                  {task.location}
                </Text>
              </View>
              <Text className="text-gray-500 text-sm">
                {task.estimatedDuration}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View
                className={`px-3 py-1 rounded-full ${getStatusColor(
                  task.status
                )}`}
              >
                <Text className="text-xs font-medium capitalize">
                  {task.status === "in-progress"
                    ? t("inProgress")
                    : task.status === "completed"
                    ? t("completed")
                    : task.status === "assigned"
                    ? t("assigned")
                    : t("pending")}
                </Text>
              </View>
              <Text className="text-gray-500 text-sm">{task.assignedDate}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredTasks.length === 0 && (
          <View className="bg-white p-8 rounded-xl items-center">
            <Ionicons name="search" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-2 text-center text-lg">
              {t("noTasksFound")}
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              {t("tryDifferentFilter")}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
