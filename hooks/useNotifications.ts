import { useNotificationPolling } from './useNotificationPolling';

// This hook now only uses polling - no WebSocket involved
export const useNotifications = () => {
  const { isLoading } = useNotificationPolling();
  
  // No need to return anything - toasts are shown automatically
  return { isLoading };
};