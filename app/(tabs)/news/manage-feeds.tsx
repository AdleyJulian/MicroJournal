import React, { useState, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Text, Input, Button } from "@/components/ui";
import { Trash2, Plus, Grip } from "@/lib/icons";

import type { RSSFeed } from "@/hooks/useRSSFeed";
import { useRSSFeedConfig } from "@/contexts/RSSFeedConfigContext"; // Import from context file

const NewsFeedManagementPage = () => {
  const { feedSources, addFeedSource, deleteFeedSource, saveFeedSources } =
    useRSSFeedConfig();
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedTitle, setNewFeedTitle] = useState("");

  const handleAddFeed = () => {
    if (addFeedSource(newFeedUrl, newFeedTitle)) {
      setNewFeedUrl("");
      setNewFeedTitle("");
    }
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<RSSFeed>) => (
      <View
        className={`flex-row items-center justify-between p-3 rounded-lg mb-2 ${
          isActive
            ? "bg-gray-200 dark:bg-gray-700"
            : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        <TouchableOpacity
          onLongPress={drag}
          className="flex-row flex-1 items-center"
        >
          <Grip size={20} className="mr-3 text-gray-500 dark:text-gray-400" />
          <View className="flex-1 pr-4">
            <Text className="font-semibold text-gray-800 dark:text-white">
              {item.title}
            </Text>
            <Text
              className="text-xs text-gray-500 dark:text-gray-400"
              numberOfLines={1}
            >
              {item.url}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteFeedSource(item.id)}
          className="p-2 rounded-full bg-red-100 dark:bg-red-900"
        >
          <Trash2 size={20} className="text-red-600 dark:text-red-300" />
        </TouchableOpacity>
      </View>
    ),
    [deleteFeedSource]
  );

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Manage RSS Feeds</Text>

      <View className="mb-4 space-y-2">
        <Input
          value={newFeedTitle}
          onChangeText={setNewFeedTitle}
          placeholder="Feed Title (e.g., NYT Headlines)"
          className="mb-2"
        />
        <Input
          value={newFeedUrl}
          onChangeText={setNewFeedUrl}
          placeholder="RSS Feed URL"
          className="mb-2"
        />
        <Button
          onPress={handleAddFeed}
          className="flex-row items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          <Text>Add Feed</Text>
        </Button>
      </View>

      <Text className="text-lg font-semibold mb-2">Current Feeds</Text>

      {feedSources.length === 0 ? (
        <Text className="text-center mt-4">No RSS feeds added yet</Text>
      ) : (
        <View style={{ flex: 1 }}>
          <DraggableFlatList
            data={feedSources}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => saveFeedSources(data)}
          />
        </View>
      )}
    </View>
  );
};

export default NewsFeedManagementPage;
