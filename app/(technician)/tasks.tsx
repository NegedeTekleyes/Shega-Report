// // import React, { useEffect, useState } from "react";
// // import {
// //   FlatList,
// //   RefreshControl,
// //   Text,
// //   TouchableOpacity,
// //   View,
// //   Button,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Alert,
// // } from "react-native";
// // import { apiRequest } from "@/lib/api";
// // import { useRouter } from "expo-router";
// // import { useAuth } from "@/providers/auth-providers";

// // type Complaint = {
// //   id: number;
// //   title: string;
// //   description: string;
// //   status: string;
// // };

// // type Task = {
// //   id: number;
// //   technicianId: number;
// //   complaint: Complaint;
// // };

// // export default function TechnicianTasksScreen() {
// //   const { token } = useAuth();
// //   const router = useRouter();
// //   const [tasks, setTasks] = useState<Task[]>([]);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [loading, setLoading] = useState(true);

// //   const fetchTasks = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await apiRequest(
// //         "/technicians/my-tasks",
// //         { method: "GET" },
// //         token
// //       );
// //       setTasks(Array.isArray(data) ? data : data.tasks ?? []);
// //     } catch (e: any) {
// //       Alert.alert("Error", e?.message || "Failed to fetch tasks");
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   };

// //   // PATCH task status
// //   const handleStatusChange = async (id: number, newStatus: string) => {
// //     try {
// //       await apiRequest(
// //         `/technicians/task/${id}/status`,
// //         {
// //           method: "PATCH",
// //           body: JSON.stringify({ status: newStatus }),
// //           headers: { "Content-Type": "application/json" },
// //         },
// //         token
// //       );
// //       Alert.alert("Success", `Task updated to ${newStatus}`);
// //       fetchTasks();
// //     } catch (err: any) {
// //       Alert.alert("Error", err?.message || "Failed to update task");
// //     }
// //   };

// //   useEffect(() => {
// //     if (token) fetchTasks();
// //   }, [token]);

// //   if (loading) {
// //     return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
// //   }

// //   return (
// //     <View style={{ flex: 1, padding: 16 }}>
// //       <FlatList
// //         data={tasks}
// //         keyExtractor={(item) => item.id.toString()}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={() => {
// //               setRefreshing(true);
// //               fetchTasks();
// //             }}
// //           />
// //         }
// //         renderItem={({ item }) => (
// //           <TouchableOpacity
// //             style={styles.card}
// //             onPress={() => router.push(`/task/${item.id}`)}
// //           >
// //             <Text style={styles.title}>
// //               {item.complaint?.title ?? "No Title"}
// //             </Text>
// //             <Text>
// //               Status: {item.complaint?.status ?? "Unknown"}
// //             </Text>
// //             <Text numberOfLines={2}>
// //               {item.complaint?.description ?? "No Description"}
// //             </Text>
// //             <Button
// //               title="Mark as Resolved"
// //               onPress={() => handleStatusChange(item.id, "RESOLVED")}
// //             />
// //           </TouchableOpacity>
// //         )}
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   card: {
// //     padding: 12,
// //     backgroundColor: "#fff",
// //     marginBottom: 8,
// //     borderRadius: 8,
// //   },
// //   title: {
// //     fontWeight: "bold",
// //     fontSize: 16,
// //     marginBottom: 5,
// //   },
// // });


// // screens/task-detail.tsx
// import React, { useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   ScrollView, 
//   TouchableOpacity, 
//   Alert,
//   Image,
//   Linking 
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface TaskDetail {
//   id: number;
//   title: string;
//   description: string;
//   category: string;
//   urgency: string;
//   status: string;
//   location: string;
//   locationData?: {
//     latitude: number;
//     longitude: number;
//     address: string;
//   };
//   photos: string[];
//   createdAt: string;
//   assignedAt: string;
//   user: {
//     name: string;
//     phone?: string;
//   };
// }

// export default function TaskDetailScreen() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const [task, setTask] = useState<TaskDetail | null>(null);
//   const [updating, setUpdating] = useState(false);

//   // Load task details (you'd implement this)
//   useEffect(() => {
//     loadTaskDetail();
//   }, [id]);

//   const updateStatus = async (newStatus: string) => {
//     try {
//       setUpdating(true);
//       const token = await AsyncStorage.getItem('token');
      
//       const response = await fetch(
//         `http://192.168.1.6:3000/technicians/task-detail/${id}/status`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({ status: newStatus })
//         }
//       );

//       if (response.ok) {
//         Alert.alert('Success', `Status updated to ${newStatus.replace('_', ' ')}`);
//         loadTaskDetail(); // Refresh data
//         router.back(); // Go back to dashboard
//       } else {
//         Alert.alert('Error', 'Failed to update status');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update status');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const openMaps = () => {
//     if (task?.locationData) {
//       const { latitude, longitude } = task.locationData;
//       const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
//       Linking.openURL(url);
//     }
//   };

//   const callUser = () => {
//     if (task?.user.phone) {
//       Linking.openURL(`tel:${task.user.phone}`);
//     }
//   };

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-[#0a5398] px-6 pt-12 pb-6">
//         <View className="flex-row items-center">
//           <TouchableOpacity onPress={() => router.back()} className="mr-4">
//             <Ionicons name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//           <Text className="text-white text-xl font-bold">Task Details</Text>
//         </View>
//       </View>

//       <ScrollView className="flex-1 px-6 py-6">
//         {/* Task Info */}
//         <View className="bg-white rounded-xl p-4 mb-4">
//           <Text className="text-2xl font-bold text-gray-800 mb-2">
//             {task?.title}
//           </Text>
          
//           <Text className="text-gray-600 mb-4">{task?.description}</Text>
          
//           <View className="flex-row flex-wrap gap-2 mb-4">
//             <View className="bg-blue-50 px-3 py-1 rounded-full">
//               <Text className="text-blue-700 text-sm">{task?.category}</Text>
//             </View>
//             <View className="bg-orange-50 px-3 py-1 rounded-full">
//               <Text className="text-orange-700 text-sm">
//                 {task?.urgency} urgency
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Location */}
//         {task?.locationData && (
//           <View className="bg-white rounded-xl p-4 mb-4">
//             <Text className="text-lg font-semibold text-gray-800 mb-3">
//               Location
//             </Text>
//             <Text className="text-gray-600 mb-3">{task.location}</Text>
//             <TouchableOpacity 
//               onPress={openMaps}
//               className="bg-green-500 py-3 rounded-xl flex-row items-center justify-center"
//             >
//               <Ionicons name="navigate" size={20} color="white" />
//               <Text className="text-white font-semibold ml-2">
//                 Open in Maps
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Contact Info */}
//         {task?.user && (
//           <View className="bg-white rounded-xl p-4 mb-4">
//             <Text className="text-lg font-semibold text-gray-800 mb-3">
//               Reporter Information
//             </Text>
//             <Text className="text-gray-600 mb-2">Name: {task.user.name}</Text>
//             {task.user.phone && (
//               <TouchableOpacity 
//                 onPress={callUser}
//                 className="bg-blue-500 py-2 px-4 rounded-xl flex-row items-center self-start"
//               >
//                 <Ionicons name="call" size={16} color="white" />
//                 <Text className="text-white font-medium ml-2">
//                   Call: {task.user.phone}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}

//         {/* Photos */}
//         {task?.photos && task.photos.length > 0 && (
//           <View className="bg-white rounded-xl p-4 mb-4">
//             <Text className="text-lg font-semibold text-gray-800 mb-3">
//               Issue Photos ({task.photos.length})
//             </Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               <View className="flex-row gap-3">
//                 {task.photos.map((photo, index) => (
//                   <Image
//                     key={index}
//                     source={{ uri: photo }}
//                     className="w-32 h-32 rounded-lg"
//                   />
//                 ))}
//               </View>
//             </ScrollView>
//           </View>
//         )}

//         {/* Status Actions */}
//         <View className="bg-white rounded-xl p-4">
//           <Text className="text-lg font-semibold text-gray-800 mb-4">
//             Update Status
//           </Text>
          
//           <View className="space-y-3">
//             <TouchableOpacity
//               onPress={() => updateStatus('IN_PROGRESS')}
//               disabled={updating || task?.status === 'IN_PROGRESS'}
//               className={`bg-blue-500 py-3 rounded-xl items-center ${
//                 (updating || task?.status === 'IN_PROGRESS') ? 'opacity-50' : ''
//               }`}
//             >
//               <Text className="text-white font-semibold text-lg">
//                 {updating ? 'Updating...' : 'Start Work'}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => updateStatus('RESOLVED')}
//               disabled={updating || task?.status === 'RESOLVED'}
//               className={`bg-green-500 py-3 rounded-xl items-center ${
//                 (updating || task?.status === 'RESOLVED') ? 'opacity-50' : ''
//               }`}
//             >
//               <Text className="text-white font-semibold text-lg">
//                 Mark as Resolved
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => updateStatus('CANCELLED')}
//               disabled={updating}
//               className="bg-red-500 py-3 rounded-xl items-center"
//             >
//               <Text className="text-white font-semibold text-lg">
//                 Cancel Task
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// function loadTaskDetail() {
//   throw new Error('Function not implemented.');
// }
