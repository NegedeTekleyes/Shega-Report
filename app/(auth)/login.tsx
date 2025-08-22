// app/auth/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Expo icons
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";


// Style TextInput with Tailwind

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  //  animation scale value
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() =>({
    transform: [{scale: scale.value}]
  }))
  // Handle login (you can connect Firebase/Auth later)
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    // TODO: integrate Firebase/Auth backend here
    Alert.alert("Login Success", `Welcome back ${email}`);
    router.replace("/"); // Redirect to home/dashboard
  };

  return (
    <View className="flex-1 bg-green px-6 justify-center">
      {/* Logo & App Title */}
      <View className="items-center mb-8">
        <Ionicons name="water-outline" size={64} color="#2563EB" />
        <Text className="text-2xl font-bold mt-2 text-blue-600">ShegaReport</Text>
      </View>

      {/* Email Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 text-base"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Password</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 text-base"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Login Button */}
      <Pressable
        onPressIn={()=> (scale.value = withSpring(0.80))}
        onPressOut={()=>(scale.value= withSpring(1))}
        onPress={handleLogin}
      >
        <Animated.View
        style={animatedStyle}
        className= 'bg-blue-600 py-3 rounded-xl items-center'
        >
          
        <Text className="text-white font-semibold text-lg">Login</Text>
        </Animated.View>
      </Pressable>

      {/* Redirect to Signup */}
      <Pressable
        onPress={() => router.push("/signup")}
        className="mt-6 items-center"
      >
        <Text className="text-gray-600">
          Don’t have an account?{" "}
          <Text className="text-blue-600 font-semibold">Sign up</Text>
        </Text>
      </Pressable>
    </View>
  );
}
