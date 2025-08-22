import { TouchableOpacity, Text, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLanguage } from '@/providers/language-providers';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import { FontAwesome5 } from '@expo/vector-icons';
export default function Welcome() {
  const { language, t } = useLanguage();

  return (
    <View className="flex-1 items-center justify-center bg-green-600 px-6">
      
      <Animated.View entering={FadeInDown.delay(200)} className="items-center mb-10">
        <View className="w-28 h-28 bg-white rounded-full justify-center items-center mb-5 shadow-lg">
          <FontAwesome5 name="tint" size={60} color="#009639" />
        </View>
        <Text className="text-3xl font-bold text-white mb-2">ShegaReport</Text>
        <Text className="text-white/90 text-center text-base leading-6">
          {language === 'en'
            ? 'Water & Sanitation Complaint Management'
            : 'የውሃ እና የንፅህና ቅሬታ አስተዳደር'}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400)} className="mb-10">
        <Text className="text-yellow-400 font-semibold text-lg text-center">
          {language === 'en' ? 'Debre Birhan Municipality' : 'የደብረ ብርሃን ማዘጋጃ ቤት'}
        </Text>
      </Animated.View>

      {/* Buttons */}
      <Animated.View entering={FadeInUp.delay(600)} className="w-full space-y-4 mb-8">
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          className="bg-white py-4 rounded-xl items-center shadow-md"
        >
          <Text className="text-green-600 font-semibold text-lg">{t('login')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/signup')}
          className="border-2 border-white py-4 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-lg">{t('register')}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Description */}
      <Animated.View entering={FadeInUp.delay(800)} className="px-5">
        <Text className="text-white/80 text-center text-sm leading-5">
          {language === 'en'
            ? 'Report water supply and sanitation issues in your community'
            : 'በማህበረሰብዎ ውስጥ የውሃ አቅርቦት እና የንፅህና ችግሮችን ሪፖርት ያድርጉ'}
        </Text>
      </Animated.View>
    </View>
  );
}
