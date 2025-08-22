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

  // Process and sort memories with joined data
  // const processedMemories = useMemo(() => {
  //   if (!joinedEntries) return [];

  //   let filtered = joinedEntries.filter((entry) => {
  //     // Apply difficult filter
  //     if (filters.difficult) {
  //       return (
  //         entry.journal_cards.lapses > 2 || entry.journal_cards.stability < 0.5
  //       );
  //     }
  //     return true;
  //   });

  //   // Apply search filter if there's a search term
  //   if (filters.searchTerm) {
  //     filtered = filtered.filter(
  //       (entry) =>
  //         entry.journal_cards.answer
  //           ?.toLowerCase()
  //           .includes(filters.searchTerm.toLowerCase()) ||
  //         entry.journal_cards.promptQuestion
  //           ?.toLowerCase()
  //           .includes(filters.searchTerm.toLowerCase())
  //     );
  //   }

  //   // Sort entries based on current sort option
  //   return filtered.sort((a, b) => {
  //     switch (sortBy) {
  //       case "date":
  //         return (
  //           new Date(b.journal_cards.entryDate).getTime() -
  //           new Date(a.journal_cards.entryDate).getTime()
  //         );
  //       case "strength":
  //         return b.journal_cards.stability - a.journal_cards.stability;
  //       case "due":
  //         return (
  //           new Date(a.journal_cards.due).getTime() -
  //           new Date(b.journal_cards.due).getTime()
  //         );
  //       default:
  //         return 0;
  //     }
  //   });
  // }, [joinedEntries, sortBy, filters]);

  // Group memories by entry date
  // const groupedMemories = useMemo(() => {
  //   return processedMemories.reduce(
  //     (groups: Record<string, JoinedEntry[]>, entry) => {
  //       const date = new Date(
  //         entry.journal_cards.entryDate
  //       ).toLocaleDateString();
  //       if (!groups[date]) {
  //         groups[date] = [];
  //       }
  //       groups[date].push(entry);
  //       return groups;
  //     },
  //     {}
  //   );
  // }, [processedMemories]);

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
