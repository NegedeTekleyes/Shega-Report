import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useLanguage } from '@/providers/language-providers';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Switch } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';



// Mock notification data
const mockNotifications = [
  {
    id: '1',
    type: 'issue_update',
    title: 'Water Leak Report Updated',
    message: 'Your water leak report in Kebele 03 has been assigned to a technician',
    time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'new_issue',
    title: 'New Water Issue Nearby',
    message: 'A new water outage has been reported in your area (Kebele 01)',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'resolution',
    title: 'Issue Resolved',
    message: 'The pipe leakage issue in Kebele 02 has been successfully resolved',
    time: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: true,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'system',
    title: 'Maintenance Notice',
    message: 'Scheduled water maintenance in Central Area on Saturday 10AM-2PM',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: 'low'
  }
];
export default function NotificationScreen() {
    const {language}=useLanguage()
    const router = useRouter()
    const [notifications, setNotifications] = useState(mockNotifications)
    const [notificationSettings, setNotificationSettings] = useState({
                issueUpdates: true,
                newIssuesNearby: true,
                resolutions: true,
                systemAlerts: true,
                emergencyAlerts: true
    })
    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif => 
                notif.id === id ? {...notif, read: true} : notif
            )
        )
    }
    const markAllAsRead = ()=>{
        setNotifications(prev=>
            prev.map(notif => ({...notif, read : true}))
        )
    }

    const clearAll = () => {
        setNotifications([])
    }

    const getNotificationIcon = (type: string)=>{
        switch(type){
            case 'issue_update': return { name: 'refresh', color: '#3B82F6' };
            case 'new_issue': return { name: 'warning', color: '#EF4444' };
            case 'resolution': return { name: 'checkmark-circle', color: '#10B981' };
            case 'system': return { name: 'information', color: '#8B5CF6' };
            default: return { name: 'notifications', color: '#6B7280' }; 
        }
    }

    const formatTime = (date: Date)=>{
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor(diff / (1000  * 60))
        if (minutes < 1) return language === 'en' ? 'Just now' : 'አሁን';
        if (minutes < 60) return `${minutes} ${language === 'en' ? 'min ago' : 'ደቂቃ በፊት'}`;
        if (hours < 24) return `${hours} ${language === 'en' ? 'hours ago' : 'ሰዓት በፊት'}`;
        return date.toLocaleDateString()
    }

    const unreadCount = notifications.filter(n => !n.read).length
  return (
    <View className='flex-1 bg-gray-50'>
        {/* header */}
        <View className='bg-green-600 px-6 pt-12 pb-4'>
            <View className='flex-row items-center justify-between mb-4'>
                <View>

                     <Text className='text-white text-2xl font-bold'>
                        {language === 'en'? 'Notifications': 'ማስታወቂያዎች'}
                     </Text>
                    <Text className="text-green-100 text-sm">
                        {unreadCount > 0 
                            ? `${unreadCount} ${language === 'en' ? 'unread' : 'ያልተነበቡ'}`
                            : language === 'en' ? 'All caught up' : 'ሁሉም ተነትቷል'
                        }
                    </Text>
                </View>
                <View className='flex-row space-x-2'>
                    {unreadCount > 0 && (
                        <TouchableOpacity
                        onPress={markAllAsRead}
                        className='bg-white/20 p-2 rounded-full'>
                            <Ionicons name='checkmark-done' size ={20} color='white'/>
                        </TouchableOpacity>
                    )}
                    {notifications.length > 0 && (
                            <TouchableOpacity 
                                onPress={clearAll}
                                className="bg-white/20 p-2 rounded-full"
                            >
                                <Ionicons name="trash" size={20} color="white" />
                            </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
        <ScrollView className='flex-1 px-4'>
                    {/* notification setting */}
                    <View className='bg-white rounded-xl p-4 mt-4 shadow-sm'>
                        <Text className='text-lg dont-semibold text-gray-800 mb-3'>
                             {language === 'en' ? 'Notification Settings' : 'የማስታወቂያ ቅንብሮች'}
                            </Text>
                    {[
            { key: 'issueUpdates', label: language === 'en' ? 'Issue Updates' : 'የችግር ማዘመኛዎች' },
            { key: 'newIssuesNearby', label: language === 'en' ? 'New Issues Nearby' : 'አዲስ ችግሮች በአካባቢዎ' },
            { key: 'resolutions', label: language === 'en' ? 'Resolutions' : 'ፍትሆች' },
            { key: 'systemAlerts', label: language === 'en' ? 'System Alerts' : 'የስርዓት ማስጠንቀቂያዎች' },
            { key: 'emergencyAlerts', label: language === 'en' ? 'Emergency Alerts' : 'አስቸኳይ ማስጠንቀቂያዎች' }
          ].map((setting, index) => (
            <View key={setting.key} className={`flex-row items-center justify-between py-3 ${index < 4 ? 'border-b border-gray-100' : ''}`}>
              <Text className="text-gray-700">{setting.label}</Text>
              <Switch
                value={notificationSettings[setting.key]}
                onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, [setting.key]: value }))}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
              />
            </View>
          ))}
        </View>

        {/* Notifications List */}
        <View className="mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            {language === 'en' ? 'Recent Notifications' : 'የቅርብ ጊዜ ማስታወቂያዎች'}
          </Text>

          {notifications.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <Ionicons name="notifications-off" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg font-medium mt-4">
                {language === 'en' ? 'No notifications' : 'ምንም ማስታወቂያዎች የሉም'}
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                {language === 'en' 
                  ? 'You\'ll see important updates here'
                  : 'አስፈላጊ ማዘመኛዎችን እዚህ ያገኛሉ'
                }
              </Text>
            </View>
          ) : (
            notifications.map((notification, index) => {
              const icon = getNotificationIcon(notification.type);
              return (
                <Animated.View
                  key={notification.id}
                  entering={FadeInUp.delay(index * 100)}
                  className={`bg-white rounded-xl p-4 mb-3 shadow-sm ${!notification.read ? 'border-l-4 border-green-500' : ''}`}
                >
                  <View className="flex-row items-start space-x-3">
                    <View 
                      className="w-10 h-10 rounded-full justify-center items-center mt-1"
                      style={{ backgroundColor: `${icon.color}20` }}
                    >
                      <Ionicons name={icon.name} size={20} color={icon.color} />
                    </View>
                    
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start">
                        <Text className="text-gray-800 font-semibold flex-1">
                          {notification.title}
                        </Text>
                        <Text className="text-gray-400 text-xs">
                          {formatTime(notification.time)}
                        </Text>
                      </View>
                      
                      <Text className="text-gray-600 mt-1 text-sm">
                        {notification.message}
                      </Text>
                      
                      {!notification.read && (
                        <TouchableOpacity 
                          onPress={() => markAsRead(notification.id)}
                          className="self-start mt-2"
                        >
                          <Text className="text-green-600 text-xs font-medium">
                            {language === 'en' ? 'Mark as read' : 'እንደተነበበ ምልክት ያድርጉ'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Animated.View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({})