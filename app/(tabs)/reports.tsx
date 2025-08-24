// app/(tabs)/report.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/providers/language-providers';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Location from 'expo-location'

// interface for location data
interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}
export default function ReportScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    urgency: 'medium'
  });
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  // Categories based on water and sanitation issues
  const categories = [
    { id: 'water_leak', label: language === 'en' ? 'Water Leak' : 'የውሃ ፍሳሽ' },
    { id: 'no_water', label: language === 'en' ? 'No Water Supply' : 'ውሃ አለመገኘት' },
    { id: 'dirty_water', label: language === 'en' ? 'Dirty Water' : 'እርጥበት ውሃ' },
    { id: 'sanitation', label: language === 'en' ? 'Sanitation Issue' : 'ንፅህና ችግር' },
    { id: 'pipe_burst', label: language === 'en' ? 'Burst Pipe' : 'የተቀጠቀጠ ቧንቧ' },
    { id: 'drainage', label: language === 'en' ? 'Drainage Problem' : 'የመፍሰሻ ችግር' },
  ];

  const urgencyLevels = [
    { id: 'low', label: language === 'en' ? 'Low' : 'ዝቅተኛ', color: '#10B981' },
    { id: 'medium', label: language === 'en' ? 'Medium' : 'መካከለኛ', color: '#F59E0B' },
    { id: 'high', label: language === 'en' ? 'High' : 'ከፍተኛ', color: '#EF4444' },
    { id: 'emergency', label: language === 'en' ? 'Emergency' : 'አስቸኳይ', color: '#DC2626' },
  ];

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(language === 'en' ? 'Permission required' : 'ፍቃድ ያስፈልጋል', 
                   language === 'en' ? 'Please allow access to your photos' : 'እባክዎ ወደ ፎቶዎች መዳረሻ ይፍቀዱ');
        return;
      }

   const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setPhotos(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(language === 'en' ? 'Camera permission required' : 'የካሜራ ፍቃድ ያስፈልጋል');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setPhotos(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // get users location
  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      setLocationError('');

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(
          language === 'en' 
            ? 'Location permission denied' 
            : 'የአካባቢ ፍቃድ ተቀባይነት አላገኘም'
        );
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        address: address 
          ? `${address.street || ''} ${address.name || ''}, ${address.city || ''}`
          : undefined
      };

      setCurrentLocation(locationData);
      
      // Update form location field with address
      if (locationData.address) {
        setFormData(prev => ({ ...prev, location: locationData.address! }));
      }

    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError(
        language === 'en' 
          ? 'Failed to get location' 
          : 'አካባቢ ማግኘት አልተቻለም'
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Auto-get location when component mounts
  useEffect(() => {
    getCurrentLocation();
  }, []);


  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      Alert.alert(
        language === 'en' ? 'Missing Information' : 'ጠቃሚ መረጃ ይጠበቃል',
        language === 'en' ? 'Please fill all required fields' : 'እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ'
      );
      return;
    }

    setIsSubmitting(true);
    
    // Prepare data with location
    const reportData = {
      ...formData,
      locationData: currentLocation, // Include coordinates
      photos: photos,
      timestamp: new Date().toISOString(),
    };

    console.log('Submitting report:', reportData);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        language === 'en' ? 'Report Submitted' : 'ሪፖርት ቀርቧል',
        language === 'en' ? 'Your issue has been reported successfully!' : 'ችግርዎ በተሳካ ሁኔታ ተጠቅሷል!',
        [
          {
            text: language === 'en' ? 'OK' : 'እሺ',
            onPress: () => router.back()
          }
        ]
      );
    }, 2000);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-12 pb-6">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">
            {language === 'en' ? 'Report Issue' : 'ችግር ሪፖርት ያድርጉ'}
          </Text>
        </View>
      </View>

      <View className="px-6 py-6">
        {/* Issue Title */}
        <Animated.View entering={FadeInUp.delay(100)} className="mb-6">
          <Text className="text-gray-800 font-semibold mb-2">
            {language === 'en' ? 'Issue Title' : 'የችግሩ ርዕስ'} *
          </Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base"
            placeholder={language === 'en' ? 'e.g., Water leak in kitchen' : 'ለምሳሌ፥ በማዕድን ቤት ውሃ ፍሳሽ'}
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
          />
        </Animated.View>

        {/* Category Selection */}
        <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
          <Text className="text-gray-800 font-semibold mb-2">
            {language === 'en' ? 'Category' : 'ምድብ'} *
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`px-4 py-2 rounded-full ${
                  formData.category === category.id 
                    ? 'bg-green-600' 
                    : 'bg-gray-200'
                }`}
                onPress={() => setFormData(prev => ({ ...prev, category: category.id }))}
              >
                <Text className={
                  formData.category === category.id 
                    ? 'text-white font-medium' 
                    : 'text-gray-800'
                }>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInUp.delay(300)} className="mb-6">
          <Text className="text-gray-800 font-semibold mb-2">
            {language === 'en' ? 'Description' : 'መግለጫ'} *
          </Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base h-32"
            placeholder={language === 'en' ? 'Describe the issue in detail...' : 'ችግሩን በዝርዝር ይግለጹ...'}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            multiline
            textAlignVertical="top"
          />
        </Animated.View>

        {/* Location */}
        <Animated.View entering={FadeInUp.delay(400)} className="mb-6">
          <Text className="text-gray-800 font-semibold mb-2">
            {language === 'en' ? 'Location' : 'አድራሻ'}
          </Text>
          
          <View className="flex-row gap-2 mb-2">
            <TextInput
              className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholder={language === 'en' ? 'e.g., Kebele 03, House #25' : 'ለምሳሌ፥ ቀበሌ ፫፣ ቤት ቁጥር ፳፭'}
              value={formData.location}
              onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
            />
            
            <TouchableOpacity
              onPress={getCurrentLocation}
              disabled={isGettingLocation}
              className="bg-blue-600 px-4 py-3 rounded-xl items-center justify-center min-w-[60px]"
            >
              {isGettingLocation ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Ionicons name="locate" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {locationError && (
            <Text className="text-red-500 text-sm mt-1">{locationError}</Text>
          )}

          {currentLocation && (
            <View className="bg-green-50 p-3 rounded-lg mt-2">
              <Text className="text-green-800 text-sm">
                📍 {language === 'en' ? 'GPS Location captured' : 'የጂፒኤስ አካባቢ ተቀምጧል'}
              </Text>
              <Text className="text-green-600 text-xs mt-1">
                Lat: {currentLocation.latitude.toFixed(6)}, Long: {currentLocation.longitude.toFixed(6)}
              </Text>
              {currentLocation.accuracy && (
                <Text className="text-green-600 text-xs">
                  {language === 'en' ? 'Accuracy' : 'ትክክለኛነት'}: ±{currentLocation.accuracy.toFixed(1)}m
                </Text>
              )}
            </View>
          )}
        </Animated.View>

        {/* Urgency Level */}
        <Animated.View entering={FadeInUp.delay(500)} className="mb-6">
          <Text className="text-gray-800 font-semibold mb-2">
            {language === 'en' ? 'Urgency Level' : 'የአስቸኳይነት ደረጃ'}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {urgencyLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                className={`px-4 py-2 rounded-full ${
                  formData.urgency === level.id 
                    ? 'border-2' 
                    : 'border border-gray-300'
                }`}
                style={{
                  backgroundColor: formData.urgency === level.id ? level.color : 'white',
                  borderColor: level.color
                }}
                onPress={() => setFormData(prev => ({ ...prev, urgency: level.id }))}
              >
                <Text className={
                  formData.urgency === level.id 
                    ? 'text-white font-medium' 
                    : 'text-gray-800'
                }>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Photo Upload */}
        <Animated.View entering={FadeInUp.delay(600)} className="mb-6">
          <Text className="text-gray-800 font-semibold mb-2">
            {language === 'en' ? 'Add Photos' : 'ፎቶዎች ያክሉ'}
          </Text>
          
          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity 
              onPress={takePhoto}
              className="bg-green-600 px-4 py-3 rounded-xl flex-row items-center"
            >
              <Ionicons name="camera" size={20} color="white" />
              <Text className="text-white font-medium ml-2">
                {language === 'en' ? 'Take Photo' : 'ፎቶ ይቅረቡ'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={pickImage}
              className="bg-blue-600 px-4 py-3 rounded-xl flex-row items-center"
            >
              <Ionicons name="image" size={20} color="white" />
              <Text className="text-white font-medium ml-2">
                {language === 'en' ? 'Choose from Gallery' : 'ከፎቶ አልበም ይምረጡ'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Display Selected Photos */}
          {photos.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {photos.map((photo, index) => (
                <View key={index} className="relative">
                  <Image 
                    source={{ uri: photo }} 
                    className="w-20 h-20 rounded-lg"
                  />
                  <TouchableOpacity 
                    onPress={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 justify-center items-center"
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Submit Button */}
        <Animated.View entering={FadeInUp.delay(700)}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`bg-green-600 py-4 rounded-xl items-center ${
              isSubmitting ? 'opacity-50' : ''
            }`}
          >
            {isSubmitting ? (
              <Text className="text-white font-semibold text-lg">
                {language === 'en' ? 'Submitting...' : 'በማስገባት ላይ...'}
              </Text>
            ) : (
              <Text className="text-white font-semibold text-lg">
                {language === 'en' ? 'Submit Report' : 'ሪፖርት ያስገቡ'}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
}