import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (

    <View className='flex-1 bg-white'>
<Stack
screenOptions={{
  headerStyle: {backgroundColor: '#16a34a'},
  // headerTintColor: #ffffffff,
  headerTitleStyle: {fontWeight: "bold"},
}}
>
  <Stack.Screen
  name='login'
  options={{title: "Login"}}
  />
  <Stack.Screen
  name='signup'
  options={{title: "Sign Up"}}
  />

  

</Stack>
    </View>
    
  )
}

const styles = StyleSheet.create({})