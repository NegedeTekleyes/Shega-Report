import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

// Supported languages
export type Language = "en" | "am";

// Extended translation keys
export const translations = {
  welcome: { en: "Welcome to ShegaReport", am: "እንኳን ወደ ሸጋሪፖርት በደህና መጡ" },
  login: { en: "Login", am: "ግባ" },
  pleaseFillAll: {
    en: "Please fill all fields",
    am: "እባክዎ ሁሉንም መስኮች ይሙሉ",
  },
  passwordsDontMatch: {
    en: "Passwords do not match",
    am: "የይለፍ ቃላት አይጣጣሙም",
  },
  passwordTooShort: {
    en: "Password must be at least 6 characters",
    am: "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች ሊኖሩት ይገባል",
  },
  signupSuccess: {
    en: "Signup Success",
    am: "በተሳካ ሁኔታ ተመዝግበዋል",
  },
  signupError: {
    en: "Signup failed. Please try again.",
    am: "ምዝገባ አልተሳካም። እባክዎ ደግሞ ይሞክሩ።",
  },
  createAccount: {
    en: "Create Account",
    am: "መለያ ይፍጠሩ",
  },
  joinOurCommunity: {
    en: "Join our water management community",
    am: "ወደ ውሃ አስተዳደር ማህበረሰባችን ይቀላቀሉ",
  },
  register: { en: "Sign Up", am: "ተመዝገብ" },
  fullName: { en: "Full name", am: "ሙሉ ስም" },
  enterFullName: { en: "Enter Full Name", am: "ሙሉ ስም ያስግቡ" },
  email: { en: "Email", am: "ኢሜይል" },
  password: { en: "Password", am: "የይለፍ ቃል" },
  confirmPassword: { en: "Confirm Password", am: "የይለፍ ቃል ያረጋግጡ" },
  enterEmail: { en: "Enter your email", am: "ኢሜይልዎን ያስገቡ" },
  enterPassword: { en: "Enter your password", am: "የይለፍ ቃልዎን ያስገቡ" },
  dontHaveAccount: { en: "Don't have an account?", am: "መለያ የሎትም?" },
  signUp: { en: "Sign up", am: "ተመዝገብ" },
  welcomeBack: { en: "Welcome back", am: "እንኳን በደህና መጡ" },
  pleaseEnterBoth: {
    en: "Please enter both email and password",
    am: "እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ",
  },
  loginError: {
    en: "Login failed. Please try again.",
    am: "ግባት አልተሳካም። እባክዎ ደግሞ ይሞክሩ።",
  },
  loading: { en: "loading please wait", am: "እባኮ ይታገሱ" },
  alreadyHaveAccount: { en: "Already Have Account?", am: "ቀድሞውኑ መለያ አሎት?" },
  creatingAccount: { en: "Create account", am: "በመጫን ላይ" },
  logout: { en: "Logout", am: "ውጣ" },
  confirmLogout: {
    en: "Are you sure you want to logout?",
    am: "እርግጠኛ ነዎት መውጣት ይፈልጋሉ?",
  },
  titleTooShort: { en: "Titlenis too short!", am: "ርዕሱ በጣም አጭር ነዉ" },
  titleMustBeAtLeast5Characters: {},
  cancel: { en: "Cancel", am: "ሰርዝ" },
  dashboard: { en: "Dashboard", am: "ዳሽቦርድ" },
  map: { en: "Map", am: "ካርታ" },
  reports: { en: "Reports", am: "ሪፖርቶች" },
  profile: { en: "Profile", am: "መገለጫ" },
  reportsSubmitted: { en: " Submitted", am: "የቀረቡ ሪፖርቶች" },
  issuesResolved: { en: " Resolved", am: "የተፈቱ ችግሮች" },
  pendingIssues: { en: "Pending ", am: "በጥበቃ ላይ ያሉ ችግሮች" },
  reportIssue: { en: "Report Issue", am: "ችግር ሪፖርት ያድርጉ" },
  viewMap: { en: "View Map", am: "ካርታ ይመልከቱ" },
  myReports: { en: "My Reports", am: "የእኔ ሪፖርቶች" },
  notifications: { en: "Notifications", am: "ማስታወቂያዎች" },
  waterManagement: { en: "Water Management", am: "የውሃ አስተዳደር" },
  overview: { en: "Overview", am: "አጠቃላይ እይታ" },
  quickActions: { en: "Quick Actions", am: "ፈጣን እርምጃዎች" },
  recentActivity: { en: "Recent Activity", am: "የቅርብ ጊዜ እንቅስቃሴ" },
  noRecentActivity: { en: "No recent activity", am: "ምንም የቅርብ ጊዜ እንቅስቃሴ የለም" },
  role: { en: "Role", am: "ሚና" },
  status: { en: "Status", am: "ሁኔታ" },
  verified: { en: "Verified", am: "ተረጋግጥል" },
  pendingVerification: { en: "Pending", am: "በጥበቃ ላይ" },
  phone: { en: "Phone", am: "ስልክ" },
  waterSanitationManagement: {
    en: "Water & Sanitation Complaint Management",
    am: "የውሃ እና የንፅህና ቅሬታ አስተዳደር",
  },
  loginSuccess: { en: "Login Successfully", am: "በሚገባ ገብተዋል" },
  settings: { en: "Settings", am: "ማውጫ" },
  cancell: { en: "Cancel", am: "ዝጋ" },
  emergencyIssue: { en: "Report Emergency", am: "አስቸኳይ ሪፖርት" },
  activityWillAppearHere: {
    en: "Your recent activities will appear here",
    am: "የቅርብ ጊዜ እንቅስቃሴዎችዎ እዚህ ይታያሉ",
  },
  forgotPassword: { en: "Forgot Password", am: "መክፈቻ ቁልፍ ረሳኽው" },
  enterEmailToReset: {
    en: "Enter your email address and we'll send you instructions to reset your password.",
    am: "የኢሜል አድራሻዎን ያስገቡ እና የይለፍ ቃልዎን እንደገና ለማስጀመር መመሪያዎችን እንልክልዎታለን።",
  },
  sendResetLink: { en: "Send Reset Link", am: "የመልስ አገናኝ ይላኩ" },
  resetEmailSent: {
    en: "Reset Email Sent",
    am: "የይለፍ ቃል መልስ ኢሜል ተልኳል",
  },
  resetEmailInstructions: {
    en: "Check your email for instructions to reset your password.",
    am: "የይለፍ ቃልዎን እንደገና ለማስጀመር መመሪያዎችን ለማግኘት ኢሜልዎን ያረጋግጡ።",
  },
  resetEmailError: {
    en: "Error sending reset email. Please try again.",
    am: "የይለፍ ቃል መልስ ኢሜል በመላክ ላይ ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።",
  },
  sending: { en: "Sending", am: "በመላክ ላይ" },
  error: { en: "Error", am: "ስህተት" },
  pleaseEnterEmail: {
    en: "Please Enter Your Email!",
    am: "እባኮ ኢሚል ያስገቡ!",
  },
  permissionRequired: {
    en: "Permission Required",
    am: "ፍቃድ ያስፈልጋል",
  },
  cameraPermission: {
    en: "Camera Permission Required",
    am: "የካሜራ ፍቃድ ያስፈልጋል",
  },
  cameraRollPermission: {
    en: "Photo Library Permission Required",
    am: "የፎቶ ማከማቻ ፍቃድ ያስፈልጋል",
  },
  success: {
    en: "Success",
    am: "ተሳክቷል",
  },
  profileImageUpdated: {
    en: "Profile image updated successfully",
    am: "የመገለጫ ምስል በተሳካ ሁኔታ ተዘምኗል",
  },
  updateFailed: {
    en: "Update failed",
    am: "ማዘመን አልተሳካም",
  },
  selectProfilePhoto: {
    en: "Select Profile Photo",
    am: "የመገለጫ ፎቶ ይምረጡ",
  },
  chooseOption: {
    en: "Choose Option",
    am: "አማራጭ ይምረጡ",
  },
  chooseFromLibrary: {
    en: "Choose from Library",
    am: "ከማከማቻ ይምረጡ",
  },
  takePhoto: {
    en: "Take Photo",
    am: "ፎቶ ይቅረጹ",
  },
  support: {
    en: "Support",
    am: "ድጋፍ",
  },
  edit: {
    en: "Edit",
    am: "አርትዕ",
  },
  enterValue: {
    en: "Enter value",
    am: "እሴት ያስገቡ",
  },
  saving: {
    en: "Saving",
    am: "በማስቀመጥ ላይ",
  },
  save: {
    en: "Save",
    am: "አስቀምጥ",
  },
  profileUpdated: {
    en: "Profile updated successfully",
    am: "መገለጫ በተሳካ ሁኔታ ተዘምኗል",
  },
  fieldCannotBeEmpty: {
    en: "Field cannot be empty",
    am: "መስክ ባዶ ሊሆን አይችልም",
  },
  personalInformation: {
    en: "Personal Information",
    am: "የግል መረጃ",
  },
  myProfile: {
    en: "My Profile",
    am: "የእኔ መገለጫ",
  },
  noName: {
    en: "No name set",
    am: "ስም አልተዘጋጀም",
  },
  cannotEdit: {
    en: "Can't edit",
    am: "ማስተካከል አይቻልም",
  },
  notSet: {
    en: "Not set",
    am: "አልተዘጋጀም",
  },
  phoneNumber: {
    en: "Phone Number",
    am: "ስልክ ቁጥር",
  },
  location: {
    en: "Location",
    am: "አድራሻ",
  },
  customizeExperience: {
    en: "Customize your experience",
    am: "ተሞክሮዎን ያብጁ",
  },
  account: {
    en: "Account",
    am: "መለያ",
  },
  preferences: {
    en: "Preferences",
    am: "ምርጫዎች",
  },
  language: {
    en: "Language",
    am: "ቋንቋ",
  },
  darkMode: {
    en: "Dark Mode",
    am: "ጨለማ ሞድ",
  },
  privacySecurity: {
    en: "Privacy & Security",
    am: "ግላዊነት እና ደህንነት",
  },
  privacyPolicy: {
    en: "Privacy Policy",
    am: "የግላዊነት ፖሊሲ",
  },
  termsOfService: {
    en: "Terms of Service",
    am: "የአገልግሎት ውሎች",
  },
  locationServices: {
    en: "Location Services",
    am: "የአካባቢ አገልግሎቶች",
  },
  helpCenter: {
    en: "Help Center",
    am: "የእርዳታ ማዕከል",
  },
  contactSupport: {
    en: "Contact Support",
    am: "ድጋፍ ያግኙ",
  },
  reportProblem: {
    en: "Report a Problem",
    am: "ችግር ይግለጹ",
  },
  about: {
    en: "About",
    am: "ስለ",
  },
  aboutApp: {
    en: "About App",
    am: "ስለ መተግበሪያው",
  },
  rateApp: {
    en: "Rate App",
    am: "መተግበሪያውን ደረጅ ይግለጹ",
  },
  shareApp: {
    en: "Share App",
    am: "መተግበሪያውን አጋራ",
  },
  logoutConfirm: {
    en: "Are you sure you want to logout?",
    am: "እርግጠኛ ነዎት መውጣት ይፈልጋሉ?",
  },
  thankYou: {
    en: "Thank you for using ShegaReport!",
    am: "ሸጋሪፖርት ስለተጠቀሙ አመሰግናለሁ!",
  },
  waterLeak: { en: "Water Leak", am: "የውሃ ፍሳሽ" },
  noWaterSupply: { en: "No Water Supply", am: "ውሃ አለመገኘት" },
  dirtyWater: { en: "Dirty Water", am: "እርጥበት ውሃ" },
  sanitationIssue: { en: "Sanitation Issue", am: "ንፅህና ችግር" },
  burstPipe: { en: "Burst Pipe", am: "የተቀጠቀጠ ቧንቧ" },
  drainageProblem: { en: "Drainage Problem", am: "የመፍሰሻ ችግር" },
  low: { en: "Low", am: "ዝቅተኛ" },
  medium: { en: "Medium", am: "መካከለኛ" },
  high: { en: "High", am: "ከፍተኛ" },
  emergency: { en: "Emergency", am: "አስቸኳይ" },
  photoAccessRequired: {
    en: "Please allow access to your photos",
    am: "እባክዎ ወደ ፎቶዎች መዳረሻ ይፍቀዱ",
  },
  imageProcessingFailed: {
    en: "Failed to process the selected image",
    am: "የተመረጠውን ምስል ማስተናገድ አልተቻለም",
  },
  imagePickFailed: { en: "Failed to pick image", am: "ምስል ማምረጥ አልተቻለም" },
  photoProcessingFailed: {
    en: "Failed to process the taken photo",
    am: "የተነሳውን ፎቶ ማስተናገድ አልተቻለም",
  },
  back:{en: "Back", am: "ተመለስ"},
  accountCreatedSuccessfully:{en:"Account created succesfully",am:"መለያ በተሳካ ሁኔታ ተፈጠረ"},
  passwordsDoNotMatch:{en: "Password don't match",am:"የይለፍ ቃላት አልተዛመደም"},
  passwordMinLength:{en:"Password min length", am: "የይለፍ ቃል ደቂቃ ርዝመት"},
  pleaseFillAllFields: {en:"Plase Fill All Fields",am:"እባክዎንAllFields ሙላ"},
  takePhotoFailed: { en: "Failed to take photo", am: "ፎቶ ማንሳት አልተቻለም" },
  locationPermissionDenied: {
    en: "Location permission denied",
    am: "የአካባቢ ፍቃድ ተቀባይነት አላገኘም",
  },
  locationFetchFailed: { en: "Failed to get location", am: "አካባቢ ማግኘት አልተቻለም" },
  title: { en: "Title", am: "ርዕስ" },
  description: { en: "Description", am: "መግለጫ" },
  category: { en: "Category", am: "ምድብ" },
  missingInformation: { en: "Missing Information", am: "ጠቃሚ መረጃ ይጠበቃል" },
  pleaseFillFollowing: {
    en: "Please fill the following fields:",
    am: "እባክዎ የሚከተሉትን መስኮች ይሙሉ",
  },
  descriptionTooShort: { en: "Description too short", am: "መግለጫ በጣም አጭር ነው" },
  provideMoreDetails: {
    en: "Please provide more details about the issue.",
    am: "እባክዎ በበለጠ ዝርዝር መግለጫ ይስጡ።",
  },
  locationMissing: { en: "Location Missing", am: "አካባቢ ይጠበቃል" },
  enableLocationServices: {
    en: "Please enable location services before submitting.",
    am: "እባክዎ በሪፖርት ማስገባት በፊት የአካባቢ አገልግሎትን ያብሩ።",
  },
  photoError: { en: "Photo Error", am: "የፎቶ ስህተት" },
  photoProcessingError: {
    en: "The selected photos could not be processed. Please try selecting them again.",
    am: "የተመረጡት ፎቶዎች ሊሰሩ አልቻሉም። እባክዎ እንደገና ይምረጡ።",
  },
  noAccessToken: {
    en: "No access token found. Please login again.",
    am: "የመዳረሻ ማስመሰያ አልተገኘም። እባክዎ ደግመው ይግቡ።",
  },
  reportSubmitted: { en: "Report Submitted", am: "ሪፖርት ቀርቧል" },
  issueReportedSuccessfully: {
    en: "Your issue has been reported successfully!",
    am: "ችግርዎ በተሳካ ሁኔታ ተጠቅሷል!",
  },
  viewMyReports: { en: "View My Reports", am: "ሪፖርቶቼን ይመልከቱ" },
  submitReportFailed: { en: "Failed to submit report", am: "ሪፖርት ለመላክ አልተቻለም" },
  submitReportError: {
    en: "Something went wrong while submitting the report",
    am: "ሪፖርት በማስገባት ላይ ስህተት ተፈጥሯል",
  },
  issueTitle: { en: "Issue Title", am: "የችግሩ ርዕስ" },
  issueTitlePlaceholder: {
    en: "e.g., Water leak in kitchen",
    am: "ለምሳሌ፥ በማዕድን ቤት ውሃ ፍሳሽ",
  },
  descriptionPlaceholder: {
    en: "Describe the issue in detail...",
    am: "ችግሩን በዝርዝር ይግለጹ...",
  },
  locationPlaceholder: {
    en: "e.g., Kebele 03, House #25",
    am: "ለምሳሌ፥ ቀበሌ ፫፣ ቤት ቁጥር ፳፭",
  },
  gpsLocationCaptured: { en: "GPS Location captured", am: "የጂፒኤስ አካባቢ ተቀምጧል" },
  accuracy: { en: "Accuracy", am: "ትክክለኛነት" },
  urgencyLevel: { en: "Urgency Level", am: "የአስቸኳይነት ደረጃ" },
  addPhotos: { en: "Add Photos", am: "ፎቶዎች ያክሉ" },
  chooseFromGallery: { en: "Choose from Gallery", am: "ከፎቶ አልበም ይምረጡ" },
  submitting: { en: "Submitting...", am: "በማስገባት ላይ..." },
  appVersion: {
    en: "App Version",
    am: "የመተግበሪያ ስሪት",
  },
  submitReport: { en: "Submit Report", am: "ሪፖርት ያድርጉ" },
  ok: {
    en: "OK",
    am: "እሺ",
  },
  share: {
    en: "Share",
    am: "አጋራ",
  },
  sharingComingSoon: {
    en: "Sharing feature coming soon!",
    am: "የማጋራት ባህሪ በቅርብ ጊዜ ይመጣል!",
  },
  servingCommunity: {
    en: "Serving Debre Birhan Community",
    am: "ለደብረ ብርሃን ማህበረሰብ አገልግሎት",
  },
  technicianDashboard: { en: "Technician Dashboard", am: "የቴክኒሻን ዳሽቦርድ" },
  taskOverview: { en: "Task Overview", am: "የተግባር አጠቃላይ እይታ" },
  totalTasks: { en: "Total Tasks", am: "ጠቅላላ ተግባራት" },
  assignedTasks: { en: "Assigned Tasks", am: "የተመደቡ ተግባራት" },
  completed: { en: "Completed", am: "ተጠናቀቀ" },
  inProgress: { en: "In Progress", am: "በሂደት ላይ" },
  assigned: { en: "Assigned", am: "ተመድቧል" },
  pending: { en: "Pending", am: "በጥበቃ" },
  viewAll: { en: "View All", am: "ሁሉንም ይመልከቱ" },
  noAssignedTasks: { en: "No assigned tasks", am: "ምንም የተመደበ ተግባር የለም" },
  viewTasks: { en: "View Tasks", am: "ተግባራትን ይመልከቱ" },
  failedToLoadTasks: { en: "Failed to load tasks", am: "ተግባራትን ማምጣት አልተቻለም" },
  cancelled: { en: "Cancelled", am: "ተሰርዟል" },
  highPriority: { en: "High Priority", am: "ከፍተኛ ቅድሚያ" },
  noTasksFound: { en: "No tasks found", am: "ምንም ተግባር አልተገኘም" },
  tryDifferentFilter: {
    en: "Try a different filter or search term",
    am: "የተለየ ማጣሪያ ወይም የፍለጋ ቃል ይሞክሩ",
  },
  searchTasks: { en: "Search tasks...", am: "ተግባራትን ይፈልጉ..." },
  all: { en: "All", am: "ሁሉም" },
  active: { en: "Active", am: "ንቁ" },
  taskStatusUpdated: {
    en: "Task status updated successfully",
    am: "የተግባሩ ሁኔታ በተሳካ ሁኔታ ተዘምኗል",
  },
  invalidEmailFormat: { en: "Invalid Email Format", am: "የ ኢሚል ስህተት" },
  networkError: { en: "Network Error", am: "የ ኒትወርክ ችግር" },
  "technician.dashboard": { en: "Technician Dashboard", am: "የቴክኒሻን ዳሽቦርድ" },
  "technician.assignedTasks": { en: "Assigned Tasks", am: "የተመደቡ ተግባራት" },
  "technician.taskDetails": { en: "Task Details", am: "የተግባር ዝርዝሮች" },
  "technician.profile": { en: "Profile", am: "መገለጫ" },
  viewAllTasks: { en: "View All Tasks", am: "ሁሉንም ተግባራት ይመልከቱ" },
  recentTasks: { en: "Recent Tasks", am: "የቅርብ ጊዜ ተግባራት" },
  startTask: { en: "Start Task", am: "ተግባር ይጀምሩ" },
  markComplete: { en: "Mark Complete", am: "እንደተጠናቀቀ ምልክት ያድርጉ" },
  noTasksDescription: {
    en: "You have no tasks assigned at the moment",
    am: "በአሁኑ ጊዜ ምንም የተመደበ ተግባር የለም",
  },
};

export type TranslationKey = keyof typeof translations;

// Context type
interface LanguageContextProps {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language from SecureStore
  useEffect(() => {
    (async () => {
      try {
        const storedLang = await SecureStore.getItemAsync("language");
        if (storedLang === "en" || storedLang === "am") {
          setLanguage(storedLang);
        }
      } catch (error) {
        console.error("Error loading language:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Change language
  const changeLanguage = async (lang: Language) => {
    setLanguage(lang);
    try {
      await SecureStore.setItemAsync("language", lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  // Translation function
  const t = (key: TranslationKey) => {
    return translations[key]?.[language] || key;
  };

  // Don't render children until language is loaded
  if (isLoading) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use in screens
export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
