// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/providers/auth-providers';
import { useLanguage } from '@/providers/language-providers';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('confirmLogout'),
      [
        { 
          text: t('cancel'), 
          style: 'cancel',
          onPress: () => console.log('Cancel pressed') 
        },
        { 
          text: t('logout'), 
          onPress: () => {
            logout();
            console.log("Logout pressed");
            setTimeout(() => {
              router.replace('/(auth)/welcome');
            }, 100);
          }
        }
      ]
    );
  };

  const stats = [
    { 
      icon: 'water-outline', 
      label: t('reportsSubmitted'), 
      value: '12', 
      color: '#3B82F6',
      gradient: ['#3B82F6', '#60A5FA']
    },
    { 
      icon: 'checkmark-done-outline', 
      label: t('issuesResolved'), 
      value: '8', 
      color: '#10B981',
      gradient: ['#10B981', '#34D399']
    },
    { 
      icon: 'time-outline', 
      label: t('pendingIssues'), 
      value: '4', 
      color: '#F59E0B',
      gradient: ['#F59E0B', '#FBBF24']
    },
  ];

  const quickActions = [
    {
      icon: 'add-circle',
      label: t('reportIssue'),
      screen: '/(tabs)/report',
      color: '#EF4444',
      gradient: ['#EF4444', '#F87171']
    },
    {
      icon: 'map',
      label: t('viewMap'),
      screen: '/(tabs)/map',
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#A78BFA']
    },
    {
      icon: 'list',
      label: t('myReports'),
      screen: '/(tabs)/reports',
      color: '#06B6D4',
      gradient: ['#06B6D4', '#22D3EE']
    },
    {
      icon: 'notifications',
      label: t('notifications'),
      screen: '/(tabs)/notifications',
      color: '#F97316',
      gradient: ['#F97316', '#FB923C']
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: language === 'en' ? 'Water Leak Report' : 'የውሃ ፍሳሽ ሪፖርት',
      status: language === 'en' ? 'In Progress' : 'በሂደት ላይ',
      time: language === 'en' ? '2 hours ago' : '2 ሰዓት በፊት',
      location: 'Kebele 03',
      icon: 'water'
    },
    {
      id: '2',
      type: language === 'en' ? 'Pipe Repair' : 'የቧንቧ ጥገና',
      status: language === 'en' ? 'Completed' : 'ተጠናቋል',
      time: language === 'en' ? '1 day ago' : '1 ቀን በፊት',
      location: 'Kebele 01',
      icon: 'construct'
    }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#009639', '#00B341']}
        className="px-6 pt-12 pb-8 rounded-b-3xl"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">ShegaReport</Text>
            <Text className="text-green-100 text-sm">
              {t('waterManagement')}
            </Text>
          </View>
          
          {/* User Profile with Logout */}
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity 
              onPress={handleLogout}
              className="bg-white/20 p-2 rounded-full"
            >
              <Ionicons name="log-out-outline" size={22} color="white" />
            </TouchableOpacity>
            <View className="w-10 h-10 bg-white/20 rounded-full justify-center items-center">
              <Text className="text-white font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Welcome Section */}
        <Animated.View 
          entering={FadeInDown.delay(200)}
          className="bg-white/10 p-5 rounded-3xl border border-white/20"
        >
          <Text className="text-white text-lg font-semibold mb-1">
            👋 {t('welcome')}, {user?.name}!
          </Text>
          <Text className="text-green-100 text-sm mb-3">
            {user?.email}
          </Text>
          <View className="flex-row items-center justify-between">
            <View className={`px-4 py-2 rounded-full ${
              user?.role === 'admin' ? 'bg-red-100' : 
              user?.role === 'technician' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <Text className={`text-xs font-semibold ${
                user?.role === 'admin' ? 'text-red-800' : 
                user?.role === 'technician' ? 'text-blue-800' : 'text-green-800'
              }`}>
                {user?.role?.toUpperCase()}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location" size={14} color="#FFDE00" />
              <Text className="text-yellow-300 text-xs ml-1">Debre Birhan</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Statistics Cards */}
        <Text className="text-2xl font-bold mt-6 mb-4 text-gray-800">
          📊 {t('overview')}
        </Text>
        
        <View className="flex-row justify-between mb-6 -mx-1">
          {stats.map((stat, index) => (
            <Animated.View
              key={stat.label}
              entering={FadeInDown.delay(300 + index * 100)}
              className="flex-1 mx-1"
            >
              <LinearGradient
                colors={stat.gradient}
                className="p-4 rounded-2xl shadow-lg"
              >
                <View className="items-center">
                  <View className="w-12 h-12 bg-white/20 rounded-full justify-center items-center mb-2">
                    <Ionicons name={stat.icon} size={24} color="white" />
                  </View>
                  <Text className="text-white text-2xl font-bold">
                    {stat.value}
                  </Text>
                  <Text className="text-white/90 text-xs text-center mt-1">
                    {stat.label}
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text className="text-2xl font-bold mb-4 text-gray-800">
          ⚡ {t('quickActions')}
        </Text>
        
        <View className="flex-row flex-wrap justify-between mb-6  items-center">
          {quickActions.map((action, index) => (
            <Animated.View
              key={action.label}
              entering={FadeInUp.delay(500 + index * 100)}
              className=" mb-4 "
            >
              <TouchableOpacity
                onPress={() => router.push(action.screen as any)}
                className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 active:scale-95"
              >
                <LinearGradient
                  colors={action.gradient}
                  className="w-14 h-14 rounded-2xl justify-center items-center mb-3"
                >
                  <Ionicons name={action.icon} size={28} color="white" />
                </LinearGradient>
                <Text className="text-gray-800 font-semibold text-center text-sm">
                  {action.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Recent Activity */}
        <Text className="text-2xl font-bold mb-4 text-gray-800">
          📋 {t('recentActivity')}
        </Text>
        
        <View className="mb-8">
          {recentActivities.map((activity, index) => (
            <Animated.View
              key={activity.id}
              entering={FadeInUp.delay(700 + index * 100)}
              className="bg-white rounded-2xl shadow-sm p-4 mb-3 border border-gray-100"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center mr-3">
                    <Ionicons name={activity.icon} size={20} color="#3B82F6" />
                  </View>
                  <View>
                    <Text className="text-gray-800 font-semibold">
                      {activity.type}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {activity.location}
                    </Text>
                  </View>
                </View>
                <View className={`px-3 py-1 rounded-full ${
                  activity.status === (language === 'en' ? 'Completed' : 'ተጠናቋል') 
                    ? 'bg-green-100' 
                    : 'bg-yellow-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    activity.status === (language === 'en' ? 'Completed' : 'ተጠናቋል')
                      ? 'text-green-800'
                      : 'text-yellow-800'
                  }`}>
                    {activity.status}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-400 text-xs">
                {activity.time}
              </Text>
            </Animated.View>
          ))}
        </View>

        {/* Emergency Quick Action */}
        <Animated.View 
          entering={FadeInUp.delay(900)}
          className="bg-red-50 rounded-2xl p-5 mb-8 border border-red-200"
        >
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 bg-red-100 rounded-full justify-center items-center mr-3">
              <Ionicons name="warning" size={24} color="#EF4444" />
            </View>
            <View className="flex-1">
              <Text className="text-red-800 font-semibold text-lg">
                {language === 'en' ? 'Emergency Issue?' : 'አስቸኳይ ችግር?'}
              </Text>
              <Text className="text-red-600 text-sm">
                {language === 'en' ? 'Report critical issues immediately' : 'አስቸኳይ ችግሮችን ወዲያውኑ ይለግሱ'}
              </Text>
            </View>
          </View>
          <TouchableOpacity className="bg-red-600 py-3 rounded-xl">
            <Text className="text-white font-semibold text-center">
              {language === 'en' ? 'Report Emergency' : 'አስቸኳይ ሪፖርት'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}