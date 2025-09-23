import { View, Text, Image, TouchableOpacity, Alert, ScrollView, TextInput, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/providers/auth-providers';
import { useLanguage } from '@/providers/language-providers';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { user, logout, updateUserProfile } = useAuth();
  const { t, language } = useLanguage();
  
  const [profileImage, setProfileImage] = useState(user?.photoURL || "");
  const [userName, setUserName] = useState(user?.name || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");
  const [userPhone, setUserPhone] = useState(user?.phone || "");
  const [userLocation, setUserLocation] = useState(user?.location || "");
  
  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState("");
  const [editValue, setEditValue] = useState("");
  
  // Loading states
  const [isUpdating, setIsUpdating] = useState(false);

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setUserName(user.name || "");
      setUserEmail(user.email || "");
      setUserPhone(user.phone || "");
      setUserLocation(user.location || "");
      setProfileImage(user.photoURL || "");
    }
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('permissionRequired'), t('cameraRollPermission'));
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await updateProfileImage(result.assets[0].uri);
    }
  };
const getRoleStyles = () => {
  if (!user?.role) return { bg: 'bg-green-100', text: 'text-green-800' };
  
  switch(user.role) {
    case 'technician':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    default:
      return { bg: 'bg-green-100', text: 'text-green-800' };
  }
};

const roleStyles = getRoleStyles();
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('permissionRequired'), t('cameraPermission'));
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await updateProfileImage(result.assets[0].uri);
    }
  };

  const updateProfileImage = async (imageUri: string) => {
    try {
      setIsUpdating(true);
      // Here you would upload the image to your backend
      // For now, we'll just update locally
      setProfileImage(imageUri);
      
      // Update in auth context/backend
      await updateUserProfile({ photoURL: imageUri });
      
      Alert.alert(t('success'), t('profileImageUpdated'));
    } catch (error) {
      Alert.alert(t('error'), t('updateFailed'));
    } finally {
      setIsUpdating(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      t('selectProfilePhoto'),
      t('chooseOption'),
      [
        {
          text: t('chooseFromLibrary'),
          onPress: pickImage,
        },
        {
          text: t('takePhoto'),
          onPress: takePhoto,
        },
        {
          text: t('cancel'),
          style: "cancel",
        },
      ]
    );
  };

  const handleEditField = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editValue.trim()) {
      Alert.alert(t('error'), t('fieldCannotBeEmpty'));
      return;
    }

    try {
      setIsUpdating(true);
      const updates: any = { [editingField]: editValue };
      
      await updateUserProfile(updates);
      
      // Update local state
      switch (editingField) {
        case 'name': setUserName(editValue); break;
        case 'phone': setUserPhone(editValue); break;
        case 'location': setUserLocation(editValue); break;
      }
      
      setEditModalVisible(false);
      Alert.alert(t('success'), t('profileUpdated'));
    } catch (error) {
      Alert.alert(t('error'), t('updateFailed'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('confirmLogout'),
      [
        {
          text: t('cancel'),
          style: "cancel"
        },
        { 
          text: t('logout'), 
          onPress: () => {
            logout();
            router.replace('/(auth)/welcome');
          }
        }
      ]
    );
  };

  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      name: language === 'en' ? 'Full Name' : 'ሙሉ ስም',
      phone: language === 'en' ? 'Phone Number' : 'ስልክ ቁጥር',
      location: language === 'en' ? 'Location' : 'አድራሻ'
    };
    return labels[field] || field;
  };

  return (
    <ScrollView className="flex-1 bg-gray-400">
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.duration(500)} 
        className="bg-[#0a5398ff] px-6 pt-12 pb-6"
      >
        <Text className="text-xl font-bold text-white text-center">
          {t('myProfile')}
        </Text>
      </Animated.View>

      {/* User Info Section */}
      <Animated.View 
        entering={FadeInDown.delay(200)}
        className="items-center bg-[#15bdc6ff] px-6 py-8 mx-6 mt-6 rounded-xl shadow-sm"
      >
        <View className="relative mb-4">
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              className="w-32 h-32 rounded-full border-4 border-green-100"
            />
          ) : (
            <View className="w-32 h-32 rounded-full border-4 border-green-100 bg-green-200 justify-center items-center">
              <Text className="text-4xl font-bold text-green-600">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            onPress={showImagePickerOptions}
            disabled={isUpdating}
            className="absolute bottom-0 right-0 bg-green-600 p-3 rounded-full border-4 border-white"
          >
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        <Text className="text-2xl font-bold text-gray-800 text-center">
          {userName || t('noName')}
        </Text>
        <Text className="text-gray-500 mt-1 text-center">
          {userEmail}
        </Text>
        
        {/* User Role Badge */}
        <View className={`px-4 py-1 rounded-full mt-3 ${roleStyles.bg}`}>
  <Text className={`text-sm font-semibold ${roleStyles.text}`}>
    {user?.role?.toUpperCase() || 'USER'}
  </Text>
</View>
      </Animated.View>

      {/* User Details Section */}
      <Animated.View 
        entering={FadeInDown.delay(400)}
        className="bg-[#15bdc6ff] mx-6 mt-6 rounded-xl shadow-sm overflow-hidden"
      >
        <Text className="text-lg font-semibold text-gray-800 px-6 py-4 border-b border-gray-100">
          {t('personalInformation')}
        </Text>
        
        {/* Editable Fields */}
        <TouchableOpacity
          className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100"
          onPress={() => handleEditField('name', userName)}
        >
          <View className="flex-1">
            <Text className="text-sm text-gray-600">{t('fullName')}</Text>
            <Text className="text-gray-800 mt-1">{userName || t('notSet')}</Text>
          </View>
          <Ionicons name="create-outline" size={20} color="#6B7280" />
        </TouchableOpacity>

        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <View className="flex-1">
            <Text className="text-sm text-gray-500">{t('email')}</Text>
            <Text className="text-gray-800 mt-1">{userEmail}</Text>
          </View>
          <Text className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
            {t('cannotEdit')}
          </Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100"
          onPress={() => handleEditField('phone', userPhone)}
        >
          <View className="flex-1">
            <Text className="text-sm text-gray-500">{t('phoneNumber')}</Text>
            <Text className="text-gray-800 mt-1">{userPhone || t('notSet')}</Text>
          </View>
          <Ionicons name="create-outline" size={20} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between px-6 py-4"
          onPress={() => handleEditField('location', userLocation)}
        >
          <View className="flex-1">
            <Text className="text-sm text-gray-500">{t('location')}</Text>
            <Text className="text-gray-800 mt-1">{userLocation || t('notSet')}</Text>
          </View>
          <Ionicons name="create-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View 
        entering={FadeInDown.delay(600)}
        className="bg-[#15bdc6ff] mx-6 mt-6 rounded-xl shadow-sm overflow-hidden"
      >
        <TouchableOpacity
          className="flex-row items-center px-6 py-4 border-b border-gray-100"
          onPress={() => router.push("/(tabs)/settings")}
        >
          <View className="bg-blue-100 p-3 rounded-lg mr-4">
            <Ionicons name="settings-outline" size={22} color="#3B82F6" />
          </View>
          <Text className="text-lg flex-1 text-gray-700">{t('settings')}</Text>
          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center px-6 py-4 border-b border-gray-100"
          onPress={() => router.push("/(tabs)/notification")}
        >
          <View className="bg-orange-100 p-3 rounded-lg mr-4">
            <Ionicons name="notifications-outline" size={22} color="#F97316" />
          </View>
          <Text className="text-lg flex-1 text-gray-700">{t('notifications')}</Text>
          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center px-6 py-4 border-b border-gray-100"
          onPress={() => router.push("/(modals)/support")}
        >
          <View className="bg-purple-100 p-3 rounded-lg mr-4">
            <Ionicons name="help-circle-outline" size={22} color="#8B5CF6" />
          </View>
          <Text className="text-lg flex-1 text-gray-700">{t('support')}</Text>
          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center px-6 py-4"
          onPress={() => router.push("/(modals)/about")}
        >
          <View className="bg-green-100 p-3 rounded-lg mr-4">
            <Ionicons name="information-circle-outline" size={22} color="#10B981" />
          </View>
          <Text className="text-lg flex-1 text-gray-700">{t('about')}</Text>
          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </TouchableOpacity>
      </Animated.View>

      {/* Logout Button */}
      <Animated.View 
        entering={FadeInDown.delay(800)}
        className="mx-6 mt-6 mb-10"
      >
        <TouchableOpacity
          className="bg-[#0a5398ff] py-4 rounded-xl shadow-sm border border-red-200"
          onPress={handleLogout}
        >
          <Text className="text-red-600 text-center font-semibold text-lg">
            {t('logout')}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              {t('edit')} {getFieldLabel(editingField)}
            </Text>
            
            <TextInput
              value={editValue}
              onChangeText={setEditValue}
              className="border border-gray-300 rounded-xl px-4 py-3 mt-4 text-gray-800"
              placeholder={t('enterValue')}
              autoFocus
            />
            
            <View className="flex-row justify-end space-x-3 mt-6">
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                className="px-4 py-2 rounded-lg"
              >
                <Text className="text-gray-600 font-medium">{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={saveEdit}
                disabled={isUpdating}
                className="bg-green-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">
                  {isUpdating ? t('saving') : t('save')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}