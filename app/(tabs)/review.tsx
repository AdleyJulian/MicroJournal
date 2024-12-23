import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { updateEntrywithReview } from "~/db/mutations";
import { getDueEntries } from "~/db/queries";
import { ReviewGrade } from "~/db/fsrs";
import { Button, Card, Text } from "~/components/ui/";
import { JournalEntry } from "@/db/schema/schema";
import { format } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";

const ReviewScreen = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setIsLoading(true);
      const dueEntries = await getDueEntries();
      if (dueEntries) {
        setEntries(dueEntries);
      }
    } catch (error) {
      console.error("Failed to load entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrade = async (grade: ReviewGrade) => {
    try {
      const currentEntry = entries[currentIndex];
      console.log("currentEntry", currentEntry);
      console.log("grade", grade);
      await updateEntrywithReview(currentEntry, grade);

      if (currentIndex < entries.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Finished all reviews
        await loadEntries(); // Reload in case there are new due entries
        setCurrentIndex(0);
        setShowAnswer(false);
      }
    } catch (error) {
      console.error("Failed to update entry:", error);
    }
  };

  const ProgressBar = ({
    current,
    total,
  }: {
    current: number;
    total: number;
  }) => (
    <View className="px-4 py-2">
      <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-blue-500 rounded-full"
          style={{
            width: `${(current / total) * 100}%`,
          }}
        />
      </View>
      <Text className="text-center text-gray-600 mt-1">
        {current} of {total} entries reviewed
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Loading entries...</Text>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-xl text-center mb-4">
          No entries due for review!
        </Text>
        <Text className="text-base text-center text-gray-600">
          Come back later when you have memories to review
        </Text>
        <Button onPress={loadEntries} className="mt-4">
          <Text>Refresh</Text>
        </Button>
      </View>
    );
  }

  const currentEntry = entries[currentIndex];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 m-2">
      <View className="flex-1">
        {/* Progress bar */}
        <ProgressBar current={currentIndex} total={entries.length} />

        {/* Entry date and stats */}
        <View className="px-4 py-2 border-b border-gray-200">
          <Text className="text-center text-2xl font-medium">
            {currentEntry?.createdAt
              ? format(new Date(currentEntry.createdAt), "MMMM d, yyyy")
              : "Date not available"}
          </Text>
          <View className="flex-row justify-around space-x-4 mt-1">
            <Text className="text-sm">Reviews: {currentEntry.reps}</Text>
            <Text className="text-sm">Lapses: {currentEntry.lapses}</Text>
          </View>
        </View>

        {/* Question/Answer area */}
        <ScrollView className="flex-1 p-4">
          <Card className="p-2 m-2">
            <Text className="text-xl mb-8">{currentEntry.promptQuestion}</Text>

            {!showAnswer ? (
              <Button onPress={() => setShowAnswer(true)} className="mt-4">
                <Text>Show Answer</Text>
              </Button>
            ) : (
              <View className="p-4 rounded-lg">
                <Text className="text-lg">{currentEntry.answer}</Text>
              </View>
            )}
          </Card>
        </ScrollView>

        {/* Review buttons */}
        {showAnswer && (
          <View className="p-4">
            <View className="flex-row space-x-4">
              <Button
                onPress={() => handleGrade(ReviewGrade.Again)}
                className="flex-1 bg-red-500 m-2"
              >
                <Text className="text-white">Again</Text>
              </Button>
              <Button
                onPress={() => handleGrade(ReviewGrade.Hard)}
                className="flex-1 bg-orange-500 m-2"
              >
                <Text className="text-white">Hard</Text>
              </Button>
              <Button
                onPress={() => handleGrade(ReviewGrade.Good)}
                className="flex-1 bg-green-500 m-2"
              >
                <Text className="text-white">Good</Text>
              </Button>
              <Button
                onPress={() => handleGrade(ReviewGrade.Easy)}
                className="flex-1 bg-blue-500 m-2"
              >
                <Text className="text-white">Easy</Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ReviewScreen;
