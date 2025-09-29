import { useLanguage } from "@/providers/language-providers";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const { t } = useLanguage();
  const router = useRouter();

  // Mock task data based on ID
  const task = {
    id: id as string,
    title: "Water Leak Repair",
    description:
      "Major water leak in kitchen pipe needs immediate attention. Resident reported water flooding the kitchen area.",
    category: "water_leak",
    urgency: "high",
    location: "Kebele 03, House #25",
    status: "assigned",
    assignedDate: "2024-09-20",
    residentName: "John Doe",
    residentPhone: "+251911223344",
    estimatedDuration: "2 hours",
    priority: 1,
    specialInstructions: "Bring pipe replacement tools and sealing materials.",
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-blue-600 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">{task.title}</Text>
        <Text className="text-blue-200 mt-1">Task #{task.id}</Text>
      </View>

      <View className="p-6 space-y-6">
        <View className="bg-white p-4 rounded-xl">
          <Text className="font-semibold text-lg mb-2">Task Details</Text>
          <Text className="text-gray-600">{task.description}</Text>
        </View>

        <View className="bg-white p-4 rounded-xl">
          <Text className="font-semibold text-lg mb-3">
            Resident Information
          </Text>
          <View className="space-y-2">
            <Text>Name: {task.residentName}</Text>
            <Text>Phone: {task.residentPhone}</Text>
            <Text>Location: {task.location}</Text>
          </View>
        </View>

        <TouchableOpacity className="bg-green-600 p-4 rounded-xl">
          <Text className="text-white text-center font-semibold">
            Start Task
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
