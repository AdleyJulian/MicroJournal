import React from "react";
import { View } from "react-native";
import { CardContent, Text } from "@/components/ui";
import { Tag } from "@/lib/icons";
import { type JournalEntry } from "@/db/schema/schema";

interface EntryContentProps {
  entry: JournalEntry;
  isLoading?: boolean;
}

export function EntryContent({ entry, isLoading }: EntryContentProps) {
  if (isLoading) {
    return (
      <CardContent>
        <View className="animate-pulse space-y-2">
          <View className="h-4 w-full bg-muted rounded mb-2" />
          <View className="h-4 w-3/4 bg-muted rounded" />
          <View className="h-4 w-1/2 bg-muted rounded" />
        </View>
      </CardContent>
    );
  }

  const hasArticleData =
    entry.articleJson && typeof entry.articleJson === "object";

  return (
    <CardContent>
      <Text className="text-lg mb-4 text-foreground">{entry.answer}</Text>
    </CardContent>
  );
}
