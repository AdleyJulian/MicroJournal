import React, { useState, useEffect } from "react";
import { ScrollView, View, Switch, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { ImportButton, ExportButton } from "@/components/SettingsComponents";
import { useNotifications } from "@/hooks/useNotifications";
// import { OnboardingManager } from "@/components/OnboardingManager";
import {
  Card,
  CardContent,
  CardHeader,
  Text,
  ThemeToggle,
  CustomHeader,
  TimePicker,
  Button,
} from "@/components/ui";

// Get the app version from expo constants
const APP_VERSION = (Constants.expoConfig as any)?.version || "1.0.0";


// Helper function to format 24-hour time to 12-hour display
const formatTime = (time24: string) => {
  const [hour, minute] = time24.split(':').map(Number);
  const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

const Settings: React.FC = () => {
  const [isDefaultCardsEnabled, setIsDefaultCardsEnabled] = useState(true);
  // const [showOnboarding, setShowOnboarding] = useState(false);
  const {
    isEnabled: isNotificationsEnabled,
    isLoading: isNotificationsLoading,
    toggleNotifications,
    settings,
    updateReminderTimeAndReschedule
  } = useNotifications();

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const value = await AsyncStorage.getItem("defaultCardsSetting");
        if (value !== null) {
          setIsDefaultCardsEnabled(JSON.parse(value));
        }
      } catch (error) {
        console.error("Failed to load default cards setting.", error);
      }
    };
    loadSetting();
  }, []);

  const toggleDefaultCardsSetting = async () => {
    try {
      const newValue = !isDefaultCardsEnabled;
      setIsDefaultCardsEnabled(newValue);
      await AsyncStorage.setItem("defaultCardsSetting", JSON.stringify(newValue));
    } catch (error) {
      console.error("Failed to save default cards setting.", error);
    }
  };

  // const handleStartTutorial = () => {
  //   setShowOnboarding(true);
  // };

  // const handleTutorialComplete = async () => {
  //   setShowOnboarding(false);
  //   try {
  //     await AsyncStorage.setItem("tutorialCompleted", "true");
  //   } catch (error) {
  //     console.error("Failed to save tutorial completion status.", error);
  //   }
  // };

  // const handleTutorialCancel = () => {
  //   setShowOnboarding(false);
  // };

  const handleOpenFAQ = async () => {
    const faqUrl = "https://adleyjulian.github.io/MicroJournal/docs/FAQ.html";
    try {
      const supported = await Linking.canOpenURL(faqUrl);
      if (supported) {
        await Linking.openURL(faqUrl);
      } else {
        console.error("Cannot open FAQ URL");
      }
    } catch (error) {
      console.error("Error opening FAQ:", error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <CustomHeader title="Settings" showBackButton={true} />
      <ScrollView className="flex-1">
        <View className="flex-1">
          {/* Appearance Section */}
          <Card className="m-2">
            <CardHeader>
              <Text className="text-lg font-semibold">Appearance</Text>
            </CardHeader>
            <CardContent>
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-1">Theme</Text>
                  <Text className="text-xs text-muted-foreground">Switch between light and dark mode</Text>
                </View>
                <ThemeToggle />
              </View>
            </CardContent>
          </Card>

          {/* Data Management Section */}
          <Card className="m-2">
            <CardHeader>
              <Text className="text-lg font-semibold">Data Management</Text>
            </CardHeader>
            <CardContent>
              <View className="gap-6">
                <View>
                  <Text className="text-sm font-medium mb-2">Import Data</Text>
                  <Text className="text-xs text-muted-foreground mb-3">Import cards from JSON files or paste JSON text</Text>
                  <ImportButton />
                </View>
                <View>
                  <Text className="text-sm font-medium mb-2">Export Data</Text>
                  <Text className="text-xs text-muted-foreground mb-3">Export your journal entries as JSON or CSV files</Text>
                  <ExportButton />
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Journal Settings Section */}
          <Card className="m-2">
            <CardHeader>
              <Text className="text-lg font-semibold">Journal Settings</Text>
            </CardHeader>
            <CardContent>
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-1">Default Cards</Text>
                  <Text className="text-xs text-muted-foreground">Enable daily 'Day of the Week' card</Text>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isDefaultCardsEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleDefaultCardsSetting}
                  value={isDefaultCardsEnabled}
                />
              </View>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card className="m-2">
            <CardHeader>
              <Text className="text-lg font-semibold">Notifications</Text>
            </CardHeader>
            <CardContent>
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-1">Daily Reminders</Text>
                  <Text className="text-xs text-muted-foreground">Get notified to review your memories</Text>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isNotificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleNotifications}
                  value={isNotificationsEnabled}
                  disabled={isNotificationsLoading}
                />
              </View>

              {isNotificationsEnabled && (
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-1">
                    <Text className="text-sm font-medium mb-1">Reminder Time</Text>
                    <Text className="text-xs text-muted-foreground">When to send daily reminders</Text>
                  </View>
                  <View className="flex-1 max-w-32">
                    <TimePicker
                      value={settings.reminderTime}
                      onValueChange={updateReminderTimeAndReschedule}
                      disabled={isNotificationsLoading}
                      placeholder="Select time"
                    />
                  </View>
                </View>
              )}

              <Text className="text-sm text-muted-foreground">
                {isNotificationsEnabled
                  ? `Daily reminders scheduled for ${formatTime(settings.reminderTime)}`
                  : "No daily reminders will be sent"}
              </Text>
            </CardContent>
          </Card>

          {/* Tutorial Section */}
          {/* <Card className="m-2">
            <CardHeader>
              <Text className="text-lg font-semibold">Getting Started</Text>
            </CardHeader>
            <CardContent>
              <View className="gap-4">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-sm font-medium mb-1">Retake Tutorial</Text>
                    <Text className="text-xs text-muted-foreground">Review how to use Pensieve</Text>
                  </View>
                  <Button onPress={handleStartTutorial} size="sm">
                    <Text className="text-primary-foreground font-medium">Start</Text>
                  </Button>
                </View>
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-sm font-medium mb-1">Help & FAQ</Text>
                    <Text className="text-xs text-muted-foreground">Find answers to common questions</Text>
                  </View>
                  <Button onPress={handleOpenFAQ} size="sm" variant="outline">
                    <Text className="text-primary font-medium">Open FAQ</Text>
                  </Button>
                </View>
              </View>
            </CardContent>
          </Card> */}

          {/* About Section */}
          <Card className="m-2 mt-4">
            <CardContent className="items-center p-2">
              <Text className="text-sm text-muted-foreground">Version {APP_VERSION}</Text>
            </CardContent>
          </Card>
        </View>
      </ScrollView>

      {/* Onboarding Manager */}
      {/* <OnboardingManager
        visible={showOnboarding}
        onComplete={handleTutorialComplete}
        onCancel={handleTutorialCancel}
      /> */}
    </View>
  );
};

export default Settings;
