// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Button,
//   FlatList,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { techniciansAPI } from "../../lib/api";

// // Define the correct TypeScript type for each task
// type Task = {
//   id: number;
//   complaint: {
//     id: number;
//     title: string;
//     description: string;
//     status: string;
//   };
// };

// export default function TasksScreen() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const data = await techniciansAPI.getMyTasks();
//       setTasks(data);
//     } catch (err: any) {
//       Alert.alert("Error", err?.message || "Failed to fetch tasks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Only pass id and status -- matches your backend signature
//   const handleStatusChange = async (id: number, newStatus: string) => {
//     try {
//       await techniciansAPI.updateTaskStatus(id, newStatus);
//       Alert.alert("Success", `Task updated to ${newStatus}`);
//       fetchTasks();
//     } catch (err: any) {
//       Alert.alert("Error", err?.message || "Failed to update task");
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   if (loading)
//     return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

//   return (
//     <FlatList
//       data={tasks}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={({ item }) => (
//         <View style={styles.card}>
//           <Text style={styles.title}>
//             {item.complaint?.title ?? "No Title"}
//           </Text>
//           <Text>{item.complaint?.description ?? "No Description"}</Text>
//           <Text>Status: {item.complaint?.status ?? "Unknown"}</Text>
//           <Button
//             title="Mark as Resolved"
//             onPress={() => handleStatusChange(item.id, "RESOLVED")}
//           />
//         </View>
//       )}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   card: { padding: 15, margin: 10, borderWidth: 1, borderRadius: 10 },
//   title: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
// });
