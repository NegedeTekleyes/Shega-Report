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

  const categories = [
    { id: "WATER_LAKE", label: t("waterLeak") },
    { id: "NO_WATER", label: t("noWaterSupply") },
    { id: "DIRTY_WATER", label: t("dirtyWater") },
    { id: "SANITATION", label: t("sanitationIssue") },
    { id: "PIPE_BURST", label: t("burstPipe") },
    { id: "DRAINAGE", label: t("drainageProblem") },
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

      // FIXED: Updated MediaTypeOptions to MediaType
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

      // FIXED: Updated MediaTypeOptions to MediaType
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  // get users location - FIXED: Added proper error handling for geocoding
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

      // FIXED: Added try-catch for reverse geocoding since it's deprecated in SDK 49
      let address = null;
      try {
        const geocodeResult = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        address = geocodeResult[0];
      } catch (geocodeError) {
        console.log("Geocoding failed, using coordinates only:", geocodeError);
        // Continue without address - we still have coordinates
      }

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        address: address
          ? `${address.street || ""} ${address.name || ""}, ${
              address.city || ""
            }`
          : `${location.coords.latitude.toFixed(
              6
            )}, ${location.coords.longitude.toFixed(6)}`,
      };

      setCurrentLocation(locationData);

      // Update form location field with address or coordinates
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
    console.log("🟢 SUBMIT BUTTON CLICKED - Starting submission process");

    // Collect missing fields
    const missingFields = [];
    if (!formData.title.trim()) missingFields.push(t("title"));
    if (!formData.description.trim()) missingFields.push(t("description"));
    if (!formData.category) missingFields.push(t("category"));

    console.log("📋 Form validation:");
    console.log("- Title:", formData.title);
    console.log("- Description:", formData.description);
    console.log("- Category:", formData.category);
    console.log("- Missing fields:", missingFields);

    if (missingFields.length > 0) {
      console.log("❌ Validation failed - missing fields:", missingFields);
      Alert.alert(
        t("missingInformation"),
        `${t("pleaseFillFollowing")}\n\n${missingFields.join(", ")}`
      );
      return;
    }

    // Extra validation
    if (formData.description.trim().length < 10) {
      console.log("❌ Validation failed - description too short");
      Alert.alert(t("descriptionTooShort"), t("provideMoreDetails"));
      return;
    }

    if (formData.title.trim().length < 5) {
      console.log("❌ Validation failed - title too short");
      Alert.alert(t("titleTooShort"), t("titleMustBeAtLeast5Characters"));
      return;
    }

    if (!currentLocation) {
      console.log("❌ Validation failed - no location");
      Alert.alert(t("locationMissing"), t("enableLocationServices"));
      return;
    }

    console.log("✅ All validations passed");
    setIsSubmitting(true);

    try {
      console.log("=== AUTH DEBUG INFO ===");

      // FIXED: Check multiple possible token storage keys
      let token = await AsyncStorage.getItem("token");
      if (!token) {
        token = await AsyncStorage.getItem("auth-token");
      }
      if (!token) {
        token = await AsyncStorage.getItem("user-token");
      }

      console.log("Token exists:", !!token);
      if (!token) {
        console.log("❌ No token found");
        Alert.alert(t("error"), t("noAccessToken"));
        setIsSubmitting(false);
        return;
      }

      console.log("Token preview:", token.substring(0, 20) + "...");

      // Prepare data with location
      const reportData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        urgency: formData.urgency,
        location: formData.location || currentLocation?.address,
        photos: photos.filter(
          (photo) =>
            photo && typeof photo === "string" && photo.startsWith("data:image")
        ),
        locationData: currentLocation
          ? {
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              address: currentLocation.address,
              accuracy: currentLocation.accuracy,
            }
          : undefined,
      };

      console.log(
        "📦 Final data being sent:",
        JSON.stringify(reportData, null, 2)
      );

      // FIXED: Use your actual server IP instead of localhost for physical devices
      const API_BASE = "http://192.168.1.2:3000";
      console.log("🌐 Making POST request to:", `${API_BASE}/complaints`);

      const res = await fetch(`${API_BASE}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      });

      console.log("📡 Response status:", res.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(res.headers.entries())
      );

      const text = await res.text();
      console.log("📡 Raw response:", text);

      let data;
      try {
        data = text ? JSON.parse(text) : {};
        console.log("📡 Parsed response data:", data);
      } catch (error) {
        console.error("❌ Failed to parse server response:", text);
        throw new Error(
          `Unexpected server response: ${text.substring(0, 100)}...`
        );
      }

      if (res.ok) {
        console.log("✅ Report submitted successfully!");
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
        console.log("❌ Server error response:", data);
        Alert.alert(
          t("error"),
          data.error || data.message || data.details || t("submitReportFailed")
        );
      }
    } catch (error) {
      console.error("💥 Error submitting report:", error);
      Alert.alert(
        t("error"),
        error instanceof Error ? error.message : t("submitReportError")
      );
    } finally {
      console.log("🏁 Submission process completed");
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
