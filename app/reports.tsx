import { useAuth } from "@/providers/auth-providers";
import { useLanguage } from "@/providers/language-providers";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

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
  const { user } = useAuth();

  // convert image uri to base64 - FIXED VERSION
  const convertToBase64 = async (uri: string): Promise<string | null> => {
    try {
      console.log("Converting URI to base64:", uri);

      // Check if it's already a base64 string
      if (uri.startsWith("data:image")) {
        console.log("URI is already base64");
        return uri;
      }

      // Check if it's a file URI that needs conversion
      if (uri.startsWith("file://")) {
        console.log("Converting file URI to base64");
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Determine MIME type from file extension
        const fileExtension = uri.split(".").pop()?.toLowerCase() || "jpeg";
        const mimeType = fileExtension === "png" ? "png" : "jpeg";

        return `data:image/${mimeType};base64,${base64}`;
      }

      console.log("Unknown URI format:", uri);
      return null;
    } catch (error) {
      console.error("Failed to convert image to base64:", error, "URI:", uri);
      return null;
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    urgency: "medium",
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>("");

  // Categories based on water and sanitation issues
  const categories = [
    { id: "water_leak", label: t("waterLeak") },
    { id: "no_water", label: t("noWaterSupply") },
    { id: "dirty_water", label: t("dirtyWater") },
    { id: "sanitation", label: t("sanitationIssue") },
    { id: "pipe_burst", label: t("burstPipe") },
    { id: "drainage", label: t("drainageProblem") },
  ];

  const urgencyLevels = [
    { id: "low", label: t("low"), color: "#10B981" },
    { id: "medium", label: t("medium"), color: "#F59E0B" },
    { id: "high", label: t("high"), color: "#EF4444" },
    { id: "emergency", label: t("emergency"), color: "#DC2626" },
  ];

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("permissionRequired"), t("photoAccessRequired"));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        console.log("Image picked:", asset);

        let base64String: string | null = null;
        if (asset.base64) {
          base64String = `data:image/jpeg;base64,${asset.base64}`;
          console.log("Using direct base64 from asset");
        } else if (asset.uri) {
          // Fallback: convert from URI
          base64String = await convertToBase64(asset.uri);
          console.log(
            "Converted from URI, result:",
            base64String ? "success" : "failed"
          );
        }

        if (base64String) {
          setPhotos((prev) => [...prev, base64String]);
          console.log("Photo added to array");
        } else {
          console.log("Failed to get base64 for image");
          Alert.alert(t("error"), t("imageProcessingFailed"));
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(t("error"), t("imagePickFailed"));
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("cameraPermission"));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        let base64String: string | null = null;

        if (asset.base64) {
          base64String = `data:image/jpeg;base64,${asset.base64}`;
        } else if (asset.uri) {
          base64String = await convertToBase64(asset.uri);
        }

        if (base64String) {
          setPhotos((prev) => [...prev, base64String]);
        } else {
          Alert.alert(t("error"), t("photoProcessingFailed"));
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert(t("error"), t("takePhotoFailed"));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // get users location
  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      setLocationError("");

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError(t("locationPermissionDenied"));
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
          ? `${address.street || ""} ${address.name || ""}, ${
              address.city || ""
            }`
          : undefined,
      };

      setCurrentLocation(locationData);

      // Update form location field with address
      if (locationData.address) {
        setFormData((prev) => ({ ...prev, location: locationData.address! }));
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setLocationError(t("locationFetchFailed"));
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Auto-get location when component mounts
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSubmit = async () => {
    // Collect missing fields
    const missingFields = [];
    if (!formData.title.trim()) missingFields.push(t("title"));
    if (!formData.description.trim()) missingFields.push(t("description"));
    if (!formData.category) missingFields.push(t("category"));

    if (missingFields.length > 0) {
      Alert.alert(
        t("missingInformation"),
        `${t("pleaseFillFollowing")}\n\n${missingFields.join(", ")}`
      );
      return;
    }

    // Extra validation
    if (formData.description.trim().length < 10) {
      Alert.alert(t("descriptionTooShort"), t("provideMoreDetails"));
      return;
    }

    if (formData.title.trim().length < 5)
      Alert.alert(t("titleTooShort"), t("titleMustBeAtLeast5Characters"));

    if (!currentLocation) {
      Alert.alert(t("locationMissing"), t("enableLocationServices"));
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Original photos array:", photos);
      console.log("Photos array length:", photos.length);

      // Debug each photo
      for (let i = 0; i < photos.length; i++) {
        console.log(`Photo ${i}:`, photos[i]?.substring(0, 50) + "...");
        console.log(`Photo ${i} type:`, typeof photos[i]);
        console.log(
          `Photo ${i} starts with data:`,
          photos[i]?.startsWith("data:image")
        );
      }

      // Filter out any non-base64 strings and use the photos directly
      const base64Photos = photos.filter(
        (photo) =>
          photo && typeof photo === "string" && photo.startsWith("data:image")
      );

      console.log("Filtered base64 photos:", base64Photos.length);

      // If no valid base64 photos, but we had photos, show error
      if (photos.length > 0 && base64Photos.length === 0) {
        Alert.alert(t("photoError"), t("photoProcessingError"));
        setIsSubmitting(false);
        return;
      }

      // Prepare data with location
      const reportData = {
        ...formData,
        user_id: user?.id,
        locationData: currentLocation,
        photos: base64Photos,
        timestamp: new Date().toISOString(),
      };

      console.log("Submitting report with photos:", base64Photos.length);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(t("error"), t("noAccessToken"));
        setIsSubmitting(false);
        return;
      }

      // Use your actual server IP instead of localhost
      const API_BASE = "http://localhost:3000";
      const res = await fetch(`${API_BASE}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Failed to parse server response:", text);
        throw new Error(
          `Unexpected server response: ${text.substring(0, 100)}...`
        );
      }

      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          location: "",
          category: "",
          urgency: "medium",
        });
        setPhotos([]);
        Alert.alert(t("reportSubmitted"), t("issueReportedSuccessfully"), [
          {
            text: t("viewMyReports"),
            onPress: () => {
              router.replace("/reports-history");
            },
          },
        ]);
      } else {
        Alert.alert(t("error"), data.error || t("submitReportFailed"));
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      Alert.alert(t("error"), t("submitReportError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-200">
      {/* Header */}
      <View className="bg-[#0a5398ff] px-6 pt-12 pb-6">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">
            {t("reportIssue")}
          </Text>
        </View>
      </View>

      <View className="px-6 py-6">
        {/* Issue Title */}
        <Animated.View entering={FadeInUp.delay(100)} className="mb-6">
          <Text className="text-gray-800 font-semibold mb-2">
            {t("issueTitle")} *
          </Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base"
            placeholder={t("issueTitlePlaceholder")}
            value={formData.title}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, title: text }))
            }
          />
        </Animated.View>

        {/* Category Selection */}
        <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
          <Text className="text-gray-800 font-semibold mb-2">
            {t("category")} *
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`px-4 py-2 rounded-full ${
                  formData.category === category.id
                    ? "bg-[#0a5398ff]"
                    : "bg-gray-200"
                }`}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, category: category.id }))
                }
              >
                <Text
                  className={
                    formData.category === category.id
                      ? "text-white font-medium"
                      : "text-gray-800"
                  }
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInUp.delay(300)} className="mb-6">
          <Text className="text-gray-800 font-semibold mb-2">
            {t("description")} *
          </Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base h-32"
            placeholder={t("descriptionPlaceholder")}
            value={formData.description}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, description: text }))
            }
            multiline
            textAlignVertical="top"
          />
        </Animated.View>

        {/* Location */}
        <Animated.View entering={FadeInUp.delay(400)} className="mb-6">
          <Text className="text-gray-800 font-semibold mb-2">
            {t("location")}
          </Text>

          <View className="flex-row gap-2 mb-2">
            <TextInput
              className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholder={t("locationPlaceholder")}
              value={formData.location}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, location: text }))
              }
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

          {locationError ? (
            <Text className="text-red-500 text-sm mt-1">{locationError}</Text>
          ) : null}

          {currentLocation ? (
            <View className="bg-green-50 p-3 rounded-lg mt-2">
              <Text className="text-green-800 text-sm">
                {t("gpsLocationCaptured")}
              </Text>
              <Text className="text-green-600 text-xs mt-1">
                Lat: {currentLocation.latitude.toFixed(6)}, Long:{" "}
                {currentLocation.longitude.toFixed(6)}
              </Text>
              {currentLocation.accuracy ? (
                <Text className="text-green-600 text-xs">
                  {t("accuracy")}: ±{currentLocation.accuracy.toFixed(1)}m
                </Text>
              ) : null}
            </View>
          ) : null}
        </Animated.View>

        {/* Urgency Level */}
        <Animated.View entering={FadeInUp.delay(500)} className="mb-6">
          <Text className="text-gray-800 font-semibold mb-2">
            {t("urgencyLevel")}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {urgencyLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                className={`px-4 py-2 rounded-full ${
                  formData.urgency === level.id
                    ? "border-2"
                    : "border border-gray-300"
                }`}
                style={{
                  backgroundColor:
                    formData.urgency === level.id ? level.color : "white",
                  borderColor: level.color,
                }}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, urgency: level.id }))
                }
              >
                <Text
                  className={
                    formData.urgency === level.id
                      ? "text-white font-medium"
                      : "text-gray-800"
                  }
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Photo Upload */}
        <Animated.View entering={FadeInUp.delay(600)} className="mb-6">
          <Text className="text-gray-800 font-semibold mb-2">
            {t("addPhotos")}
          </Text>

          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity
              onPress={takePhoto}
              className="bg-[#0a5398ff] px-4 py-3 rounded-xl flex-row items-center"
            >
              <Ionicons name="camera" size={20} color="white" />
              <Text className="text-white font-medium ml-2">
                {t("takePhoto")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickImage}
              className="bg-[#0a5398ff] px-4 py-3 rounded-xl flex-row items-center"
            >
              <Ionicons name="image" size={20} color="white" />
              <Text className="text-white font-medium ml-2">
                {t("chooseFromGallery")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Display Selected Photos */}
          {photos.length > 0 ? (
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
          ) : null}
        </Animated.View>

        {/* Submit Button */}
        <Animated.View entering={FadeInUp.delay(700)}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`bg-[#0a5398ff] py-4 rounded-xl items-center ${
              isSubmitting ? "opacity-50" : ""
            }`}
          >
            {isSubmitting ? (
              <View className="flex-row items-center">
                <ActivityIndicator
                  color="white"
                  size="small"
                  className="mr-2"
                />
                <Text className="text-white font-semibold text-lg">
                  {t("submitting")}
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-lg">
                {t("submitReport")}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
