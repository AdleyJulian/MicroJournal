import { useState, useEffect } from 'react';
import {
  enableNotifications,
  disableNotifications,
  getNotificationSettings,
  isNotificationsEnabled,
  updateReminderTime,
  scheduleDailyReminder,
  NotificationSettings,
} from '@/lib/notifications';

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    dailyReminder: true,
    reminderTime: '20:00',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await getNotificationSettings();
        setSettings(storedSettings);
        const enabled = await isNotificationsEnabled();
        setIsEnabled(enabled);
      } catch (error) {
        console.error('Error loading notification settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Toggle notifications on/off
  const toggleNotifications = async () => {
    try {
      if (isEnabled) {
        await disableNotifications();
        setIsEnabled(false);
        setSettings(prev => ({ ...prev, enabled: false }));
      } else {
        const success = await enableNotifications();
        if (success) {
          setIsEnabled(true);
          setSettings(prev => ({ ...prev, enabled: true }));
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  // Update reminder time
  const setReminderTime = async (time: string) => {
    try {
      await updateReminderTime(time);
      setSettings(prev => ({ ...prev, reminderTime: time }));
    } catch (error) {
      console.error('Error updating reminder time:', error);
    }
  };

  // Update reminder time and reschedule if enabled
  const updateReminderTimeAndReschedule = async (time: string) => {
    try {
      if (isEnabled) {
        await scheduleDailyReminder(time);
      }
      const updatedSettings = { ...settings, reminderTime: time };
      setSettings(updatedSettings);
      // Save to AsyncStorage
      const { saveNotificationSettings } = await import('@/lib/notifications');
      await saveNotificationSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating reminder time and rescheduling:', error);
    }
  };

  return {
    settings,
    isEnabled,
    isLoading,
    toggleNotifications,
    setReminderTime,
    updateReminderTimeAndReschedule,
  };
};
