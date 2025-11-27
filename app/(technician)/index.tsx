import { complaintsAPI } from "@/lib/api";
import { useAuth } from "@/providers/auth-providers";
import { useEffect, useState } from "react";
import { 
  Alert, 
  FlatList, 
  RefreshControl, 
  TouchableOpacity, 
  View, 
  Text,
  Image 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Task = {
  id: number;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED';
  location: string;
  createdAt: string;
  assignedAt: string;
  photos: string[];
  locationData?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  user?: {
    name: string;
    phone?: string;
  };
};

export default function TechnicianDashboard() {
  const { user, logout } = useAuth(); 
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    total: 0
  });

  const fetchTasks = async () => {
    try {
      const res = await complaintsAPI.getAssignedComplaints();
      const data = res?.complaints || res || [];
      setTasks(data);

      // Calculate stats
      const assigned = data.filter((t: Task) => t.status === 'ASSIGNED').length;
      const inProgress = data.filter((t: Task) => t.status === 'IN_PROGRESS').length;
      const resolved = data.filter((t: Task) => t.status === 'RESOLVED').length;
      
      setStats({ 
        assigned, 
        inProgress, 
        resolved, 
        total: data.length 
      });
    } catch (error: any) {
      console.error("Error fetching technician tasks:", error);
      Alert.alert("Error", "Failed to load tasks");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  // Logout function
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout(); // Call your auth provider's logout
              // If you need to manually clear storage
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');
              router.replace('/(auth)/login'); // Adjust to your login route
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert("Error", "Failed to logout");
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://192.168.1.4:3000/technicians/task/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        Alert.alert('Success', `Status updated to ${newStatus.replace('_', ' ')}`);
        fetchTasks(); // Refresh the list
      } else {
        Alert.alert('Error', 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

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
      case 'emergency': return '#DC2626';
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusActions = (task: Task) => {
    switch (task.status) {
      case 'ASSIGNED':
        return (
          <TouchableOpacity
            onPress={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
            className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
          >
            <Ionicons name="play" size={16} color="white" />
            <Text className="text-white font-medium ml-2">Start Work</Text>
          </TouchableOpacity>
        );
      case 'IN_PROGRESS':
        return (
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => updateTaskStatus(task.id, 'RESOLVED')}
              className="bg-green-500 px-4 py-2 rounded-lg flex-row items-center"
            >
              <Ionicons name="checkmark" size={16} color="white" />
              <Text className="text-white font-medium ml-2">Resolve</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(technician)/tasks/${item.id}`)}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      {/* Header with title and status */}
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-800 flex-1 mr-2" numberOfLines={2}>
          {item.title}
        </Text>
        <View 
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: getStatusColor(item.status) + '20' }}
        >
          <Text 
            className="text-xs font-medium"
            style={{ color: getStatusColor(item.status) }}
          >
            {item.status.replace('_', ' ')}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
        {item.description}
      </Text>

      {/* Category and Urgency */}
      <View className="flex-row items-center mb-3">
        <View 
          className="px-2 py-1 rounded-full mr-2"
          style={{ backgroundColor: getUrgencyColor(item.urgency) + '20' }}
        >
          <Text 
            className="text-xs font-medium"
            style={{ color: getUrgencyColor(item.urgency) }}
          >
            {item.urgency.toUpperCase()}
          </Text>
        </View>
        <Text className="text-gray-500 text-xs">
          {item.category.replace('_', ' ')}
        </Text>
      </View>

      {/* Location - FIXED: Handle both string and object locations */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="location" size={14} color="#6B7280" />
        <Text className="text-gray-500 text-xs ml-1 flex-1" numberOfLines={1}>
          {typeof item.location === 'string' 
            ? item.location 
            : item.locationData?.address || 
              `${item.locationData?.latitude?.toFixed(6)}, ${item.locationData?.longitude?.toFixed(6)}` ||
              'Location not available'
          }
        </Text>
      </View>

      {/* Photos Preview */}
      {item.photos && item.photos.length > 0 && (
        <View className="flex-row mb-3">
          <Ionicons name="images" size={14} color="#6B7280" />
          <Text className="text-gray-500 text-xs ml-1">
            {item.photos.length} photo(s)
          </Text>
        </View>
      )}

      {/* Footer with date and actions */}
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-400 text-xs">
          Assigned: {new Date(item.assignedAt).toLocaleDateString()}
        </Text>
        {getStatusActions(item)}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#0a5398] px-6 pt-12 pb-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-2xl font-bold">
              Welcome, {user?.name || "Technician"}
            </Text>
            <Text className="text-blue-100 mt-1">
              {stats.total} task(s) assigned
            </Text>
          </View>
          
          {/* Header Icons - Refresh and Logout */}
          <View className="flex-row items-center space-x-8">
            <TouchableOpacity onPress={onRefresh}
            className="p-2">
              <Ionicons name="refresh" size={24} color="white" />
            </TouchableOpacity>
              <View className="h-6 w-px bg-white/30" />

            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout}
            className="p-2">
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Stats Overview */}
      <View className="px-6 py-4">
        <View className="flex-row justify-between bg-white rounded-xl p-4 shadow-sm">
          <View className="items-center">
            <Text className="text-2xl font-bold text-orange-500">{stats.assigned}</Text>
            <Text className="text-gray-600 text-sm">Assigned</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-500">{stats.inProgress}</Text>
            <Text className="text-gray-600 text-sm">In Progress</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-500">{stats.resolved}</Text>
            <Text className="text-gray-600 text-sm">Resolved</Text>
          </View>
        </View>
      </View>

      {/* Tasks List */}
      <View className="flex-1 px-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          My Tasks ({tasks.length})
        </Text>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTaskItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="bg-white rounded-xl p-8 items-center mt-8">
              <Ionicons name="checkmark-done-circle" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 text-lg mt-4 text-center">
                No tasks assigned to you yet
              </Text>
              <Text className="text-gray-400 text-sm mt-2 text-center">
                Tasks assigned by admin will appear here
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}