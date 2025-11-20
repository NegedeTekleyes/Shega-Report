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

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const checkForNewNotifications = async () => {
      try {
        const token = await getTokenFromStorage();
        if (!token || !isMounted) return;

        // console.log('🔍 Checking for new notifications...');
        
        const response = await fetch('http://10.18.52.47:3000/notifications/my-notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const notifications = await response.json();
          
          // Find unread notifications we haven't shown yet
          const newNotifications = notifications.filter((notification: any) => 
            notification.status === 'unread' && 
            !processedIds.current.has(notification.id)
          );

          // Show the most recent new notification
          if (newNotifications.length > 0) {
            const latestNotification = newNotifications[0];
            processedIds.current.add(latestNotification.id);
            
            console.log('🎯 New notification found:', latestNotification.title);
            
            // Show toast notification
            Toast.show({
              type: 'success',
              text1: latestNotification.title || 'New Notification',
              text2: latestNotification.message,
              visibilityTime: 6000,
              autoHide: true,
              topOffset: 60,
              onPress: () => {
                console.log('📱 Notification pressed, marking as read');
                markAsRead(latestNotification.id, token);
              }
            });

            // Auto-mark as read after 2 seconds (optional)
            setTimeout(() => {
              markAsRead(latestNotification.id, token);
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

    // Start polling - check every 15 seconds
    checkForNewNotifications(); // Check immediately
    intervalId = setInterval(checkForNewNotifications, 15000); // Then every 15 seconds

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const markAsRead = async (notificationId: number, token: string) => {
    try {
      await fetch(`http://10.18.52.47:3000/notifications/mark-read/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('✅ Marked notification as read:', notificationId);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return { isLoading };
};