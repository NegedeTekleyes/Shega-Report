import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

export default function Welcome() {
  return (
    <View className='flex-1 items-center justify-center bg-green px-6'>
        <Text className='text-3xl font-bold text-green-600 mb-6'>
            Welcome to ShegaReport
        </Text>
      <Text className='text-gray-600 text-center mb-10'>
        The best app to manage your tasks and stay productive
      </Text>

      {/* login */}
      <Pressable
      onPress={()=>router.push("/login")}
      className='w-full bg-green-600 py-3 rounded-2xl mb-4'
      >
        <Text className='text-center text-white text-lg font-semibold'>Login</Text>
      </Pressable>
      {/* signup */}
      <Pressable
      onPress={()=>router.push("/signup")}
      className='w-full bg-green-600 py-3 rounded-2xl mb-4'
      >
        <Text className='text-center text-white text-lg font-semibold'>Sign Up</Text>
      </Pressable>
    
    </View>
  )
}

const styles = StyleSheet.create({})