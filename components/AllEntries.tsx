import React from "react";
import { FlatList, View } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllEntries } from "@/db/queries";
import { JournalEntry } from "@/db/schema/schema";
import { Trash2 } from "@/lib/icons";

import { Text, Card } from "@/components/ui";
import { deleteEntry } from "@/db/mutations";

export const AllEntries: React.FC = () => {
  const queryClient = useQueryClient();

  // Query for fetching all entries
  const { data: entries = [], isLoading, refetch, isError, error } = useQuery({
    queryKey: ["allEntries"],
    queryFn: getAllEntries,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Mutation for deleting entries
  const deleteMutation = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      // Invalidate and refetch the entries query
      queryClient.invalidateQueries({ queryKey: ["allEntries"] });
    },
    onError: (error) => {
      console.error("Error deleting entry:", error);
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg text-red-600 mb-2">Error loading entries</Text>
        <Text className="text-sm text-gray-600 mb-4">
          {error instanceof Error ? error.message : "Something went wrong"}
        </Text>
        <Text className="text-blue-600" onPress={() => refetch()}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={entries}
      refreshing={isLoading}
      onRefresh={refetch}
      renderItem={({ item }) => (
        <Card className="p-2 m-2">
          <View className="p-4 rounded-lg mb-4">
            <Text className="text-lg font-semibold">{item.promptQuestion}</Text>
            <Text className="text-sm">{item.answer}</Text>

            <View className="flex-row justify-end">
              <Trash2
                className="w-6 h-6"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        </Card>
      )}
      ListEmptyComponent={() => (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-lg text-gray-500 mb-2">No entries found</Text>
          <Text className="text-sm text-gray-400">
            {isLoading ? "Loading entries..." : "Create your first journal entry!"}
          </Text>
        </View>
      )}
    />
  );
};
