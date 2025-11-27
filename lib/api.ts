import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.4:3000";

interface User {
  id: number;
  name: string;
  email: string;
  role: 'RESIDENT' | 'TECHNICIAN' | 'ADMIN';
}

interface LoginResponse {
  access_token: string;
  user: User;
  message?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}
export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/signup`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  COMPLAINTS: `${API_BASE_URL}/complaints`,
  MY_COMPLAINTS: `${API_BASE_URL}/complaints/my-complaints`,
  COMPLAINT_BY_ID: (id: number) => `${API_BASE_URL}/complaints/${id}`,
  REPORTS: `${API_BASE_URL}/reports`,
  MY_REPORTS: `${API_BASE_URL}/reports/my-complaints`,
  DASHBOARD_STATS: `${API_BASE_URL}/reports/dashboard/stats`,
  TECHNICIAN_TASKS: `${API_BASE_URL}/technicians/my-tasks`,
  TECHNICIAN_TASK_STATUS: (taskId: number) => `${API_BASE_URL}/technicians/task/${taskId}/status`,
  TECHNICIAN_TASK_DETAIL: (taskId: number) => `${API_BASE_URL}/technicians/task/${taskId}`,
  ASSIGNED_COMPLAINTS: `${API_BASE_URL}/complaints/assigned`,
  TECHNICIAN_PROFILE: `${API_BASE_URL}/technicians/profile/me`,
  
};

// Enhanced API request function
export const apiRequest = async (url: string, options: RequestInit = {}) => {

  const finalUrl = url.startsWith("http")
  ? url
  : `${API_BASE_URL}${url}`

  try {
    const token = await AsyncStorage.getItem("token");
    console.log('API Request:', { url: finalUrl, hasToken: !!token });
    
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
 // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds
    
    const response = await fetch(finalUrl, {
      headers,
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId)

    if (response.status === 401) {
      // Clear storage and throw specific error
      await AsyncStorage.multiRemove(["token", "user"]);
      throw new Error("Session expired. Please login again.");
    }

    // Handle non-JSON responses
    if (!response.ok) {
      const errorText = await response.text();
      // console.log("API Error Response", errorText)
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

    // handle timeout specifically
    // if (error.name === 'AbortError') {
    //   throw new Error('Request timeout. Place check your connection')
    // }
    throw error;
  }
};

// auth api functions
export const authAPI = {
  register:async (userData: any) =>{
  const data = await  apiRequest(API_ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    })
    return {
       access_token: data.access_token || data.token,
      user: data.user || {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      }
    };

    },
  
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
  
  getAssignedComplaints: () => apiRequest(API_ENDPOINTS.ASSIGNED_COMPLAINTS),
};

// technician api functions
export const techniciansAPI = {
  getMyTasks: async () => {
    try {
      console.log('Fetching technician tasks..')
      const response = await apiRequest(API_ENDPOINTS.TECHNICIAN_TASKS)
      // handle diffrent resopnse format
      return response.tasks || response.complaints || response || []
    } catch (error) {
      console.error('Failed to fetch technician tasks:', error)
      throw error
    }
  },

  updateTaskStatus: (taskId: number, status: string, additionalData?: any) =>
    apiRequest(API_ENDPOINTS.TECHNICIAN_TASK_STATUS(taskId), {
      method: "PATCH",
      body: JSON.stringify({ status,
        ...additionalData
       }),
    }),

  getTaskDetail: async (taskId: number) => {
    try {
      console.log('Fetchning task detail for:', taskId)
      const resopnse = await apiRequest(API_ENDPOINTS.TECHNICIAN_TASK_DETAIL(taskId))
      return resopnse
    } catch (error) {
      console.log('Failed to fetch task detail:', error)
      throw error
    }
  },
  getMyProfile: () => apiRequest(API_ENDPOINTS.TECHNICIAN_PROFILE),

  addTaskUpdate: (taskId: number, message: string, photos?: string[]) =>
    apiRequest(`${API_BASE_URL}/technicians/task/${taskId}/update`, {
      method: "POST",
      body: JSON.stringify({ message, photos }),
    }),
};

// admin api functions (if needed in the future)
export const adminAPI = {
  getAllComplaints: () => apiRequest(`${API_BASE_URL}/admin/complaints`),
  
  assignTechnician: (complaintId: number, technicianId: number) =>
    apiRequest(`${API_BASE_URL}/admin/complaints/${complaintId}/assign`, {
      method: "POST",
      body: JSON.stringify({ technicianId }),
    }),

  getTechnicians: () => apiRequest(`${API_BASE_URL}/admin/technicians`),
};