import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/providers/auth-providers';
import { useLanguage } from '@/providers/language-providers';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { user, logout, login } = useAuth(); // Added login here
  const { t, language, changeLanguage } = useLanguage();
  const router = useRouter();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('confirmLogout'),
      [
        { 
          text: t('cancel'), 
          style: 'cancel' 
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

  const pickProfilePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          language === 'en' ? 'Permission required' : 'ፍቃድ ያስፈልጋል',
          language === 'en' ? 'Please allow access to your photos' : 'እባክዎ ወደ ፎቶዎች መዳረሻ ይፍቀዱ'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        await updateProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        language === 'en' ? 'Error' : 'ስህተት',
        language === 'en' ? 'Failed to upload photo' : 'ፎቶ ማስቀመጥ አልተቻለም'
      );
    }
  };

  const takeProfilePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          language === 'en' ? 'Camera permission required' : 'የካሜራ ፍቃድ ያስፈልጋል'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        await updateProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(
        language === 'en' ? 'Error' : 'ስህተት',
        language === 'en' ? 'Failed to take photo' : 'ፎቶ መውሰድ አልተቻለም'
      );
    }
  };

  const updateProfilePhoto = async (photoUri: string) => {
    setIsUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user in auth context
      const updatedUser = {
        ...user!,
        profilePhoto: photoUri
      };
      
      // Update user using login function
      login(updatedUser, 'mock-token');
      
      Alert.alert(
        language === 'en' ? 'Success' : 'ተሳክቷል',
        language === 'en' ? 'Profile photo updated!' : 'የመገለጫ ፎቶ ተዘምኗል!'
      );
    } catch (error) {
      console.error('Error updating profile photo:', error);
      Alert.alert(
        language === 'en' ? 'Error' : 'ስህተት',
        language === 'en' ? 'Failed to update profile photo' : 'የመገለጫ ፎቶ ማዘመን አልተቻለም'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeProfilePhoto = () => {
    Alert.alert(
      language === 'en' ? 'Remove Photo' : 'ፎቶ አስወግድ',
      language === 'en' ? 'Are you sure you want to remove your profile photo?' : 'የመገለጫ ፎቶዎን ለማስወገድ እርግጠኛ ነዎት?',
      [
        {
          text: language === 'en' ? 'Cancel' : 'ሰርዝ',
          style: 'cancel'
        },
        {
          text: language === 'en' ? 'Remove' : 'አስወግድ',
          style: 'destructive',
          onPress: async () => {
            const updatedUser = {
              ...user!,
              profilePhoto: undefined
            };
            login(updatedUser, 'mock-token');
          }
        }
      ]
    );
  };

  const showPhotoOptions = () => {
    Alert.alert(
      language === 'en' ? 'Profile Photo' : 'የመገለጫ ፎቶ',
      language === 'en' ? 'Choose an option' : 'አንድ አማራጭ ይምረጡ',
      [
        {
          text: language === 'en' ? 'Take Photo' : 'ፎቶ ይቅረቡ',
          onPress: takeProfilePhoto
        },
        {
          text: language === 'en' ? 'Choose from Gallery' : 'ከፎቶ አልበም ይምረጡ',
          onPress: pickProfilePhoto
        },
        // ...(user?.profilePhoto ? [{
        //   text: language === 'en' ? 'Remove Photo' : 'ፎቶ አስወግድ',
        //   style: 'destructive',
        //   onPress: removeProfilePhoto
        // }] : []),
        // {
        //   text: language === 'en' ? 'Cancel' : 'ሰርዝ',
        //   style: 'cancel'
        // }
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person',
      label: language === 'en' ? 'Edit Profile' : 'መገለጫ አስተካክል',
      onPress: () => setIsEditing(true),
    },
    {
      icon: 'notifications',
      label: language === 'en' ? 'Notifications' : 'ማስታወቂያዎች',
      onPress: () => router.push('/(tabs)/notifications'),
    },
    {
      icon: 'settings',
      label: language === 'en' ? 'Settings' : 'ቅንብሮች',
      onPress: () => router.push('/(tabs)/settings'),
    },
    {
      icon: 'help-circle',
      label: language === 'en' ? 'Help & Support' : 'እርዳታ እና ድጋፍ',
      onPress: () => router.push('/(tabs)/support'),
    },
    {
      icon: 'information',
      label: language === 'en' ? 'About App' : 'ስለ መተግበሪያው',
      onPress: () => router.push('/(tabs)/about'),
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return { bg: 'bg-red-100', text: 'text-red-800' };
      case 'technician': return { bg: 'bg-blue-100', text: 'text-blue-800' };
      default: return { bg: 'bg-green-100', text: 'text-green-800' };
    }
  };

  const roleColors = getRoleColor(user?.role || 'resident');

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={['#009639', '#00B341']}
        className="px-6 pt-12 pb-8 rounded-b-3xl"
      >
        <View className="items-center">
          {/* Profile Photo with Upload Option */}
          <TouchableOpacity 
            onPress={showPhotoOptions}
            disabled={isUploading}
            className="relative mb-4"
          >
            <View className="w-24 h-24 bg-white/20 rounded-full justify-center items-center border-4 border-white/30 overflow-hidden">
              {user?.profilePhoto ? (
                <Image 
                  source={{ uri: user.profilePhoto }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-white text-3xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Text>
              )}
              
              {isUploading && (
                <View className="absolute inset-0 bg-black/50 justify-center items-center">
                  <Ionicons name="cloud-upload" size={32} color="white" />
                </View>
              )}
            </View>
            
            {/* Edit Pencil Icon */}
            <View className="absolute bottom-0 right-0 bg-green-600 rounded-full p-2 border-2 border-white">
              <Ionicons 
                name={isUploading ? "cloud-upload" : "camera"} 
                size={16} 
                color="white" 
              />
            </View>
          </TouchableOpacity>
          
          <Text className="text-white text-2xl font-bold mb-1">
            {user?.name}
          </Text>
          
          <Text className="text-green-100 text-sm mb-3">
            {user?.email}
          </Text>
          
          <View className={`px-4 py-2 rounded-full ${roleColors.bg} mb-4`}>
            <Text className={`text-sm font-semibold ${roleColors.text}`}>
              {user?.role?.toUpperCase()}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View className="px-6 py-6">
        {/* Settings Section */}
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          ⚙️ {language === 'en' ? 'Settings' : 'ቅንብሮች'}
        </Text>
        
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          {/* Language Setting */}
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-gray-100"
            onPress={() => changeLanguage(language === 'en' ? 'am' : 'en')}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center mr-3">
                <Ionicons name="language" size={20} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-gray-800 font-medium">
                  {language === 'en' ? 'Language' : 'ቋንቋ'}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {language === 'en' ? 'English' : 'አማርኛ'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Notifications */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-100 rounded-full justify-center items-center mr-3">
                <Ionicons name="notifications" size={20} color="#10B981" />
              </View>
              <View>
                <Text className="text-gray-800 font-medium">
                  {language === 'en' ? 'Notifications' : 'ማስታወቂያዎች'}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {language === 'en' ? 'Receive alerts' : 'ማስታወቂያዎችን ይቀበሉ'}
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            />
          </View>

          {/* Location Services */}
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-purple-100 rounded-full justify-center items-center mr-3">
                <Ionicons name="location" size={20} color="#8B5CF6" />
              </View>
              <View>
                <Text className="text-gray-800 font-medium">
                  {language === 'en' ? 'Location Services' : 'የአካባቢ አገልግሎቶች'}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {language === 'en' ? 'For accurate reporting' : 'ለትክክለኛ ሪፖርት'}
                </Text>
              </View>
            </View>
            <Switch
              value={locationServicesEnabled}
              onValueChange={setLocationServicesEnabled}
              trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          🚀 {language === 'en' ? 'Quick Actions' : 'ፈጣን እርምጃዎች'}
        </Text>
        
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              className={`flex-row items-center justify-between p-4 ${
                index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              onPress={item.onPress}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center mr-3">
                  <Ionicons name={item.icon} size={20} color="#4B5563" />
                </View>
                <Text className="text-gray-800 font-medium">{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Account Actions */}
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          🔐 {language === 'en' ? 'Account' : 'መለያ'}
        </Text>
        
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
            <View className="w-10 h-10 bg-yellow-100 rounded-full justify-center items-center mr-3">
              <Ionicons name="shield-checkmark" size={20} color="#F59E0B" />
            </View>
            <Text className="text-gray-800 font-medium flex-1">
              {language === 'en' ? 'Privacy & Security' : 'ግላዊነት እና ደህንነት'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} className="flex-row items-center p-4">
            <View className="w-10 h-10 bg-red-100 rounded-full justify-center items-center mr-3">
              <Ionicons name="log-out" size={20} color="#EF4444" />
            </View>
            <Text className="text-red-600 font-medium flex-1">
              {t('logout')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center mt-8">
          <Text className="text-gray-500 text-sm">
            ShegaReport v1.0.0
          </Text>
          <Text className="text-gray-400 text-xs mt-1">
            {language === 'en' ? 'Serving Debre Birhan Community' : 'ለደብረ ብርሃን �ማህበረሰብ አገልግሎት'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}