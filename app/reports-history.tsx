// app/reports-history.tsx
import { useAuth } from "@/providers/auth-providers";
import { useLanguage } from "@/providers/language-providers";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refresh } = useLocalSearchParams();
  const fetchComplaints = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(
          language === "en" ? "Error" : "ስህተት",
          language === "en" ? "Please login again" : "እባክዎ ደግመው ይግቡ"
        );
        router.push("/login");
        return;
      }

      const API_BASE = "http://localhost:3000";
      const response = await fetch(`${API_BASE}/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      } else {
        Alert.alert(
          language === "en" ? "Error" : "ስህተት",
          language === "en" ? "Failed to load reports" : "ሪፖርቶችን ማምጣት አልተቻለም"
        );
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      Alert.alert(
        language === "en" ? "Error" : "ስህተት",
        language === "en" ? "Network error occurred" : "የኔትወርክ ስህተት ተፈጥሯል"
      );
      setComplaints([])
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
    switch (status?.toUpperCase()) {
      case "RESOLVED":
        return "#10B981";
      case "IN_PROGRESS":
        return "#F59E0B";
      case "ASSIGNED":
        return "#3B82F6";
      case "REJECTED":
        return "#EF4444";
      case "SUBMITTED":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    const statusUpper = status?.toUpperCase();
    if (language === "en") {
      switch (statusUpper) {
        case "SUBMITTED":
          return "Submitted";
        case "ASSIGNED":
          return "Assigned";
        case "IN_PROGRESS":
          return "In Progress";
        case "RESOLVED":
          return "Resolved";
        case "REJECTED":
          return "Rejected";
        default:
          return status || "Unknown";
      }
    } else {
      switch (statusUpper) {
         case "SUBMITTED":
          return "ቀርቧል";
        case "ASSIGNED":
          return "ተመድቧል";
        case "IN_PROGRESS":
          return "በሂደት ላይ";
        case "RESOLVED":
          return "ተፈትቷል";
        case "REJECTED":
          return "ተቀባይነት አላገኘም";
        default:
          return status || "አልታወቀም";
      }
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      WATER_LEAK: language === "en" ? "Water Leak" : "የውሃ ፍሳሽ",
      NO_WATER: language === "en" ? "No Water" : "ውሃ አለመገኘት",
      DIRTY_WATER: language === "en" ? "Dirty Water" : "እርጥበት ውሃ",
      SANITATION: language === "en" ? "Sanitation" : "ንፅህና",
      PIPE_BRUST: language === "en" ? "Burst Pipe" : "የተቀጠቀጠ ቧንቧ",
      DRANIAGE: language === "en" ? "Drainage" : "መፍሰሻ",
    };
    return categories[category as keyof typeof categories] || category || "Unknown Category";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "en" ? "en-US" : "am-ET", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // safe navigtaion handler
  const handleComplaintPress = (complaint: Complaint)=>{
     if (!complaint?.id) {
      Alert.alert(
        language === "en" ? "Error" : "ስህተት",
        language === "en" ? "Invalid complaint data" : "ልክ ያልሆነ የቅሬታ ውሂብ"
      );
      return;
    }

    router.push({
      pathname: "/report-details",
      params: { 
        complaintId: complaint.id.toString(),
        complaintData: JSON.stringify(complaint) // Pass full data as backup
      },
    });
  }
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>
          {language === "en" ? "Loading reports..." : "ሪፖርቶች በመጫን ላይ..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === "en" ? "My Reports" : "የእኔ ሪፖርቶች"}
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
            colors={["#059669"]}
          />
        }
      >
        {!complaints || complaints.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>
              {language === "en"
                ? "No reports submitted yet"
                : "እስካሁን ምንም ሪፖርት አልቀረቡም"}
            </Text>
            <Text style={styles.emptySubtext}>
              {language === "en"
                ? "Submit your first issue report to see it here"
                : "መጀመሪያዎን የችግር ሪፖርት ያስገቡ እዚህ ለማየት"}
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => router.push("/reports")}
            >
              <Text style={styles.submitButtonText}>
                {language === "en" ? "Submit Report" : "ሪፖርት ያስገቡ"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>
              {language === "en" ? "Submitted Reports" : "የቀረቡ ሪፖርቶች"} (
              {complaints.length})
            </Text>

            {complaints.map((complaint, index) => (
              <TouchableOpacity
                key={complaint?.id || `complaint-${index}`}
                style={styles.complaintCard}
                onPress={() =>
                 handleComplaintPress(complaint)
                }
              >
                <View style={styles.cardHeader}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.complaintTitle} numberOfLines={1}>
                      {complaint.title}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(complaint.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusText(complaint.status)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.dateText}>
                    {formatDate(complaint.createdAt)}
                  </Text>
                </View>

                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryText}>
                    {getCategoryLabel(complaint.category)}
                  </Text>
                  <View
                    style={[
                      styles.urgencyBadge,
                      {
                        backgroundColor:
                          complaint.urgency === "high"
                            ? "#FEF2F2"
                            : complaint.urgency === "emergency"
                            ? "#FEF2F2"
                            : "#FFFBEB",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.urgencyText,
                        {
                          color:
                            complaint.urgency === "high"
                              ? "#DC2626"
                              : complaint.urgency === "emergency"
                              ? "#DC2626"
                              : "#D97706",
                        },
                      ]}
                    >
                      {complaint.urgency}
                    </Text>
                  </View>
                </View>

                <Text style={styles.descriptionText} numberOfLines={2}>
                  {complaint.description}
                </Text>

                {complaint.photos && complaint.photos.length > 0 && (
                  <View style={styles.photosContainer}>
                    <Ionicons name="images" size={16} color="#6B7280" />
                    <Text style={styles.photosText}>
                      {complaint.photos.length}{" "}
                      {language === "en" ? "photos" : "ፎቶዎች"}
                    </Text>
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <Ionicons name="location" size={16} color="#6B7280" />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {complaint.location?.address || "Location not specified"}
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
    backgroundColor: "#F9FAFB",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 16,
    color: "#6B7280",
    fontSize: 16,
  },
  header: {
    backgroundColor: "#0a5398ff",
    flexDirection: "row",
    alignItems: "center",
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
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
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
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 400,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: "#0a5398ff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 16,
  },
  complaintCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginRight: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  descriptionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  photosContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 4,
  },
  photosText: {
    fontSize: 12,
    color: "#6B7280",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },
});
