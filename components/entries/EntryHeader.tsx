import React from "react";
import { View } from "react-native";
import { CardHeader, CardTitle, Text } from "@/components/ui";

import { format } from "date-fns";
import { formatDistance } from "date-fns/formatDistance";
import { type JournalEntry } from "@/db/schema/schema";

interface EntryHeaderProps {
  entry: JournalEntry;
  isLoading?: boolean;
}

export function EntryHeader({ entry, isLoading }: EntryHeaderProps) {
  if (isLoading) {
    return (
      <CardHeader>
        <View className="animate-pulse space-y-2">
          <View className="h-4 w-32 bg-muted rounded" />
          <View className="h-6 w-48 bg-muted rounded" />
          <View className="h-4 w-40 bg-muted rounded" />
        </View>
      </CardHeader>
    );
  }

  const entryDate = new Date(entry.entryDate);
  const relativeDate = formatDistance(entryDate, new Date(), {
    addSuffix: true,
  });

  return (
    <CardHeader>
      <View className="flex-row items-center space-x-2 mb-2">
        <Text className="text-sm text-muted-foreground">
          {format(entryDate, "PPPP")}
          {" · "}
          {relativeDate}
        </Text>
      </View>

      <CardTitle className="text-xl">{entry.promptQuestion}</CardTitle>
      {/* <CardContent>
        <Text>{entry.answer}</Text>
      </CardContent> */}
    </CardHeader>
  );
}
