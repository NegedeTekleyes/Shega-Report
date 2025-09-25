import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, TouchableOpacity, View, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/providers/language-providers';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp, 
  ZoomIn,
  BounceIn
} from 'react-native-reanimated';

export default function WelcomeScreen() {
  const { t, language, changeLanguage } = useLanguage();
  return (
    <LinearGradient
      colors={['#0a5398ff', '#15bdc6ff']}
      className="flex-1"
    >
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        {/* Header with Language Button */}
        <Animated.View 
          entering={FadeInDown.duration(800)}
          className="flex-row justify-between items-center px-6 pt-4"
        >
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color="#FFDE00" />
            <Text className=" italic text-yellow-300 text-sm font-medium ml-2">
              Debre Birhan
            </Text>
          </View>
          
          <TouchableOpacity
            className="flex-row items-center bg-white/20 px-4 py-2 rounded-full"
            onPress={() => changeLanguage(language === 'en' ? 'am' : 'en')}
          >
            <Ionicons name="globe" color="#FFFFFF" size={18} />
            <Text className="text-white font-semibold ml-2 text-base">
              {language === 'en' ? 'አማርኛ' : 'English'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Main Content */}
        <View className="flex-1 justify-center items-center px-6">
          <Animated.View className="items-center mb-8" >
            <Animated.View entering={FadeInUp.delay(400)}>
              <Text className="text-white text-4xl font-bold mb-2 text-center">
                Shega
                <Text className="text-yellow-300">Report</Text>
              </Text>
              <Text className="text-white/90 text-center text-base font-medium tracking-wide">
                {language === 'en' 
                  ? 'Water & Sanitation Management'
                  : 'የውሃ እና የንፅህና አስተዳደር'
                }
              </Text>
            </Animated.View>
          </Animated.View>

          {/* Stats Banner */}
          <Animated.View 
            entering={FadeInUp.delay(600)}
            className="bg-white/10 rounded-2xl p-5 mb-8 w-full backdrop-blur-md border border-white/10"
          >
            <View className="flex-row justify-around">
              <View className="items-center">
                <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
                <Text className="text-white text-2xl font-bold mt-2">1.2K+</Text>
                <Text className="text-white/80 text-xs">
                  {language === 'en' ? 'Issues Resolved' : 'የተፈቱ ችግሮች'}
                </Text>
              </View>
              
              <View className="h-12 w-px bg-white/30" />
              
              <View className="items-center">
                <Ionicons name="people" size={24} color="#9b60faff" />
                <Text className="text-white text-2xl font-bold mt-2">5K+</Text>
                <Text className="text-white/80 text-xs">
                  {language === 'en' ? 'Active Users' : 'ንቁ ተጠቃሚዎች'}
                </Text>
              </View>
              
              <View className="h-12 w-px bg-white/30" />
              
              <View className="items-center">
                <Ionicons name="time" size={24} color="#FBBF24" />
                <Text className="text-white text-2xl font-bold mt-2">12/7</Text>
                <Text className="text-white/80 text-xs">
                  {language === 'en' ? 'Support' : 'ድጋፍ'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Buttons with Hover Effects */}
          <Animated.View entering={FadeInUp.delay(800)} className="w-full gap-4 mb-8">
            <TouchableOpacity
              className="bg-white py-5 rounded-2xl items-center shadow-2xl active:scale-95 transition-all"
              onPress={() => router.push('/(auth)/login')}
            >
              <View className="flex-row items-center">
                <Ionicons name="log-in" size={24} color="#009639" />
                <Text className="text-green-600 font-bold text-lg ml-2">
                  {t('login')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="border-2 border-white/50 py-5 rounded-2xl items-center bg-white/5 active:scale-95 transition-all"
              onPress={() => router.push('/(auth)/signup')}
            >
              <View className="flex-row items-center">
                <Ionicons name="person-add" size={24} color="#FFFFFF" />
                <Text className="text-white font-bold text-lg ml-2">
                  {t('register')}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Feature Highlights */}
          <Animated.View entering={FadeInUp.delay(1000)} className="w-full mb-6">
            <View className="flex-row justify-between mb-4">
              {[
                {  text: language === 'en' ? 'Fast Response' : 'ፈጣን ምላሽ' },
                { text: language === 'en' ? 'Easy Reporting' : 'ቀላል ሪፖርት' },
                {  text: language === 'en' ? 'GPS Tracking' : 'ጂፒኤስ ክትትል' },
              ].map((item, index) => (
                <View key={index} className="items-center flex-1">
                  <Text className=" italic text-white/80 text-xs text-center">{item.text}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}