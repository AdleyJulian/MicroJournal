import { View, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { createDailyDayOfWeekEntry } from "@/db/mutations";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Text,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Link } from "expo-router";
import { Brain, Calendar, Settings } from "@/lib/icons";
import { RecentMemoriesSection } from "@/components/RecentMemoriesSection";

import * as queries from "@/db/queries";
import { useQuery } from "@tanstack/react-query";



export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    createDailyDayOfWeekEntry();
    console.log('HomeScreen insets:', insets);
  }, [insets]); // Empty dependency array ensures this runs once on mount

  const { data: reviewsDue, refetch: refetchReviewsDue } = useQuery({
    queryKey: ["getDueEntries"],
    queryFn: queries.getDueEntries,
  });

  const { data: memories, refetch: refetchAllEntries } = useQuery({
    queryKey: ["getAllEntries"],
    queryFn: queries.getAllEntries,
  });

  useRefreshOnFocus(refetchReviewsDue);
  useRefreshOnFocus(refetchAllEntries);

  const todaysMemories = memories?.filter((memory) => {
    const entryDate = new Date(memory.journal_cards.entryDate);
    const today = new Date();
    return (
      entryDate.getDate() === today.getDate() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear()
    );
  });

  const entryDates = [
    ...new Set(
      memories?.map((memory) => new Date(memory.journal_cards.entryDate)) || []
    ),
  ];

  function calculateStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    // Convert all inputs to Date objects and sort in descending order
    //Technically it should already be sorted.
    const sortedDates = dates
      .map((d) => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    // Remove duplicates by converting to date strings (YYYY-MM-DD format)
    const uniqueDates = [
      ...new Set(sortedDates.map((date) => date.toISOString().split("T")[0])),
    ].map((dateStr) => new Date(dateStr));

    let streak = 1;
    const msInDay = 24 * 60 * 60 * 1000;

    // Start from the most recent date
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const currentDate = uniqueDates[i];
      const nextDate = uniqueDates[i + 1];

      // Calculate the difference in days
      const diffDays = (currentDate.getTime() - nextDate.getTime()) / msInDay;

      // If the difference is 1 day, continue the streak
      if (Math.round(diffDays) === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  const reviewStats = {
    streak: calculateStreak(entryDates),
    reviewsDue: reviewsDue?.length || 0,
    totalMemories: memories?.length || 0,
    memoriesToday: todaysMemories?.length || 0,
  };



  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-between items-center px-4 border-b border-border">
        <Text className="text-2xl font-bold ">Pensieve</Text>
        <View className="flex-row">
          <Link asChild href={"/settings"}>
            <Button variant={"ghost"}>
              <Settings className="w-6 h-6 text-foreground" />
            </Button>
          </Link>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Streak and Stats */}
        <View className="flex-row justify-between items-center mb-6 p-4 bg-card rounded-lg border border-border">
          <View className="flex-row items-center">
            <Calendar className="w-6 h-6 text-primary mr-2" />
            <Text className="text-lg font-semibold ">
              {reviewStats.streak} Day Streak
            </Text>
          </View>
          <Brain className="w-6 h-6 text-primary" />
        </View>

        {/* Review Queue Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>
              <Text>Review Queue</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row justify-between items-center">
              <Text className="">{reviewStats.reviewsDue} memories due</Text>
              <Link asChild href={{ pathname: "/review" }}>
                <Button>
                  <Text>Start Review</Text>
                </Button>
              </Link>
            </View>
          </CardContent>
        </Card>

        {/* Recent Memories */}
        <RecentMemoriesSection
          memories={memories as any}
          totalMemories={reviewStats.totalMemories}
          memoriesToday={reviewStats.memoriesToday}
        />
      </ScrollView>
    </View>
  );
}
