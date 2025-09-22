// app/reports-history.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert, StyleSheet, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/providers/language-providers';
import { useAuth } from '@/providers/auth-providers';

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

export default function ReportsHistoryScreen() {
  const { language } = useLanguage();
  const router = useRouter();
  const { user } = useAuth();
  const [compliants, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
   const {refresh} = useLocalSearchParams()
  const fetchComplaints = async () => {
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
      const response = await fetch(`${API_BASE}/complaints`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      } else {
        Alert.alert(
          language === 'en' ? 'Error' : 'ስህተት',
          language === 'en' ? 'Failed to load reports' : 'ሪፖርቶችን ማምጣት አልተቻለም'
        );
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Alert.alert(
        language === 'en' ? 'Error' : 'ስህተት',
        language === 'en' ? 'Network error occurred' : 'የኔትወርክ ስህተት ተፈጥሯል'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [refresh]);

//   const fetchComplaints = async ()=>{
//     setRefreshing(true)
//   }
  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
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
          {language === 'en' ? 'Loading reports...' : 'ሪፖርቶች በመጫን ላይ...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/reports')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === 'en' ? 'My Reports' : 'የእኔ ሪፖርቶች'}
        </Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#059669']}
          />
        }
      >
        {compliants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>
              {language === 'en' ? 'No reports submitted yet' : 'እስካሁን ምንም ሪፖርት አልቀረቡም'}
            </Text>
            <Text style={styles.emptySubtext}>
              {language === 'en' 
                ? 'Submit your first issue report to see it here' 
                : 'መጀመሪያዎን የችግር ሪፖርት ያስገቡ እዚህ ለማየት'
              }
            </Text>
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={() => router.push('/reports')}
            >
              <Text style={styles.submitButtonText}>
                {language === 'en' ? 'Submit Report' : 'ሪፖርት ያስገቡ'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>
              {language === 'en' ? 'Submitted Reports' : 'የቀረቡ ሪፖርቶች'} ({compliants.length})
            </Text>
            
            {compliants.map((compliant) => (
              <TouchableOpacity 
                key={compliant.id}
                style={styles.complaintCard}
                onPress={() => router.push({
                  pathname: '/report-details',
                  params: { complaintId: compliant.id }
                })}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.complaintTitle} numberOfLines={1}>
                      {compliant.title}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(compliant.status) }]}>
                      <Text style={styles.statusText}>
                        {getStatusText(compliant.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.dateText}>
                    {formatDate(compliant.createdAt)}
                  </Text>
                </View>

                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryText}>
                    {getCategoryLabel(compliant.category)}
                  </Text>
                  <View style={[styles.urgencyBadge, 
                    { backgroundColor: compliant.urgency === 'high' ? '#FEF2F2' : compliant.urgency === 'emergency' ? '#FEF2F2' : '#FFFBEB' }]}>
                    <Text style={[styles.urgencyText, 
                      { color: compliant.urgency === 'high' ? '#DC2626' : compliant.urgency === 'emergency' ? '#DC2626' : '#D97706' }]}>
                      {compliant.urgency}
                    </Text>
                  </View>
                </View>

                <Text style={styles.descriptionText} numberOfLines={2}>
                  {compliant.description}
                </Text>

                {compliant.photos && compliant.photos.length > 0 && (
                  <View style={styles.photosContainer}>
                    <Ionicons name="images" size={16} color="#6B7280" />
                    <Text style={styles.photosText}>
                      {compliant.photos.length} {language === 'en' ? 'photos' : 'ፎቶዎች'}
                    </Text>
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <Ionicons name="location" size={16} color="#6B7280" />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {compliant.location?.address || 'Location not specified'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
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
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  refreshButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  complaintCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  photosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  photosText: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
});