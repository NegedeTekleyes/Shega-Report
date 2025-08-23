import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/providers/language-providers';
import { useAuth } from '@/providers/auth-providers';

export default function SignUp() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // animation scale
  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}]
  }))

  // Mock signup API - REPLACE WITH ACTUAL API
  const mockSignupApi = async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (email && password.length >= 6) {
      return {
        success: true,
        user: {
          id: Math.random().toString(36).substr(2, 9),
          email: email,
          name: name,
          role: 'resident' as const,
          phone: '+251912345678',
          isVerified: false
        },
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9)
      };
    } else {
      return {
        success: false,
        error: 'Registration failed. Please try again.'
      };
    }
  };

  const handleSignup = async () => {
    if(!fullName || !email || !password || !confirmPassword){
      setError(t('pleaseFillAll'));
      return;
    }
    if(password !== confirmPassword){
      setError(t('passwordsDontMatch'));
      return;
    }
    if(password.length < 6){
      setError(t('passwordTooShort'));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const authResponse = await mockSignupApi(fullName, email, password);
      
      if (authResponse.success && authResponse.user && authResponse.token) {
        login(authResponse.user, authResponse.token);
        Alert.alert(t('signupSuccess'), `${t('welcome')} ${fullName}!`);
        router.replace("/");
      } else {
        setError(authResponse.error || t('signupError'));
      }
    } catch (error) {
      setError(t('signupError'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={['#16a34a', '#22c55e']}
      style={{ flex: 1, justifyContent: 'center' }}
    >
      <View className="flex-1 justify-center items-center px-6">
        {/* Form Container */}
        <Animated.View
          entering={FadeInUp.delay(200)}
          className="bg-white rounded-2xl w-full p-6 shadow-lg"
        >
          {/* Header */}
          <View className="items-center mb-6">
            <Animated.View entering={FadeInUp.delay(300)}>
              <Ionicons name='person-add' size={48} color='#16a34a'/>
            </Animated.View>
            <Text className='text-2xl font-bold mt-2 text-green-600'>{t('createAccount')}</Text>
            <Text className="text-gray-500 text-center mt-1">
              {t('joinOurCommunity')}
            </Text>
          </View>

          {/* Full name */}
          <Animated.View entering={FadeInUp.delay(400)} className='mb-4'>
            <Text className='text-gray-700 mb-2 font-semibold'>{t('fullName')}</Text>
            <TextInput 
              className='border border-gray-300 rounded-xl px-4 py-3 text-base'
              placeholder={t('enterFullName')}
              value={fullName}
              onChangeText={setFullName}
              editable={!isLoading}
            />
          </Animated.View>

          {/* Email */}
          <Animated.View entering={FadeInUp.delay(500)} className='mb-4'>
            <Text className='text-gray-700 mb-2 font-semibold'>{t('email')}</Text>
            <TextInput 
              className='border border-gray-300 rounded-xl px-4 py-3 text-base'
              placeholder={t('enterEmail')}
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              editable={!isLoading}
            />
          </Animated.View>

          {/* Password */}
          <Animated.View entering={FadeInUp.delay(600)} className='mb-4'>
            <Text className='text-gray-700 mb-2 font-semibold'>{t('password')}</Text>
            <TextInput 
              className='border border-gray-300 rounded-xl px-4 py-3 text-base'
              placeholder={t('enterPassword')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </Animated.View>

          {/* Confirm Password */}
          <Animated.View entering={FadeInUp.delay(700)} className='mb-6'>
            <Text className='text-gray-700 mb-2 font-semibold'>{t('confirmPassword')}</Text>
            <TextInput
              className='border border-gray-300 rounded-xl px-4 py-3 text-base'
              placeholder={t('confirmPassword')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </Animated.View>

          {/* Error Message */}
          {error ? (
            <Animated.View entering={FadeInUp.delay(800)} className="mb-4">
              <Text className='text-red-500 text-center'>{error}</Text>
            </Animated.View>
          ) : null}

          {/* Sign Up Button */}
          <Animated.View entering={FadeInUp.delay(900)}>
            <Pressable
              onPressIn={() => !isLoading && (scale.value = withSpring(0.95))}
              onPressOut={() => !isLoading && (scale.value = withSpring(1))}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <Animated.View
                style={animatedStyle}
                className={`py-3 rounded-xl items-center mb-4 ${isLoading ? 'bg-green-400' : 'bg-green-600'}`}
              >
                <Text className='text-white font-semibold text-lg'>
                  {isLoading ? t('creatingAccount') + '...' : t('signUp')}
                </Text>
              </Animated.View>
            </Pressable>
          </Animated.View>

          {/* Redirect to Login */}
          <Animated.View entering={FadeInUp.delay(1000)}>
            <Pressable
              onPress={() => !isLoading && router.push("/(auth)/login")}
              disabled={isLoading}
              className='items-center'
            >
              <Text className={`${isLoading ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('alreadyHaveAccount')}{" "}
                <Text className={isLoading ? 'text-green-400' : 'text-green-600 font-semibold'}>
                  {t('login')}
                </Text>
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({})