import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/providers/language-providers';
import * as Location from 'expo-location';
import Animated, { FadeInUp } from 'react-native-reanimated';

// Define types for our water issue
interface WaterIssue {
  id: string;
  type: string;
  title: string;
  latitude: number;
  longitude: number;
  severity: string;
  status: string;
  reportedAt: Date;
  address: string;
}

// Mock water issue data
const mockWaterIssues: WaterIssue[] = [
  {
    id: '1',
    type: 'water_leak',
    title: 'Main Pipe Leak',
    latitude: 9.6816,
    longitude: 39.5336,
    severity: 'high',
    status: 'pending',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    address: 'Kebele 03, Near Market'
  },
  {
    id: '2',
    type: 'no_water',
    title: 'Water Outage',
    latitude: 9.6820,
    longitude: 39.5340,
    severity: 'medium',
    status: 'in_progress',
    reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    address: 'Kebele 01, Residential Area'
  },
  {
    id: '3',
    type: 'dirty_water',
    title: 'Water Quality Issue',
    latitude: 9.6800,
    longitude: 39.5320,
    severity: 'emergency',
    status: 'resolved',
    reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    address: 'Kebele 02, School Zone'
  }
];

export default function MapScreen() {
  const { language } = useLanguage();
  const router = useRouter();
  const [selectedIssue, setSelectedIssue] = useState<WaterIssue | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    water_leak: true,
    no_water: true,
    dirty_water: true,
    pending: true,
    in_progress: true,
    resolved: true
  });

  const getMarkerIcon = (type: string) => {
    const icons: Record<string, { name: any; color: string }> = {
      water_leak: { name: 'water', color: '#3B82F6' },
      no_water: { name: 'water-off', color: '#EF4444' },
      dirty_water: { name: 'alert-circle', color: '#F59E0B' },
    };
    
    return icons[type] || { name: 'help-circle', color: '#6B7280' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'in_progress': return '#3B82F6';
      case 'resolved': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'en') {
      switch (status) {
        case 'pending': return 'Pending';
        case 'in_progress': return 'In Progress';
        case 'resolved': return 'Resolved';
        default: return status;
      }
    } else {
      switch (status) {
        case 'pending': return 'በጥበቃ';
        case 'in_progress': return 'በሂደት';
        case 'resolved': return 'ተፈትቷል';
        default: return status;
      }
    }
  };

  const filteredIssues = mockWaterIssues.filter(issue => {
    return filters[issue.type as keyof typeof filters] && 
           filters[issue.status as keyof typeof filters];
  });

  const handleReportIssue = () => {
    router.push('/reports');
  };

  const toggleFilter = (filterKey: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey as keyof typeof filters]
    }));
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-12 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-white text-2xl font-bold">
              {language === 'en' ? 'Water Issues Map' : 'የውሃ ችግሮች ካርታ'}
            </Text>
            <Text className="text-green-100 text-sm">
              {language === 'en' ? 'Debre Birhan Municipality' : 'የደብረ ብርሃን ወረዳ'}
            </Text>
          </View>
          
          <View className="flex-row space-x-2">
            <TouchableOpacity 
              onPress={() => setShowFilters(!showFilters)}
              className="bg-white/20 p-2 rounded-full"
            >
              <Ionicons name="filter" size={20} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleReportIssue}
              className="bg-white/20 p-2 rounded-full"
            >
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <Animated.View 
          entering={FadeInUp}
          className="bg-white px-6 py-4 shadow-md"
        >
          <Text className="text-gray-800 font-semibold mb-3">
            {language === 'en' ? 'Filter Issues' : 'ችግሮችን ያጣሩ'}
          </Text>
          
          <View className="flex-row flex-wrap gap-2 mb-3">
            {['water_leak', 'no_water', 'dirty_water'].map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => toggleFilter(type)}
                className={`px-3 py-2 rounded-full ${
                  filters[type as keyof typeof filters] ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  filters[type as keyof typeof filters] ? 'text-green-800' : 'text-gray-600'
                }`}>
                  {language === 'en' ? 
                    type === 'water_leak' ? 'Leaks' :
                    type === 'no_water' ? 'Outages' : 'Quality'
                  : 
                    type === 'water_leak' ? 'ፍሳሾች' :
                    type === 'no_water' ? 'እጦቶች' : 'ጥራት'
                  }
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row flex-wrap gap-2">
            {['pending', 'in_progress', 'resolved'].map(status => (
              <TouchableOpacity
                key={status}
                onPress={() => toggleFilter(status)}
                className={`px-3 py-2 rounded-full ${
                  filters[status as keyof typeof filters] ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  filters[status as keyof typeof filters] ? 'text-blue-800' : 'text-gray-600'
                }`}>
                  {getStatusText(status)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}

      <ScrollView className="flex-1">
        {/* Map Placeholder */}
        <View className="h-64 bg-green-200 justify-center items-center mx-4 my-4 rounded-xl">
          <Ionicons name="map" size={48} color="#16a34a" />
          <Text className="text-green-800 font-semibold mt-2">
            {language === 'en' ? 'Map View Coming Soon' : 'የካርታ እይታ በቅርብ ጊዜ ይመጣል'}
          </Text>
          <Text className="text-green-600 text-sm text-center mt-1 px-4">
            {language === 'en' 
              ? 'Interactive map with water issue locations will be available soon'
              : 'የውሃ ችግሮችን የሚያሳይ በይነተገናኝ ካርታ በቅርብ ጊዜ ይገኛል'
            }
          </Text>
        </View>

        {/* List of Issues instead of map */}
        <View className="px-4 mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            {language === 'en' ? 'Recent Water Issues' : 'የቅርብ ጊዜ የውሃ ችግሮች'}
          </Text>
          
          {filteredIssues.length === 0 ? (
            <View className="bg-white p-6 rounded-xl items-center">
              <Ionicons name="search" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2 text-center">
                {language === 'en' 
                  ? 'No issues found with current filters'
                  : 'በአሁኑ ማጣሪያ ምንም ችግሮች አልተገኙም'
                }
              </Text>
            </View>
          ) : (
            filteredIssues.map((issue) => (
              <TouchableOpacity
                key={issue.id}
                onPress={() => setSelectedIssue(issue)}
                className="bg-white p-4 rounded-xl mb-3 shadow-sm"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View 
                      className="w-10 h-10 rounded-full justify-center items-center mr-3"
                      style={{ backgroundColor: getMarkerIcon(issue.type).color }}
                    >
                      <Ionicons 
                        name={getMarkerIcon(issue.type).name} 
                        size={20} 
                        color="white" 
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-800 font-semibold">{issue.title}</Text>
                      <Text className="text-gray-600 text-sm">{issue.address}</Text>
                      <Text className="text-gray-500 text-xs mt-1">
                        {issue.reportedAt.toLocaleDateString()} • {issue.reportedAt.toLocaleTimeString()}
                      </Text>
                    </View>
                  </View>
                  <View 
                    className="w-3 h-3 rounded-full ml-2"
                    style={{ backgroundColor: getStatusColor(issue.status) }}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Selected Issue Modal */}
      {selectedIssue && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center px-4">
          <Animated.View 
            entering={FadeInUp}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <View className="flex-row justify-between items-start mb-4">
              <Text className="text-xl font-bold text-gray-800 flex-1">
                {selectedIssue.title}
              </Text>
              <TouchableOpacity onPress={() => setSelectedIssue(null)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center mb-3">
              <View 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: getStatusColor(selectedIssue.status) }}
              />
              <Text className="text-gray-600 font-medium">
                {getStatusText(selectedIssue.status)}
              </Text>
            </View>

            <Text className="text-gray-600 mb-3">
              {selectedIssue.address}
            </Text>

            <Text className="text-gray-500 text-sm mb-4">
              {language === 'en' ? 'Reported' : 'የተጠቆመ'}{' '}
              {selectedIssue.reportedAt.toLocaleDateString()} • 
              {selectedIssue.reportedAt.toLocaleTimeString()}
            </Text>

            <TouchableOpacity 
              className="bg-green-600 py-3 rounded-xl mb-2"
              onPress={() => {
                setSelectedIssue(null);
                router.push('/reports');
              }}
            >
              <Text className="text-white font-semibold text-center">
                {language === 'en' ? 'Report Similar Issue' : 'ተመሳሳይ ችግር ይግለጹ'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="border border-gray-300 py-3 rounded-xl"
              onPress={() => setSelectedIssue(null)}
            >
              <Text className="text-gray-600 font-medium text-center">
                {language === 'en' ? 'Close' : 'ዝጋ'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* Stats Bar */}
      {/* <View className="bg-white px-6 py-3 border-t border-gray-200">
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-800">
              {mockWaterIssues.length}
            </Text>
            <Text className="text-gray-600 text-xs">
              {language === 'en' ? 'Total Issues' : 'ጠቅላላ ችግሮች'}
            </Text>
          </View>
          
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">
              {mockWaterIssues.filter(i => i.status === 'resolved').length}
            </Text>
            <Text className="text-gray-600 text-xs">
              {language === 'en' ? 'Resolved' : 'ተፈትተዋል'}
            </Text>
          </View>
          
          <View className="items-center">
            <Text className="text-2xl font-bold text-yellow-600">
              {mockWaterIssues.filter(i => i.status === 'in_progress').length}
            </Text>
            <Text className="text-gray-600 text-xs">
              {language === 'en' ? 'In Progress' : 'በሂደት ላይ'}
            </Text>
          </View>
        </View>
      </View> */}
    </View>
  );
}