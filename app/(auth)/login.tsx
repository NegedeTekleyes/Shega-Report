// app/(auth)/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from "@/providers/language-providers";
import { useAuth } from "@/providers/auth-providers";
import { UserRole } from "@/providers/auth-providers";

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  // Mock API function - REPLACE THIS WITH YOUR ACTUAL AUTH API
  const mockLoginApi = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation - replace with real API call
    if (email && password.length >= 6) {
      return {
        success: true,
        user: {
          id: Math.random().toString(36).substr(2, 9),
          email: email,
          name: email.split('@')[0], // Use part of email as name
          role: 'resident' as UserRole,
          phone: '+251912345678',
          isVerified: true
        },
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9)
      };
    } else {
      return {
        success: false,
        error: 'Invalid credentials. Please try again.'
      };
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t('pleaseEnterBoth'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Replace mockLoginApi with your actual authentication API call
      const authResponse = await mockLoginApi(email, password);
      
      if (authResponse.success && authResponse.user && authResponse.token) {
        // Call your auth provider's login function with the correct parameters
        login(authResponse.user, authResponse.token);
        router.replace('/(auth)/signup');
      } else {
        setError(authResponse.error || t('loginError'));
      }
    } catch (e) {
      // setError(e.message || t('loginError'));
      console.error("Login error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Test credentials for quick login
  const handleQuickLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    // Auto-submit after a short delay
    setTimeout(() => handleLogin(), 100);
  };

  return (
    <LinearGradient
      colors={['#16a34a', '#22c55e']}
      style={{ flex: 1, justifyContent: 'center' }}
    >
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo & App Title */}
        <Animated.View 
          entering={FadeInUp.delay(100)}
          className="items-center mb-8"
        >
          <Ionicons name="water-outline" size={64} color="white" />
          <Text className="text-2xl font-bold mt-2 text-white">ShegaReport</Text>
        </Animated.View>

        {/* Form Container */}
        <Animated.View
          entering={FadeInUp.delay(200)}
          className="bg-white rounded-2xl w-full p-6 shadow-lg"
        >
          <Text className="text-2xl font-bold text-green-600 text-center mb-4">
            {t('welcomeBack')}
          </Text>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-semibold">{t('email')}</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholder={t('enterEmail')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-semibold">{t('password')}</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholder={t('enterPassword')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          {/* Error Message */}
          {error ? (
            <Text className="text-red-500 mb-4 text-center">{error}</Text>
          ) : null}

          {/* Login Button */}
          <Pressable
            onPressIn={() => !isLoading && (scale.value = withSpring(0.95))}
            onPressOut={() => !isLoading && (scale.value = withSpring(1))}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Animated.View
              style={animatedStyle}
              className={`py-3 rounded-xl items-center mb-4 ${isLoading ? 'bg-green-400' : 'bg-green-600'}`}
            >
              <Text className="text-white font-semibold text-lg">
                {isLoading ? t('loading') + '...' : t('login')}
              </Text>
            </Animated.View>
          </Pressable>

          {/* Quick Test Buttons (remove in production)
          <View className="mb-4">
            <Text className="text-gray-500 text-center text-sm mb-2">Test Accounts:</Text>
            <View className="flex-row justify-center space-x-2">
              <Pressable
                onPress={() => handleQuickLogin('test@example.com', 'password123')}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                <Text className="text-xs">Test User</Text>
              </Pressable>
            </View>
          </View> */}

          {/* Redirect to Signup */}
          <Pressable
            onPress={() => !isLoading && router.push("/(auth)/signup")}
            disabled={isLoading}
            className="items-center"
          >
            <Text className={`${isLoading ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dontHaveAccount')}{" "}
              <Text className={isLoading ? 'text-green-400' : 'text-green-600 font-semibold'}>
                {t('register')}
              </Text>
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}