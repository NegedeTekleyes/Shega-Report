import { StyleSheet, Text, View, ScrollView, Linking, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

export default function AboutScreen() {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50  ">
      {/* Header */}
      <View className="bg-green-600 px-6 py-6 ">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name='arrow-back' size={24} color='white'/>
        </TouchableOpacity>
        <Text className="text-2xl text-white font-bold text-gray-800 text-center">About Us</Text>
      </View>

      {/* App Info Card */}
      <View className="bg-white mx-6 mt-6 p-6 rounded-xl shadow-sm">
        <View className="items-center mb-6">
          <View className="bg-green-100 p-5 rounded-full mb-4">
            <Ionicons name="water" size={40} color="#16a34a" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">ShegaReport</Text>
          <Text className="text-gray-500 mt-1">Version 1.0.0</Text>
        </View>
        
        <Text className="text-gray-700 text-center">
          Our app helps you connect with residents and share water problems. 
          We're committed to providing a seamless and enjoyable user experience 
          while prioritizing your privacy and security.
        </Text>
      </View>

      {/* Features Section */}
      <View className="bg-white mx-6 my-6 p-6 rounded-xl shadow-sm">
        <Text className="text-xl font-bold text-gray-800 mb-4">Features</Text>
        
        <View className="space-y-4">
          <View className="flex-row items-start">
            <Ionicons name="lock-closed" size={20} color="#16a34a" className="mt-1 mr-3" />
            <View className="flex-1">
              <Text className="font-medium text-gray-800">Secure & Private</Text>
              <Text className="text-gray-600 mt-1">Your data is encrypted and we never share it with third parties.</Text>
            </View>
          </View>
          
          <View className="flex-row items-start">
            <Ionicons name="rocket" size={20} color="#16a34a" className="mt-1 mr-3" />
            <View className="flex-1">
              <Text className="font-medium text-gray-800">Fast & Reliable</Text>
              <Text className="text-gray-600 mt-1">Enjoy smooth performance with minimal loading times.</Text>
            </View>
          </View>
          
          <View className="flex-row items-start">
            <Ionicons name="infinite" size={20} color="#16a34a" className="mt-1 mr-3" />
            <View className="flex-1">
              <Text className="font-medium text-gray-800">Regular Updates</Text>
              <Text className="text-gray-600 mt-1">We continuously improve our app with new features and bug fixes.</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Team Section */}
      <View className="bg-white mx-6 my-6 p-6 rounded-xl shadow-sm">
        <Text className="text-xl font-bold text-gray-800 mb-4">Our Team</Text>
        
        <View className="space-y-4">
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-green-100 rounded-full items-center justify-center mr-4">
              <Text className="text-green-700 font-bold text-lg">NT</Text>
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-800">Negede Tekleyes</Text>
              <Text className="text-gray-600">Lead Developer</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-green-100 rounded-full items-center justify-center mr-4">
              <Text className="text-green-700 font-bold text-lg">TT</Text>
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-800">Tewolde Tesfaye</Text>
              <Text className="text-gray-600">Lead Developer</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-green-100 rounded-full items-center justify-center mr-4">
              <Text className="text-green-700 font-bold text-lg">ME</Text>
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-800">Mekasha Eshetu</Text>
              <Text className="text-gray-600">UI/UX Designer</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-green-100 rounded-full items-center justify-center mr-4">
              <Text className="text-green-700 font-bold text-lg">GG</Text>
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-800">Genet Gebeyehu</Text>
              <Text className="text-gray-600">System Analyst</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-green-100 rounded-full items-center justify-center mr-4">
              <Text className="text-green-700 font-bold text-lg">FS</Text>
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-800">Fikru Siyum</Text>
              <Text className="text-gray-600">Tester</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Contact & Links */}
      <View className="bg-white mx-6 my-6 p-6 rounded-xl shadow-sm">
        <Text className="text-xl font-bold text-gray-800 mb-4">Contact & Links</Text>
        
        <View className="space-y-3">
          <TouchableOpacity 
            className="flex-row items-center py-3"
            onPress={() => openLink('mailto:support@appname.com')}
          >
            <Ionicons name="mail" size={20} color="#16a34a" className="mr-3" />
            <Text className="text-gray-700">support@shegareport.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center py-3"
            onPress={() => openLink('https://www.shegareport.com')}
          >
            <Ionicons name="globe" size={20} color="#16a34a" className="mr-3" />
            <Text className="text-gray-700">www.shegareport.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center py-3"
            onPress={() => openLink('https://twitter.com/appname')}
          >
            <Ionicons name="logo-twitter" size={20} color="#16a34a" className="mr-3" />
            <Text className="text-gray-700">@shegaReport</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center py-3"
            onPress={() => openLink('https://www.facebook.com/appname')}
          >
            <Ionicons name="logo-facebook" size={20} color="#16a34a" className="mr-3" />
            <Text className="text-gray-700">Shega Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Legal Section */}
      <View className="bg-white mx-6 mb-8 p-6 rounded-xl shadow-sm">
        <Text className="text-xl font-bold text-gray-800 mb-4">Legal</Text>
        
        <View className="space-y-4">
          <TouchableOpacity 
            className="py-2"
            onPress={() => router.push('/privacys')}
          >
            <Text className="text-green-600">Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-2"
            onPress={() => router.push('/terms')}
          >
            <Text className="text-green-600">Terms of Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-2"
            onPress={() => openLink('www.shegareport.com')}
          >
            <Text className="text-green-600">Licenses</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View className="items-center pb-8">
        <Text className="text-gray-500">© 2025 ShegaReport. All rights reserved.</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({})