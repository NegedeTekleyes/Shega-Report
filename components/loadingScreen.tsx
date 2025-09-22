import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useLanguage } from '@/providers/language-providers';
import React from 'react'
export default function LoadingScreen() {
  const { t } = useLanguage();
 return (
    <View className="flex-1 justify-center items-center bg-green-600">
      <ActivityIndicator size="large" color="white" />
      <Text className="text-white mt-4 text-lg">{t('loading')}...</Text>
    </View>
  );
}

const styles = StyleSheet.create({})