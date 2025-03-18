import React, { useEffect } from "react";
import { FlatList, View } from "react-native";
import { useState } from "react";
import { getAllEntries } from "@/db/queries";
import { JournalEntry } from "@/db/schema/schema";
import { Trash2 } from "@/lib/icons";

import { Text, Card } from "@/components/ui";
import { deleteEntry } from "@/db/mutations";

export const AllEntries: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleDelete = async (id: number) => {
    try {
      await deleteEntry(id);
      refetchEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const refetchEntries = async () => {
    try {
      setIsLoading(true);
      const allEntries = await getAllEntries();
      // setEntries(allEntries);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  useEffect(() => {
    refetchEntries();
  }, []);

  return (
    <FlatList
      data={entries}
      refreshing={isLoading}
      onRefresh={refetchEntries}
      renderItem={({ item }) => (
        <Card className="p-2 m-2">
          <View key={item.id} className="p-4 rounded-lg mb-4">
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
        <Text className="text-lg font-semibold">Loading entries...</Text>
      )}
    />
  );
};
