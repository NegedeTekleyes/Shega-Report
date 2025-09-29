import LoadingScreen from "@/components/loadingScreen";
import { useAuth } from "@/providers/auth-providers";
import { useLanguage } from "@/providers/language-providers";
import { Redirect, Stack } from "expo-router";

export default function TechnicianLayout() {
  // Fixed spelling: "Technician"
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user || user.role !== "technician") {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#f5f5f5" },
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          title: t("technician.dashboard") || "Technician Dashboard",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="assigned-tasks"
        options={{
          title: t("technician.assignedTasks") || "Assigned Tasks",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="task-details"
        options={{
          title: t("technician.taskDetails") || "Task Details",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: t("technician.profile") || "Profile",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
