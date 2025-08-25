import { View, Text, Image, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState("");
  const [userName, setUserName] = useState("John Doe");
  const [userEmail, setUserEmail] = useState("johndoe@example.com");

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Select Profile Photo",
      "Choose an option",
      [
        {
          text: "Choose from Library",
          onPress: pickImage,
        },
        {
          text: "Take Photo",
          onPress: takePhoto,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const handleLogout = () => {
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
          onPress: () => {
            // Perform logout actions here
            console.log("User logged out");
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 py-6">
      {/* Header */}
      <View className="bg-white px-6 py-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 text-center">My Profile</Text>
      </View>

      {/* User Info Section */}
      <View className="items-center bg-white px-6 py-8 mx-6 mt-6 rounded-xl shadow-sm">
        <View className="relative mb-4">
          <Image
            source={{ uri: profileImage }}
            className="w-32 h-32 rounded-full border-2 border-green-600"
          />
          <TouchableOpacity 
            onPress={showImagePickerOptions}
            className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full border-2 border-white"
          >
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-2xl font-bold text-gray-800">{userName}</Text>
        <Text className="text-gray-500 mt-1">{userEmail}</Text>
        
        {/* <TouchableOpacity 
          className="mt-4 bg-green-100 px-6 py-2 rounded-full"
          onPress={() => router.push("/(modals)/edit-profile")}
        >
          <Text className="text-green-700 font-medium">Edit Profile</Text>
        </TouchableOpacity> */}
      </View>

      {/* Menu Items */}
      <View className="bg-white mx-6 mb-8 rounded-xl shadow-sm overflow-hidden">
        <TouchableOpacity
          className="flex-row items-center px-6 py-4 border-b border-gray-100"
          onPress={() => router.push("/(tabs)/settings")}
        >
          <View className="bg-green-100 p-3 rounded-lg mr-4">
            <Ionicons name="settings-outline" size={22} color="#16a34a" />
          </View>
          <Text className="text-lg flex-1 text-gray-700">Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center px-6 py-4 border-b border-gray-100"
          onPress={() => router.push("/(tabs)/notification")}
        >
          <View className="bg-green-100 p-3 rounded-lg mr-4">
            <Ionicons name="notifications-outline" size={22} color="#16a34a" />
          </View>
          <Text className="text-lg flex-1 text-gray-700">Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center px-6 py-4 border-b border-gray-100"
          onPress={() => router.push("/(modals)/support")}
        >
          <View className="bg-green-100 p-3 rounded-lg mr-4">
            <Ionicons name="help-circle-outline" size={22} color="#16a34a" />
          </View>
          <Text className="text-lg flex-1 text-gray-700">Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center px-6 py-4"
          onPress={() => router.push("/(modals)/about")}
        >
          <View className="bg-green-100 p-3 rounded-lg mr-4">
            <Ionicons name="information-circle-outline" size={22} color="#16a34a" />
          </View>
          <Text className="text-lg flex-1 text-gray-700">About</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        className="mx-6 mb-10 bg-red-50 py-4 rounded-xl shadow-sm"
        onPress={handleLogout}
      >
        <Text className="text-red-600 text-center font-semibold text-lg">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}