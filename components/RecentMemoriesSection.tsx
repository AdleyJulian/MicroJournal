import React from "react";
import { View } from "react-native";
import { formatDistance } from "date-fns/formatDistance";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, Text } from "./ui";
import { RecentMemoryItem } from "./RecentMemoryItem";

interface RecentMemoriesSectionProps {
  memories: any;
  totalMemories: number;
  memoriesToday: number;
}

export function RecentMemoriesSection({
  memories,
  totalMemories,
  memoriesToday,
}: RecentMemoriesSectionProps) {
  // Transform memories into the format expected by RecentMemoryItem
  const recentMemories = memories?.slice(0, Math.min(memories?.length, 5)).map((memory) => ({
    id: memory.journal_cards.id.toString(),
    title: memory.journal_cards.answer || "",
    createdAt: formatDistance(memory.journal_cards.entryDate, new Date(), {
      addSuffix: true,
    }),
    mediaAttachment: memory.media_attachments ? {
      mediaPath: memory.media_attachments.mediaPath,
      mediaSourceType: memory.media_attachments.mediaSourceType,
      type: memory.media_attachments.type,
    } : null,
  })) || [];

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <Text>Recent Memories</Text>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentMemories.length > 0 ? (
          recentMemories.map((memory) => (
            <RecentMemoryItem
              key={memory.id}
              id={memory.id}
              title={memory.title}
              createdAt={memory.createdAt}
              mediaAttachment={memory.mediaAttachment}
            />
          ))
        ) : (
          <View className="py-8 items-center">
            <Text className="text-muted-foreground text-center">
              No memories yet. Create your first memory to get started!
            </Text>
          </View>
        )}
      </CardContent>
      <CardFooter>
        <Text className="text-sm text-muted-foreground">
          Total: {totalMemories} memories • Today: {memoriesToday}
        </Text>
      </CardFooter>
    </Card>
  );
}
