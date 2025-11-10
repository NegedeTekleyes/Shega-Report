
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.2:3000";

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  COMPLAINTS: `${API_BASE_URL}/complaints`,
  MY_COMPLAINTS: `${API_BASE_URL}/complaints/my-complaints`,
  COMPLAINT_BY_ID: (id: number) => `${API_BASE_URL}/complaints/${id}`,
  REPORTS: `${API_BASE_URL}/reports`,
  MY_REPORTS: `${API_BASE_URL}/reports/my-complaints`,
  DASHBOARD_STATS: `${API_BASE_URL}/reports/dashboard/stats`,
};

// Enhanced API request function
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    // Get authentication token
    const token = await AsyncStorage.getItem("token");
    console.log('API Request:', { url, hasToken: !!token });
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      headers,
      ...options,
    });

     if (response.status === 401) {
      // Clear storage and throw specific error
      await AsyncStorage.multiRemove(["token", "user"]);
      throw new Error("Session expired. Please login again.");
    }
    // Handle non-JSON responses
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Parse successful response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error
};
}
// auth api functions
export const authAPI = {
  register: (userData: any) =>
    apiRequest(API_ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  login: (email: string, password: string) =>
    apiRequest(API_ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getProfile: () => apiRequest(API_ENDPOINTS.PROFILE),

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  },
};

// complaint api functions
export const complaintsAPI = {
  create: (complaintData: any) =>
    apiRequest(API_ENDPOINTS.COMPLAINTS, {
      method: "POST",
      body: JSON.stringify(complaintData),
    }),
  getMyComplaints: () => apiRequest(API_ENDPOINTS.MY_COMPLAINTS),

  getById: (id: number) => apiRequest(API_ENDPOINTS.COMPLAINT_BY_ID(id)),
  getAssignedComplaints: () => apiRequest(`${API_BASE_URL}/complaints/assigned`),
  }

// technician api functions
export const techniciansAPI = {
  getMyTasks: () => apiRequest(`${API_BASE_URL}/technicians/my-tasks`),

  updateTaskStatus: (taskId: number, status: string) =>
    apiRequest(`${API_BASE_URL}/technicians/task/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
