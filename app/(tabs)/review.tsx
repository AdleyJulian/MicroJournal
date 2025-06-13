import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { updateEntrywithReview } from "~/db/mutations";
import { getDueEntries } from "~/db/queries";
import { Button, Card, CardHeader, Text } from "~/components/ui/";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPreview } from "~/db/fsrs";
import { Grade } from "ts-fsrs";
import { RatingButtons, Menu, StateCount } from "@/components/review";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { formatInTimeZone } from "date-fns-tz";

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
    New: entries.filter((entry) => entry.state === "0" || entry.state === "new")
      .length,
    Learning: entries.filter(
      (entry) => entry.state === "1" || entry.state === "learning"
    ).length,
    Review: entries.filter(
      (entry) => entry.state === "2" || entry.state === "review"
    ).length,
    Relearning: entries.filter(
      (entry) => entry.state === "3" || entry.state === "relearning"
    ).length,
  };

  const orderedEntries = entries.sort((a, b) => {
    return new Date(a.due).getTime() - new Date(b.due).getTime();
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
        {/* Entry date and stats */}
        <View className="px-4 py-2 border-b ">
          <View className="flex-row items-center justify-between">
            <Text className="text-center flex-grow text-2xl font-medium  ml-12">
              {currentEntry?.entryDate
                ? formatInTimeZone(
                    currentEntry.entryDate,
                    "UTC",
                    "MMMM d, yyyy"
                  )
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
