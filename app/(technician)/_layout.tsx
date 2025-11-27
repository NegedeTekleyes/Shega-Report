// import { useAuth } from "@/providers/auth-providers";
// import { Redirect, Stack } from "expo-router";

// export default function TechnicianLayout() {
//   const { user } = useAuth();

//   if (user?.role?.toUpperCase() !== "TECHNICIAN") {
//     return <Redirect href="/(auth)/welcome" />;
//   }
  
//   return (
//     <Stack>
//       <Stack.Screen name="index" options={{ title: "Technician Home" }} />
//       <Stack.Screen name="TasksScreen" options={{ title: "My Tasks" }} />
//     </Stack>
//   );
// }