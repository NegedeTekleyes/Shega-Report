import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useLanguage } from '@/providers/language-providers'

export default function AuthLayout() {
  const {language, changeLanguage, t} = useLanguage()
  return (
 <View className='flex-1 bg-white'>
          {/* language switcher */}
          <View className='flex-row justify-end p-4 bg-green-600'>
            <TouchableOpacity
            onPress={()=>changeLanguage(language === 'en' ? 'am' : 'en')}
            className='px-3 py-1 bg-white rounded'
            >
              <Text className="text-green-600 font-semibold">
                  {language === 'en' ? 'አማ' : 'EN'}
                </Text>
            </TouchableOpacity>
          </View>
          {/* auth pages */}
          <Stack
              screenOptions={{
                headerStyle: {backgroundColor: '#16a34a'},
                headerTintColor: '#ffffff',
                headerTitleStyle: {fontWeight: 'bold'},
                
              }}>

            <Stack.Screen
            name='login'
            options={{title: t('login')}}
            />
            <Stack.Screen
            name='signup'
            options={{title: t('register')}}
            />
          </Stack>
    </View>
    
  )
}

const styles = StyleSheet.create({})