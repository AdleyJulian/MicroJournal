import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as queries from "@/db/queries";
import { Text } from "@/components/ui";
import { type JournalEntry, type MediaAttachment } from "@/db/schema/schema";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { CalendarWithAgenda } from "@/components/AgendaView";
import { View } from "react-native";

// Define the type for our joined data structure
type JoinedEntry = {
  journal_cards: {
    id: number;
    due: Date;
    stability: number;
    difficulty: number;
    elapsedDays: number;
    scheduledDays: number;
    reps: number;
    lapses: number;
    state: string;
    promptQuestion: string | null;
    answer: string | null;
    articleJson: any | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    entryDate: Date;
  };
  media_attachments: MediaAttachment | null;
};

type SortOption = "date" | "strength" | "due";
type FilterOptions = {
  difficult: boolean;
  dateRange: [Date | null, Date | null];
  searchTerm: string;
};

export default function ExploreScreen() {
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [filters, setFilters] = useState<FilterOptions>({
    difficult: false,
    dateRange: [null, null],
    searchTerm: "",
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["groupedEntries"],
    queryFn: queries.getAllEntriesGroupedByDate,
  });
  useRefreshOnFocus(refetch);



  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>Loading memories...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-destructive">Error loading memories</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CalendarWithAgenda agendaItems={data} refetch={refetch} />
    </View>
  );
}
