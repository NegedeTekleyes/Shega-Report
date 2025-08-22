import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function AuthLayout() {
    // const {isAuthenticated, isLoading} = useAuth()
  return (
    <Stack screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name='welcome'/>
      <Stack.Screen name='login'/>
      <Stack.Screen name='registry'/> */}
    </Stack>
  )
}

const styles = StyleSheet.create({})