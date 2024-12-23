import React, { useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import {
  Text,
  Button,
  Card,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/";

import { SafeAreaView } from "react-native-safe-area-context";
// import { Article } from "@/components/Article";
import { NewsFeed } from "@/components/NewsFeed";

import { articles } from "~/api/articles";
import Animated, { LinearTransition } from "react-native-reanimated";

interface HomeScreenProps {
  onNewJournalEntry: () => void;
  onReviewMemories: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNewJournalEntry,
  onReviewMemories,
}) => {
  const [dailyStreak, setDailyStreak] = useState(3);
  // const [totalEntries, setTotalEntries] = useState(15);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 m-2">
      {/* <ScrollView> */}
      {/* Header */}
      <View className="mb-6">
        {/* <Text className="text-3xl font-bold text-gray-800 dark:text-white">
          Memory Journal
        </Text> */}
        <Text className="text-3xl font-bold text-center">
          {new Date().toLocaleDateString("en-US", { dateStyle: "full" })}
        </Text>
      </View>
      <NewsFeed />

      {/* Quick Stats Card */}
      <Card className="mb-6 p-4 bg-blue-50 dark:bg-blue-900">
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Daily Streak
            </Text>
            <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {dailyStreak} days
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Total Entries
            </Text>
            <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
              {0}
            </Text>
          </View>
        </View>
      </Card>

      {/* Action Buttons */}
      <View className="space-y-4">
        <Button
          variant="default"
          onPress={onNewJournalEntry}
          className="py-4 rounded-lg"
        >
          <Text className="text-white font-semibold text-lg">
            New Journal Entry
          </Text>
        </Button>

        <Button
          variant="secondary"
          onPress={onReviewMemories}
          className="py-4 rounded-lg border border-gray-300 mt-4"
        >
          <Text className="text-gray-800 dark:text-white font-semibold text-lg">
            Review Memories
          </Text>
        </Button>
      </View>

      {/* Recent Entries Preview (Optional) */}
      <View className="mt-6">
        <Text className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Recent Memories
        </Text>
        {/* Add recent entries list or placeholder */}new
        <Card className="p-4">
          <Text className="text-gray-600 dark:text-gray-400">
            No recent entries. Start journaling today!
          </Text>
        </Card>
      </View>

      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default HomeScreen;
