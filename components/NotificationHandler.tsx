import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { getNotificationSettings, scheduleDailyReminder, hasNotificationScheduled } from '@/lib/notifications';

const NotificationHandler: React.FC = () => {
  const isReschedulingRef = useRef(false);

  // Helper function to reschedule the next day's notification on Android
  const rescheduleNextNotification = async () => {
    // Prevent multiple simultaneous rescheduling calls
    if (isReschedulingRef.current) {
      console.log('Rescheduling already in progress, skipping');
      return;
    }

    isReschedulingRef.current = true;
    try {
      const settings = await getNotificationSettings();
      if (settings.enabled) {
        console.log('Rescheduling next notification for time:', settings.reminderTime);

        // Calculate tomorrow's target time
        const [hours, minutes] = settings.reminderTime.split(':').map(Number);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(hours, minutes, 0, 0);

        // Check if we already have a notification scheduled for tomorrow
        const alreadyScheduled = await hasNotificationScheduled(tomorrow);
        if (alreadyScheduled) {
          console.log('Notification already scheduled for tomorrow, skipping reschedule');
          return;
        }

        await scheduleDailyReminder(settings.reminderTime);
        console.log('Successfully rescheduled notification for tomorrow');
      }
    } catch (error) {
      console.error('Error rescheduling notification:', error);
    } finally {
      // Reset the flag
      isReschedulingRef.current = false;
    }
  };

  useEffect(() => {
    // Handle notification when app is in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received in foreground:', notification);

      // On Android, reschedule the next day's notification
      if (Platform.OS === 'android' && notification.request.content.data?.type === 'daily_reminder') {
        // Add a small delay to avoid race conditions
        setTimeout(() => {
          rescheduleNextNotification();
        }, 1000);
      }
    });

    // Handle notification when app is opened from background/killed state
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);

      // Navigate to create/review screen based on notification type
      const data = response.notification.request.content.data;

      if (data?.type === 'daily_reminder') {
        router.push('/(tabs)/create');
      } else {
        // Default to home screen
        router.push('/(tabs)/index');
      }
    });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default NotificationHandler;
