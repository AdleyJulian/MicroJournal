import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getDueEntriesCount } from '@/db/queries';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: string; // HH:MM format
}

const NOTIFICATION_SETTINGS_KEY = 'notificationSettings';

// Default notification settings
const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  dailyReminder: true,
  reminderTime: '20:00', // 8 PM
};

/**
 * Request notification permissions from the user
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Get current notification settings from storage
 */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const settings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (settings) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(settings) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Save notification settings to storage
 */
export const saveNotificationSettings = async (settings: NotificationSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
};

/**
 * Enable notifications and schedule daily reminder
 */
export const enableNotifications = async (): Promise<boolean> => {
  try {
    // Request permissions first
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return false;
    }

    // Get current settings
    const settings = await getNotificationSettings();

    // Update settings to enable notifications
    const updatedSettings = { ...settings, enabled: true };
    await saveNotificationSettings(updatedSettings);

    // Schedule daily reminder if enabled
    if (updatedSettings.dailyReminder) {
      await scheduleDailyReminder(updatedSettings.reminderTime);
    }

    return true;
  } catch (error) {
    console.error('Error enabling notifications:', error);
    return false;
  }
};

/**
 * Disable notifications and cancel all scheduled notifications
 */
export const disableNotifications = async (): Promise<void> => {
  try {
    // Update settings to disable notifications
    const settings = await getNotificationSettings();
    const updatedSettings = { ...settings, enabled: false };
    await saveNotificationSettings(updatedSettings);

    // Cancel all scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error disabling notifications:', error);
  }
};

/**
 * Check if there's already a notification scheduled for the target time
 */
export const hasNotificationScheduled = async (targetTime: Date): Promise<boolean> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    // Check if any scheduled notification matches our target time (within 5 minutes)
    const targetTimeMs = targetTime.getTime();
    const fiveMinutes = 5 * 60 * 1000;

    return scheduledNotifications.some(notification => {
      if (notification.trigger && 'timestamp' in notification.trigger) {
        const scheduledTime = notification.trigger.timestamp as number;
        return Math.abs(scheduledTime - targetTimeMs) < fiveMinutes;
      }
      return false;
    });
  } catch (error) {
    console.error('Error checking scheduled notifications:', error);
    return false;
  }
};

/**
 * Schedule daily reminder notification
 */
export const scheduleDailyReminder = async (time: string): Promise<void> => {
  try {
    const [hours, minutes] = time.split(':').map(Number);

    // Get the count of due entries for the notification
    const dueCount = await getDueEntriesCount();
    const body = dueCount > 0
      ? `You have ${dueCount} memory${dueCount === 1 ? '' : 'ies'} ready for review today!`
      : "Don't forget to save your d and review your entries!";

    let trigger: Notifications.NotificationTriggerInput;
    let targetTime: Date;

    if (Platform.OS === 'ios') {
      // Use calendar trigger for iOS
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: hours,
        minute: minutes,
        repeats: true,
      };
      // For iOS, we don't need to check existing notifications since calendar trigger handles it
      targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);
    } else {
      // For Android, calculate the next occurrence
      const now = new Date();
      targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);

      // If target time has already passed today, schedule for tomorrow
      if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      // Check if we already have a notification scheduled for this time
      const alreadyScheduled = await hasNotificationScheduled(targetTime);
      if (alreadyScheduled) {
        console.log('Notification already scheduled for this time, skipping');
        return;
      }

      // Calculate seconds until the target time
      const secondsUntilTarget = Math.floor((targetTime.getTime() - now.getTime()) / 1000);

      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilTarget,
      };
    }

    // Cancel existing notifications first (only for Android to avoid conflicts)
    if (Platform.OS === 'android') {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }

    // Schedule notification for the specified time every day
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Journal Reminder',
        body: body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          type: 'daily_reminder',
          dueCount: dueCount,
        },
      },
      trigger: trigger,
    });

    console.log(`Scheduled notification for ${targetTime.toLocaleTimeString()}`);
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
  }
};



/**
 * Update reminder time and reschedule notification
 */
export const updateReminderTime = async (time: string): Promise<void> => {
  try {
    const settings = await getNotificationSettings();
    const updatedSettings = { ...settings, reminderTime: time };
    await saveNotificationSettings(updatedSettings);

    // Reschedule notification with new time if notifications are enabled
    if (updatedSettings.enabled && updatedSettings.dailyReminder) {
      await scheduleDailyReminder(time);
    }
  } catch (error) {
    console.error('Error updating reminder time:', error);
  }
};

/**
 * Check if notifications are enabled and permissions are granted
 */
export const isNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const settings = await getNotificationSettings();
    if (!settings.enabled) {
      return false;
    }

    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification status:', error);
    return false;
  }
};

/**
 * Get the current notification permission status
 */
export const getNotificationPermissionStatus = async (): Promise<'granted' | 'denied' | 'undetermined'> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  } catch (error) {
    console.error('Error getting notification permission status:', error);
    return 'undetermined';
  }
};

/**
 * Debug function to log all scheduled notifications
 */
export const logScheduledNotifications = async (): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', scheduledNotifications.length);
    scheduledNotifications.forEach((notification, index) => {
      console.log(`Notification ${index + 1}:`, {
        id: notification.identifier,
        title: notification.content.title,
        body: notification.content.body,
        trigger: notification.trigger,
        data: notification.content.data,
      });
    });
  } catch (error) {
    console.error('Error logging scheduled notifications:', error);
  }
};

/**
 * Cancel all scheduled notifications (for debugging)
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All scheduled notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};
