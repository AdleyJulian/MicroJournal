import React from "react";
import { View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Text } from "./text";
import { Card, CardContent } from "./card";
import { getCardCountsByDays, getForgottenCardCounts, getReviewSessionCardCount } from "~/db/queries";
import { ChevronRight } from "lucide-react-native";

interface ReviewTimePickerProps {
  onDaysChange: (days: number) => void;
  onForgottenDaysChange: (days: number) => void;
  selectedDays: number;
  selectedForgottenDays: number;
  maxDays?: number;
}

interface TimeOption {
  days: number;
  count: number;
}

export const ReviewTimePicker = ({
  onDaysChange,
  onForgottenDaysChange,
  selectedDays,
  selectedForgottenDays,
  maxDays = 30,
}: ReviewTimePickerProps) => {
  const queryClient = useQueryClient();

  // Query for card counts by days - cached by maxDays
  const { data: cardCounts = [], isLoading: cardCountsLoading } = useQuery({
    queryKey: ["cardCounts", maxDays],
    queryFn: () => getCardCountsByDays(maxDays),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for forgotten card counts - cached by maxDays
  const { data: forgottenCounts = [], isLoading: forgottenCountsLoading } = useQuery({
    queryKey: ["forgottenCounts", maxDays],
    queryFn: () => getForgottenCardCounts(maxDays),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for session count - cached by selected days
  const { data: totalCount = { totalCards: 0, regularCards: 0, forgottenCards: 0 }, isLoading: sessionCountLoading } = useQuery({
    queryKey: ["sessionCount", selectedDays, selectedForgottenDays],
    queryFn: () => getReviewSessionCardCount(selectedDays, selectedForgottenDays),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const isLoading = cardCountsLoading || forgottenCountsLoading || sessionCountLoading;

  const handleDaysSelect = (days: number) => {
    onDaysChange(days);
    // Invalidate the session count query to refetch with new days
    queryClient.invalidateQueries({
      queryKey: ["sessionCount", days, selectedForgottenDays]
    });
  };

  const handleForgottenDaysSelect = (days: number) => {
    onForgottenDaysChange(days);
    // Invalidate the session count query to refetch with new forgotten days
    queryClient.invalidateQueries({
      queryKey: ["sessionCount", selectedDays, days]
    });
  };

  const formatDays = (days: number): string => {
    if (days === 0) return "Today";
    if (days === 1) return "1 day";
    return `${days} days`;
  };

  const getTimeOption = (days: number, counts: TimeOption[], selected: boolean, isLast: boolean) => {
    const count = counts.find(c => c.days === days)?.count || 0;
    return (
      <View key={days} className="flex-row items-center">
        <TouchableOpacity
          onPress={() => counts === cardCounts ? handleDaysSelect(days) : handleForgottenDaysSelect(days)}
          className={`mr-3 min-w-[80px] p-3 rounded-lg border-2 ${
            selected
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/20 bg-background"
          }`}
        >
          <Text className={`text-center font-medium ${selected ? "text-primary" : "text-foreground"}`}>
            {formatDays(days)}
          </Text>
          <Text className="text-center text-sm text-muted-foreground mt-1">
            {count} cards
          </Text>
        </TouchableOpacity>
        {!isLast && (
          <View className="mr-3 opacity-30">
            <ChevronRight size={16} color="#9ca3af" />
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <Text className="text-center">Loading card counts...</Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Card className="mb-4">
        
      <CardContent className="p-4">
        {/* Session Summary */}
        <View className="p-4 bg-secondary/50 rounded-lg">
          <Text className="text-lg font-semibold text-center mb-2">
            Session Summary
          </Text>
          <View className="flex-row justify-between items-center">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">{totalCount.totalCards}</Text>
              <Text className="text-sm text-muted-foreground">Total Cards</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">{totalCount.regularCards}</Text>
              <Text className="text-sm text-muted-foreground">Regular</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-600">{totalCount.forgottenCards}</Text>
              <Text className="text-sm text-muted-foreground">Forgotten</Text>
            </View>
          </View>
        </View>
        </CardContent>
        </Card>
        <Card>
            <CardContent className="p-4">

        {/* Review Ahead Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold">Review Ahead</Text>
            <View className="flex-row items-center opacity-50">
              <Text className="text-xs text-muted-foreground mr-1">Scroll</Text>
              <ChevronRight size={12} color="#9ca3af" />
              <ChevronRight size={12} color="#9ca3af" style={{ marginLeft: -8 }} />
            </View>
          </View>
          <Text className="text-sm text-muted-foreground mb-3">
            Include cards scheduled for review in the next few days
          </Text>
          <View className="relative">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="py-2"
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {cardCounts.map((option, index) =>
                getTimeOption(option.days, cardCounts, option.days === selectedDays, index === cardCounts.length - 1)
              )}
            </ScrollView>
            <View className="absolute right-0 top-0 bottom-0 w-8 bg-gray-50 dark:bg-gray-900 pointer-events-none" style={{ opacity: 0.1 }} />
          </View>
        </View>

        {/* Review Forgotten Cards Section */}
        <View>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold">Review Forgotten Cards</Text>
            <View className="flex-row items-center opacity-50">
              <Text className="text-xs text-muted-foreground mr-1">Scroll</Text>
              <ChevronRight size={12} color="#9ca3af" />
              <ChevronRight size={12} color="#9ca3af" style={{ marginLeft: -8 }} />
            </View>
          </View>
          <Text className="text-sm text-muted-foreground mb-3">
            Include cards forgotten in the last few days
          </Text>
          <View className="relative">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="py-2"
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {forgottenCounts.map((option, index) =>
                getTimeOption(option.days, forgottenCounts, option.days === selectedForgottenDays, index === forgottenCounts.length - 1)
              )}
            </ScrollView>
            <View className="absolute right-0 top-0 bottom-0 w-8 bg-gray-50 dark:bg-gray-900 pointer-events-none" style={{ opacity: 0.1 }} />
          </View>
        </View>
      </CardContent>
    </Card>
    </>
  );
};
