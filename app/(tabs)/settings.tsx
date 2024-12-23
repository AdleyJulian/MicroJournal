import { ThemeToggle } from "@/components/ui/ThemeToggle";
import React, { useState } from "react";
import { View, Text, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsScreenProps {
  // Add any necessary props
}

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  // Settings state
  const [isSpacedRepetitionEnabled, setIsSpacedRepetitionEnabled] =
    useState(true);
  const [isGratitudeJournalEnabled, setIsGratitudeJournalEnabled] =
    useState(false);
  const [isNewsHeadlinesEnabled, setIsNewsHeadlinesEnabled] = useState(true);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="px-4 py-6">
        <Text className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          App Settings
        </Text>

        {/* Spaced Repetition Settings */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg text-gray-700 dark:text-gray-300">
            Spaced Repetition
          </Text>
          <Switch
            value={isSpacedRepetitionEnabled}
            onValueChange={setIsSpacedRepetitionEnabled}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isSpacedRepetitionEnabled ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        {/* Gratitude Journal Settings */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg text-gray-700 dark:text-gray-300">
            Gratitude Journal
          </Text>
          <Switch
            value={isGratitudeJournalEnabled}
            onValueChange={setIsGratitudeJournalEnabled}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isGratitudeJournalEnabled ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        {/* News Headlines Settings */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg text-gray-700 dark:text-gray-300">
            Include News Headlines
          </Text>
          <Switch
            value={isNewsHeadlinesEnabled}
            onValueChange={setIsNewsHeadlinesEnabled}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isNewsHeadlinesEnabled ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg text-gray-700 dark:text-gray-300">
            Dark Mode
          </Text>
          <ThemeToggle />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
