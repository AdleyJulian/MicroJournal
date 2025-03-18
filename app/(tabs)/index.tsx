import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";

import {
  Text,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui";
import { Link } from "expo-router";
import { Brain, Calendar, Settings } from "@/lib/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as queries from "@/db/queries";
import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns/formatDistance";
import { X } from "lucide-react-native";

// TODO: Replace with actual types and data fetching
type Memory = {
  id: string;
  title: string;
  createdAt: string;
};

export default function HomeScreen() {
  const { data: reviewsDue } = useQuery({
    queryKey: ["getDueEntries"],
    queryFn: queries.getDueEntries,
  });

  const { data: memories } = useQuery({
    queryKey: ["getAllEntries"],
    queryFn: queries.getAllEntries,
  });

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

  // TODO: Replace with actual data
  const mockStats = {
    streak: calculateStreak(entryDates),
    reviewsDue: reviewsDue?.length || 0,
    totalMemories: memories?.length || 0,
    memoriesToday: todaysMemories?.length || 0,
  };

  const recentMemories: Memory[] =
    memories?.slice(0, Math.min(memories?.length, 5)).map((memory) => ({
      id: memory.journal_cards.id.toString(),
      title: memory.journal_cards.answer || "",
      createdAt: formatDistance(memory.journal_cards.entryDate, new Date(), {
        addSuffix: true,
      }),
    })) || [];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row justify-between items-center p-4 border-b border-border">
        <Text className="text-2xl font-bold ">Memory Journal</Text>
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
              {mockStats.streak} Day Streak
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
              <Text className="">{mockStats.reviewsDue} memories due</Text>
              <Link asChild href={{ pathname: "/review" }}>
                <Button>
                  <Text>Start Review</Text>
                </Button>
              </Link>
            </View>
          </CardContent>
        </Card>

        {/* Recent Memories */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>
              <Text>Recent Memories</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMemories.map((memory) => (
              <Pressable
                key={memory.id}
                className="flex-row justify-between items-center py-2 border-b border-border last:border-b-0"
                onPress={() => {
                  // TODO: Navigate to memory detail
                }}
              >
                <View>
                  <Text className=" font-medium">{memory.title}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {memory.createdAt}
                  </Text>
                </View>
              </Pressable>
            ))}
          </CardContent>
          <CardFooter>
            <Text className="text-sm text-muted-foreground">
              Total: {mockStats.totalMemories} memories • Today:
              {mockStats.memoriesToday}
            </Text>
          </CardFooter>
          <CardContent>
            <View className="flex-1"></View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
