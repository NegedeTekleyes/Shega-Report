import { useEffect, useState, useRef } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Get token from storage
const getTokenFromStorage = async (): Promise<string | null> => {

  try {
    if (Platform.OS === "web") {
      return localStorage.getItem("token");
    } else {
      return await AsyncStorage.getItem("token");
    }
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const useNotificationPolling = () => {
  const [isLoading, setIsLoading] = useState(true);
  const processedIds = useRef<Set<number>>(new Set());
  const API_BASE_URL = "http://192.168.1.4:3000"

  const markAsRead = async (notificationId: number) => {
    try {
      const token = await getTokenFromStorage(); // Get fresh token here
      if (!token) {
        console.error('No token available for markAsRead');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/notifications/mark-read/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('✅ Marked notification as read:', notificationId);
    } catch (error) {
      console.error('❌ Error marking as read:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const checkForNewNotifications = async () => {
      try {
        const token = await getTokenFromStorage();
        if (!token || !isMounted) return;

        const response = await fetch(`${API_BASE_URL}/notifications/my-notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const notifications = await response.json();
          
          const newNotifications = notifications.filter((notification: any) => 
            notification.status === 'unread' && 
            !processedIds.current.has(notification.id)
          );

          if (newNotifications.length > 0) {
            const latestNotification = newNotifications[0];
            processedIds.current.add(latestNotification.id);
            
            Toast.show({
              type: 'success',
              text1: latestNotification.title || 'New Notification',
              text2: latestNotification.message,
              visibilityTime: 6000,
              autoHide: true,
              topOffset: 60,
              onPress: () => {
                markAsRead(latestNotification.id); // ✅ No token parameter
              }
            });

            setTimeout(() => {
              markAsRead(latestNotification.id); // ✅ No token parameter
            }, 3000);
          }
        }
      } catch (error) {
        console.error('❌ Error checking notifications:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkForNewNotifications();
    intervalId = setInterval(checkForNewNotifications, 15000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return { isLoading };
};