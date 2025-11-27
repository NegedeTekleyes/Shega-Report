// app/(technician)/task/[id].tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Image,
  Linking,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { techniciansAPI } from '@/lib/api';

interface TaskDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: string;
  location: any;
  photos: any[];
  createdAt: string;
  assignedAt: string;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
  technician?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // const loadTaskDetail = async () => {
  //   try {
  //     setLoading(true);
  //     const taskId = Array.isArray(id) ? id[0] : id;

  //     if(!taskId){
  //       throw new Error("No task ID provided")
  //     }
  //     console.log('🔄 Loading task detail for ID:', taskId);
  //     console.log("Full id parameter:", id)

  //     const parsedTaskId = parseInt(taskId as string)
  //     console.log("Parsed task ID:", parsedTaskId)
      
  //     if(isNaN(parsedTaskId)){
  //       throw new Error(`Invalid task ID: ${taskId}`)
  //     }
  //     console.log("Calling techniciansAPI.getTaskDetail...")
  //     const response = await techniciansAPI.getTaskDetail(parsedTaskId);
  //     console.log('✅ Task detail response:', response);
  //     setTask(response);
  //   } catch (error) {
  //     console.error('❌ Error loading task detail:', error);
  //     Alert.alert('Error', 'Failed to load task details. Plase try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };





  // const updateStatus = async (newStatus: string) => {
  //   try {
  //     setUpdating(true);
  //     const taskId = Array.isArray(id) ? id[0] : id;
  //     await techniciansAPI.updateTaskStatus(parseInt(taskId as string), newStatus);
      
  //     Alert.alert('Success', `Status updated to ${newStatus.replace('_', ' ')}`);
  //     loadTaskDetail(); // Refresh data
  //   } catch (error) {
  //     console.error('Error updating task status:', error);
  //     Alert.alert('Error', 'Failed to update status');
  //   } finally {
  //     setUpdating(false);
  //   }
  // };

  const loadTaskDetail = async () => {
  try {
    setLoading(true);

    const raw = Array.isArray(id) ? id[0] : id;

    if (!raw || isNaN(Number(raw))) {
      console.log("❌ Invalid task id:", raw);
      Alert.alert("Error", "Invalid task ID");
      return;
    }

    const taskId = Number(raw);
    const response = await techniciansAPI.getTaskDetail(taskId);

    setTask(response);
  } catch (error) {
    console.error("❌ Error loading task:", error);
    Alert.alert("Error", "Failed to load task");
  } finally {
    setLoading(false);
  }
};


  const updateStatus = async (newStatus: string) => {
  try {
    setUpdating(true);

    const raw = Array.isArray(id) ? id[0] : id;

    if (!raw || isNaN(Number(raw))) {
      console.log("❌ Invalid ID in updateStatus:", raw);
      Alert.alert("Error", "Invalid task ID");
      return;
    }

    const taskId = Number(raw);

    await techniciansAPI.updateTaskStatus(taskId, newStatus);

    Alert.alert("Success", "Status updated");
    loadTaskDetail();
  } catch (error) {
    console.error("❌ Error updating status:", error);
    Alert.alert("Error", "Failed to update status");
  } finally {
    setUpdating(false);
  }
};

  const openMaps = () => {
    if (task?.location) {
      // Handle location - it might be a string or object
      let locationUrl = '';
      
      if (typeof task.location === 'string') {
        // If location is a string address
        locationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`;
      } else if (task.location.latitude && task.location.longitude) {
        // If location has coordinates
        locationUrl = `https://www.google.com/maps/dir/?api=1&destination=${task.location.latitude},${task.location.longitude}`;
      }
      
      if (locationUrl) {
        Linking.openURL(locationUrl);
      } else {
        Alert.alert('Error', 'No valid location data available');
      }
    }
  };

  const callUser = () => {
    if (task?.user?.phone) {
      Linking.openURL(`tel:${task.user.phone}`);
    } else {
      Alert.alert('Error', 'No phone number available for this user');
    }
  };

  useEffect(() => {
    if (id) {
      loadTaskDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0a5398" />
        <Text className="text-gray-600 mt-4">Loading task details...</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Ionicons name="alert-circle" size={64} color="#6B7280" />
        <Text className="text-gray-600 mt-4 text-lg">Task not found</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-[#0a5398] px-6 py-3 rounded-xl mt-4"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return '#F59E0B';
      case 'IN_PROGRESS': return '#3B82F6';
      case 'RESOLVED': return '#10B981';
      case 'CANCELLED': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'EMERGENCY': return '#DC2626';
      case 'HIGH': return '#EF4444';
      case 'MEDIUM': return '#F59E0B';
      case 'LOW': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#0a5398] px-6 pt-12 pb-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Task Details</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Task Info */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {task.title}
          </Text>
          
          <Text className="text-gray-600 mb-4">{task.description}</Text>
          
          <View className="flex-row flex-wrap gap-2 mb-4">
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-blue-700 text-sm">
                {task.category?.replace('_', ' ') || 'Unknown Category'}
              </Text>
            </View>
            <View 
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: getUrgencyColor(task.urgency) + '20' }}
            >
              <Text 
                className="text-sm font-medium"
                style={{ color: getUrgencyColor(task.urgency) }}
              >
                {task.urgency?.toLowerCase() || 'unknown'} urgency
              </Text>
            </View>
            <View 
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: getStatusColor(task.status) + '20' }}
            >
              <Text 
                className="text-sm font-medium"
                style={{ color: getStatusColor(task.status) }}
              >
                {task.status?.replace('_', ' ') || 'unknown status'}
              </Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Location
          </Text>
          
          {task.location ? (
            <>
              <Text className="text-gray-600 mb-3">
                {typeof task.location === 'string' 
                  ? task.location 
                  : task.location.address || 'Location available'
                }
              </Text>
              <TouchableOpacity 
                onPress={openMaps}
                className="bg-green-500 py-3 rounded-xl flex-row items-center justify-center"
              >
                <Ionicons name="navigate" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Open in Maps
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text className="text-gray-500 italic">No location provided</Text>
          )}
        </View>

        {/* Contact Info */}
        {task.user && (
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Reporter Information
            </Text>
            <Text className="text-gray-600 mb-2">Name: {task.user.name}</Text>
            <Text className="text-gray-600 mb-2">Email: {task.user.email}</Text>
            {task.user.phone ? (
              <TouchableOpacity 
                onPress={callUser}
                className="bg-blue-500 py-2 px-4 rounded-xl flex-row items-center self-start"
              >
                <Ionicons name="call" size={16} color="white" />
                <Text className="text-white font-medium ml-2">
                  Call: {task.user.phone}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-gray-500 text-sm">No phone number provided</Text>
            )}
          </View>
        )}

        {/* Photos */}
        {task.photos && task.photos.length > 0 && (
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Issue Photos ({task.photos.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {task.photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: typeof photo === 'string' ? photo : photo.url }}
                    className="w-32 h-32 rounded-lg"
                    resizeMode="cover"
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Status Actions */}
        <View className="bg-white rounded-xl p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Update Status
          </Text>
          
          <View className="space-y-3">
            {task.status !== 'IN_PROGRESS' && task.status !== 'RESOLVED' && (
              <TouchableOpacity
                onPress={() => updateStatus('IN_PROGRESS')}
                disabled={updating}
                className="bg-blue-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-semibold text-lg">
                  {updating ? 'Updating...' : 'Start Work'}
                </Text>
              </TouchableOpacity>
            )}

            {task.status === 'IN_PROGRESS' && (
              <TouchableOpacity
                onPress={() => updateStatus('RESOLVED')}
                disabled={updating}
                className="bg-green-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-semibold text-lg">
                  {updating ? 'Updating...' : 'Mark as Resolved'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => updateStatus('CANCELLED')}
              disabled={updating}
              className="bg-red-500 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-lg">
                Cancel Task
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Task Metadata */}
        <View className="bg-white rounded-xl p-4 mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Task Information
          </Text>
          <View className="space-y-2">
            <Text className="text-gray-600">
              <Text className="font-medium">Created:</Text> {new Date(task.createdAt).toLocaleDateString()}
            </Text>
            <Text className="text-gray-600">
              <Text className="font-medium">Assigned:</Text> {new Date(task.assignedAt).toLocaleDateString()}
            </Text>
            <Text className="text-gray-600">
              <Text className="font-medium">Task ID:</Text> {task.id}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}