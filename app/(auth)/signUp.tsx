import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

export default function SignUp() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // animation scale
  const scale =useSharedValue(1)

  const animatedStyle = useAnimatedStyle(()=>({
    transform: [{scale: scale.value}]
  }))

  const handleSignup = () =>{
    if(!fullName || !email || !password || !confirmPassword){
      Alert.alert("Error", "Plase fill all fields.")
      return;
    }
    if(password !== confirmPassword){
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    Alert.alert("Signup Success", `Welcome ${fullName}!`)
    router.replace("/")
  }
  return (
    <View className='flex-1 bg-white px-6 justify-center'>
      {/* logo and title */}
      <View>
        <Ionicons name='person-add-outline' size={64} color='#2563EB'/>
      <Text className='text-2xl font-bold mt-2 text-blue-600'>Create Account</Text>
      </View>

      {/* full name */}
      <View className='mb-4'>
        <Text className='text-gray-700 mb-2'>Full Name</Text>
        <TextInput 
        className='border border-gray-300 rounded-xl px-4 py-3 text-base'
        placeholder='Enter your full name'
        value={fullName}
        onChangeText={setFullName}
        />
      </View>

      {/* email */}
      <View className='mb-4'>
        <Text className='text-gray-700 mb-2'>Email</Text>
        <TextInput className='border border-gray-300 rounded-xl px-4 py-3 text-base'
        placeholder='Enter your email'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
        />
      </View>
      {/* password */}
      <View>
      <Text className='mb-4'>Password </Text>
        <TextInput className='text-gray-700 rounded-xl px-4 py-3 text-base'
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        />
      </View>
      {/* confirm password */}
      <View className='mb-6'>
        <Text 
        className='text-gray-700 mb-2'
        >
          Confirm Password
        </Text>
        <TextInput
        className='border border-gray-300 rounded-xl px-4 py-3 text-base'
        placeholder='Confirm your password'
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        />
{/* Animated signup button */}
<Pressable
onPressIn={()=>(scale.value = withSpring(0.80))}
onPressOut={()=>(scale.value = withSpring(1))}
onPress={handleSignup}
>
<Animated.View
style={animatedStyle}
className='bg-blue-600 py-3 rounded-xl items-center'
>
<Text className='text-white font-semibold text-lg'>Sign Up</Text>
</Animated.View>
</Pressable>

{/* redirect */}
<Pressable
  onPress={() => router.push("/login")}
    className='mt-6 items-center'
>
  <Text>
    Already have an account?{" "}
    <Text className='text-blue-600 font-semibold'>Login</Text>
    </Text>

</Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})