import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { updateEntrywithReview } from "~/db/mutations";
import { getDueEntries } from "~/db/queries";
import { Button, Card, CardHeader, Text } from "~/components/ui/";
import { format } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPreview } from "~/db/fsrs";
import { Grade } from "ts-fsrs";
import { RatingButtons, Menu, StateCount } from "@/components/review";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

const ReviewScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["dueEntries"],
    queryFn: getDueEntries,
    refetchOnWindowFocus: true,
  });
  useRefreshOnFocus(refetch);

  const entries = data || [];
  const statesCount = {
    New: entries.filter((entry) => entry.state === "0").length,
    Learning: entries.filter((entry) => entry.state === "1").length,
    Review: entries.filter((entry) => entry.state === "2").length,
    Relearning: entries.filter((entry) => entry.state === "3").length,
  };

  const stateOrder: Record<string, number> = {
    "1": 1, // Learning
    "3": 2, // Relearning
    "0": 3, // New
    "2": 4, // Review
  };

  const orderedEntries = entries.sort((a, b) => {
    return (stateOrder[a.state] ?? 5) - (stateOrder[b.state] ?? 5);
  });

  const { mutateAsync: submitReview } = useMutation({
    mutationFn: updateEntrywithReview,
    onSuccess: (result) => {
      console.log(JSON.stringify(result));
    },
  });

  const handleGrade = async (grade: Grade) => {
    try {
      const currentEntry = entries[currentIndex];
      await submitReview({ entry: currentEntry, grade: grade });
      setShowAnswer(false);
      refetch();
    } catch (error) {
      console.error("Failed to update entry:", error);
    }
  };

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
        <Button onPress={() => refetch()} className="mt-4">
          <Text>Refresh</Text>
        </Button>
      </View>
    );
  }

  const currentEntry = orderedEntries[currentIndex];
  const preview = getPreview(currentEntry);

  return (
    <SafeAreaView className="flex-1 m-2">
      <View className="flex-1">
        {/* <ProgressBar current={currentIndex} total={orderedEntries.length} /> */}
        <StateCount statesCount={statesCount} />
        <Button onPress={() => refetch()} className="mt-4">
          <Text>Refresh</Text>
        </Button>
        <Button>
          <Text> Log Current Card Data</Text>
        </Button>
        {/* Entry date and stats */}
        <View className="px-4 py-2 border-b ">
          <View className="flex-row items-center justify-between">
            <Text className="text-center flex-grow text-2xl font-medium  ml-12">
              {currentEntry?.entryDate
                ? format(new Date(currentEntry.entryDate), "MMMM d, yyyy")
                : "Date not available"}
            </Text>
            <Menu entryId={currentEntry.id.toString()} />
          </View>

          <View className="flex-row justify-around space-x-4 mt-1">
            <Text className="text-sm">Reviews: {currentEntry.reps}</Text>
            <Text className="text-sm">Lapses: {currentEntry.lapses}</Text>
          </View>
        </View>

        {/* Question/Answer area */}
        <ScrollView className="flex-1 p-4">
          <Card className="p-2 m-2">
            <CardHeader>
              <Text className="text-xl mb-8">
                {currentEntry.promptQuestion}
              </Text>
            </CardHeader>

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
          <RatingButtons handleGrade={handleGrade} preview={preview} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ReviewScreen;
