// app/report-details.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/providers/language-providers';

interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: string;
  photos: string[];
  location: any;
  createdAt: string;
  updatedAt: string;
}

export default function ReportDetailsScreen() {
  const { language } = useLanguage();
  const router = useRouter();
  const { complaintId } = useLocalSearchParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails();
    }
  }, [complaintId]);

  const fetchComplaintDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(
          language === 'en' ? 'Error' : 'ስህተት',
          language === 'en' ? 'Please login again' : 'እባክዎ ደግመው ይግቡ'
        );
        router.push('/login');
        return;
      }

      const API_BASE = "http://192.168.1.4:3000";
      const response = await fetch(`${API_BASE}/complaints/${complaintId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComplaint(data);
      } else {
        Alert.alert(
          language === 'en' ? 'Error' : 'ስህተት',
          language === 'en' ? 'Failed to load report details' : 'የሪፖርት ዝርዝሮችን ማምጣት አልተቻለም'
        );
      }
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      Alert.alert(
        language === 'en' ? 'Error' : 'ስህተት',
        language === 'en' ? 'Network error occurred' : 'የኔትወርክ ስህተት ተፈጥሯል'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return '#10B981';
      case 'in_progress': return '#F59E0B';
      case 'assigned': return '#3B82F6';
      case 'rejected': return '#EF4444';
      default: return '#6B7280'; // pending
    }
  };

  const getStatusText = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (language === 'en') {
      switch (statusLower) {
        case 'pending': return 'Pending Review';
        case 'assigned': return 'Assigned';
        case 'in_progress': return 'In Progress';
        case 'resolved': return 'Resolved';
        case 'rejected': return 'Rejected';
        default: return status;
      }
    } else {
      switch (statusLower) {
        case 'pending': return 'በግምት ላይ';
        case 'assigned': return 'ተመድቧል';
        case 'in_progress': return 'በሂደት ላይ';
        case 'resolved': return 'ተፈትቷል';
        case 'rejected': return 'ተቀባይነት አላገኘም';
        default: return status;
      }
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      'water_leak': language === 'en' ? 'Water Leak' : 'የውሃ ፍሳሽ',
      'no_water': language === 'en' ? 'No Water' : 'ውሃ አለመገኘት',
      'dirty_water': language === 'en' ? 'Dirty Water' : 'እርጥበት ውሃ',
      'sanitation': language === 'en' ? 'Sanitation' : 'ንፅህና',
      'pipe_burst': language === 'en' ? 'Burst Pipe' : 'የተቀጠቀጠ ቧንቧ',
      'drainage': language === 'en' ? 'Drainage' : 'መፍሰሻ'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'am-ET', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>
          {language === 'en' ? 'Loading report details...' : 'የሪፖርት ዝርዝሮች በመጫን ላይ...'}
        </Text>
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
        <Text style={styles.emptyText}>
          {language === 'en' ? 'Report not found' : 'ሪፖርት አልተገኘም'}
        </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            {language === 'en' ? 'Go Back' : 'ተመለስ'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === 'en' ? 'Report Details' : 'የሪፖርት ዝርዝሮች'}
        </Text>
        <View style={{ width: 24 }} /> {/* Spacer for balance */}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) }]}>
            <Text style={styles.statusText}>
              {getStatusText(complaint.status)}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{complaint.title}</Text>

          {/* Category and Urgency */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag" size={16} color="#6B7280" />
              <Text style={styles.metaText}>{getCategoryLabel(complaint.category)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="alert-circle" size={16} color="#6B7280" />
              <Text style={styles.metaText}>{complaint.urgency}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={16} color="#6B7280" />
              <Text style={styles.metaText}>{formatDate(complaint.createdAt)}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'en' ? 'Description' : 'መግለጫ'}
            </Text>
            <Text style={styles.description}>{complaint.description}</Text>
          </View>

          {/* Location */}
          {complaint.location && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'Location' : 'አድራሻ'}
              </Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={20} color="#059669" />
                <Text style={styles.locationText}>
                  {complaint.location.address || 'Location not specified'}
                </Text>
              </View>
              <Text style={styles.coordinates}>
                Lat: {complaint.location.latitude?.toFixed(6)}, Long: {complaint.location.longitude?.toFixed(6)}
              </Text>
            </View>
          )}

          {/* Photos */}
          {complaint.photos && complaint.photos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'Photos' : 'ፎቶዎች'} ({complaint.photos.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
                {complaint.photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: photo }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Report ID */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'en' ? 'Report ID' : 'የሪፖርት መለያ'}
            </Text>
            <Text style={styles.reportId}>#{complaint.id}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  coordinates: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  photosScroll: {
    marginHorizontal: -20,
  },
  photo: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
  },
  reportId: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
});