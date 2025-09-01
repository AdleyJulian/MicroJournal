import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as queries from "@/db/queries";
import { Text } from "@/components/ui";
import { type JournalEntry, type MediaAttachment } from "@/db/schema/schema";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { CalendarWithAgenda } from "@/components/AgendaView";
import { View, TextInput, Pressable } from "react-native";
import { FAB } from "@/components/ui/FAB";
import { Search } from "@/lib/icons/Search";
import { X } from "@/lib/icons/X";
import { cn } from "@/lib/utils";

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
  const [searchParams, setSearchParams] = useState<queries.EntrySearchParams>({});
  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef<TextInput>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [filters, setFilters] = useState<FilterOptions>({
    difficult: false,
    dateRange: [null, null],
    searchTerm: "",
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["groupedEntries", searchParams],
    queryFn: async () => {
      if (Object.keys(searchParams).length === 0) {
        return queries.getAllEntriesGroupedByDate();
      }
      return queries.getEntriesBySearchGroupedByDate(searchParams);
    },
    placeholderData: (prev) => prev,
  });
  useRefreshOnFocus(refetch);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = keyword.trim();
      if (trimmed.length === 0) {
        setSearchParams({});
      } else {
        setSearchParams({ keyword: trimmed });
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [keyword]);



  if (isLoading && !data) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>Loading memories...</Text>
      </View>
    );
  }

  if ((error && !data) || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-destructive">Error loading memories</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CalendarWithAgenda agendaItems={data} refetch={refetch} />
      <View
        className={cn(
          "absolute left-4 right-4 bottom-4 flex-row items-center gap-3",
          !showSearch && "justify-end"
        )}
      >
        {showSearch ? (
          <View className="flex-1 h-12 flex-row items-center rounded-md border border-input bg-background shadow-sm shadow-black/10 px-3">
            <Search className="text-muted-foreground" size={18} />
            <TextInput
              ref={inputRef}
              value={keyword}
              onChangeText={setKeyword}
              placeholder="Search entries..."
              placeholderTextColor="#9CA3AF"
              className="ml-2 flex-1 h-full text-base text-foreground"
            />
            {keyword.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                onPress={() => {
                  setKeyword("");
                  inputRef.current?.focus();
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className="ml-2 h-6 w-6 items-center justify-center"
              >
                <X className="text-muted-foreground" size={18} />
              </Pressable>
            ) : null}
          </View>
        ) : null}
        <FAB
          inline
          accessibilityLabel="Toggle search"
          testID="fab-search"
          onPress={() => {
            setShowSearch((prev) => {
              const next = !prev;
              if (next) setTimeout(() => inputRef.current?.focus(), 50);
              return next;
            });
          }}
        >
          <Search className="text-primary-foreground" size={24} />
        </FAB>
      </View>
    </View>
  );
}
