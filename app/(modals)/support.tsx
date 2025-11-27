import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function SupportScreen() {
  const router = useRouter()
  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@shegareport.com?subject=Support Request')
  }

  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890')
  }

  const openFAQ = () => {
    Linking.openURL('https://shegareport.com/faq')
  }

  const openHelpCenter = () => {
    Linking.openURL('https://shegareport.com/help')
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}       
      <View className="bg-[#0a5398ff] px-6 pt-12 pb-4 shadow-sm">
        <TouchableOpacity onPress={() => router.push("/(tabs)/settings")} className="mr-4">
            <Ionicons name='arrow-back' size={24} color='white'/>
         </TouchableOpacity>
         <View className=' ml-6'>
        <Text className="text-2xl font-bold text-white mb-2 mr-6">Support</Text>
        <Text className="text-lg text-gray-200">
          We're here to help you
        </Text>
         </View>
      </View>
        

      {/* Contact Methods */}
      <View className="bg-[#15bdc6ff] mx-4 my-4 rounded-xl shadow-sm p-4">
        <Text className="text-xl font-semibold text-gray-900 mb-4">Contact Us</Text>
        
        <TouchableOpacity 
          className="flex-row items-center py-4 border-b border-gray-100"
          onPress={handleEmailSupport}
        >
          <View className="w-10 items-center mr-3">
            <Ionicons name="mail" size={24} color="#0a5398" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900 mb-1">Email Support</Text>
            <Text className="text-sm text-gray-600">
              Get help via email
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center py-4 border-b border-gray-100"
          onPress={handleCallSupport}
        >
          <View className="w-10 items-center mr-3">
            <Ionicons name="call" size={24} color="#0a5398" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900 mb-1">Call Support</Text>
            <Text className="text-sm text-gray-600">
              +1 (234) 567-890
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center py-4"
          onPress={openFAQ}
        >
          <View className="w-10 items-center mr-3">
            <Ionicons name="help-circle" size={24} color="#0a5398" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900 mb-1">FAQ</Text>
            <Text className="text-sm text-gray-600">
              Frequently asked questions
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Help Resources */}
      <View className="bg-[#15bdc6ff] mx-4 my-4 rounded-xl shadow-sm p-4">
        <Text className="text-xl font-semibold text-gray-900 mb-4">Help Resources</Text>
        
        <TouchableOpacity 
          className="flex-row items-center py-4 border-b border-gray-100"
          onPress={openHelpCenter}
        >
          <View className="w-10 items-center mr-3">
            <Ionicons name="book" size={24} color="#0a5398" />
          </View>
          <Text className="flex-1 text-base font-medium text-gray-900">Help Center</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center py-4 border-b border-gray-100"
          onPress={() => Linking.openURL('https://shegareport.com/guides')}
        >
          <View className="w-10 items-center mr-3">
            <Ionicons name="document-text" size={24} color="#0a5398" />
          </View>
          <Text className="flex-1 text-base font-medium text-gray-900">User Guides</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center py-4"
          onPress={() => Linking.openURL('https://shegareport.com/community')}
        >
          <View className="w-10 items-center mr-3">
            <Ionicons name="people" size={24} color="#0a5398" />
          </View>
          <Text className="flex-1 text-base font-medium text-gray-900">Community Forum</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Business Hours */}
      <View className="bg-[#15bdc6ff] mx-4 my-4 rounded-xl shadow-sm p-4">
        <Text className="text-xl font-semibold text-gray-900 mb-4">Business Hours</Text>
        
        <View className="space-y-3">
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-base text-gray-700">Monday - Friday</Text>
            <Text className="text-base font-medium text-gray-900">12:00 AM - 12:00 PM</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-base text-gray-700">Saturday</Text>
            <Text className="text-base font-medium text-gray-900">2:00 AM - 12:00 PM</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-base text-gray-700">Sunday</Text>
            <Text className="text-base font-medium text-gray-900">Closed</Text>
          </View>
        </View>
      </View>

      {/* Emergency Contact */}
      <View className="bg-[#15bdc6ff] mx-4 my-4 rounded-xl p-5 border border-red-200">
        <View className="items-center">
          <Ionicons name="warning" size={28} color="#dc2626ff" />
          <Text className="text-xl font-semibold text-gray-800 mt-3 mb-2">Emergency Support</Text>
          <Text className="text-sm text-gray-700 text-center mb-4">
            For urgent issues that require immediate attention outside of business hours
          </Text>
          <TouchableOpacity 
            className="bg-red-500 px-6 py-3 rounded-lg"
            onPress={() => Linking.openURL('tel:+990')}
          >
            <Text className="text-white font-semibold text-base">Call Emergency Line</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Footer */}
      <View className="items-center py-6">
        <Text className="text-gray-700 text-sm">© 2025 ShegaReport. All rights reserved.</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({})