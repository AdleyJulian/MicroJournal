import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Text, Input, Button } from "@/components/ui";
import { Trash2, Plus, Grip } from "@/lib/icons";

// RSS Feed type
type RSSFeed = {
  id: string;
  url: string;
  title: string;
};

const defaultRSSFeeds: RSSFeed[] = [
  {
    id: "0",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    title: "NYT Headlines",
  },
  {
    id: "1",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    title: "NYT World",
  },
];
type NewsFeedManagementPageProps = {
  feeds: RSSFeed[];
  setFeeds: React.Dispatch<React.SetStateAction<RSSFeed[]>>;
};

const NewsFeedManagementPage: React.FC<NewsFeedManagementPageProps> = ({
  feeds = defaultRSSFeeds,
  setFeeds,
}) => {
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedTitle, setNewFeedTitle] = useState("");

  // Load feeds from AsyncStorage on component mount
  useEffect(() => {
    loadFeeds();
  }, []);

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<RSSFeed>) => {
      return (
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
            onPress={() => deleteFeed(item.id)}
            className="p-2 rounded-full bg-red-100 dark:bg-red-900"
          >
            <Trash2 size={20} className="text-red-600 dark:text-red-300" />
          </TouchableOpacity>
        </View>
      );
    },
    []
  );

  // Load feeds from AsyncStorage
  const loadFeeds = async () => {
    try {
      const storedFeeds = await AsyncStorage.getItem("rssFeeds");
      if (storedFeeds) {
        setFeeds(JSON.parse(storedFeeds));
      } else {
        setFeeds(defaultRSSFeeds);
      }
    } catch (error) {
      console.error("Error loading feeds:", error);
      Alert.alert("Error", "Could not load RSS feeds");
    }
  };

  // Save feeds to AsyncStorage
  const saveFeeds = async (updatedFeeds: RSSFeed[]) => {
    setFeeds(updatedFeeds);
    try {
      await AsyncStorage.setItem("rssFeeds", JSON.stringify(updatedFeeds));
      setFeeds(updatedFeeds);
    } catch (error) {
      console.error("Error saving feeds:", error);
      Alert.alert("Error", "Could not save RSS feeds");
    }
  };

  // Add a new feed
  const addFeed = () => {
    // Validate input
    if (!newFeedUrl.trim() || !newFeedTitle.trim()) {
      Alert.alert("Invalid Input", "Please enter both URL and Title");
      return;
    }

    // Check for duplicate URLs
    if (feeds.some((feed) => feed.url === newFeedUrl)) {
      Alert.alert("Duplicate Feed", "This RSS feed URL already exists");
      return;
    }

    const newFeed: RSSFeed = {
      id: Date.now().toString(), // unique identifier
      url: newFeedUrl.trim(),
      title: newFeedTitle.trim(),
    };

    const updatedFeeds = [...feeds, newFeed];
    saveFeeds(updatedFeeds);

    // Clear input fields
    setNewFeedUrl("");
    setNewFeedTitle("");
  };

  // Delete a feed
  const deleteFeed = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this RSS feed?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedFeeds = feeds.filter((feed) => feed.id !== id);
            saveFeeds(updatedFeeds);
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 p-4 bg-white dark:bg-gray-900">
      <Text className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Manage RSS Feeds
      </Text>

      {/* Add New Feed Section */}
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
          onPress={addFeed}
          className="flex-row items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          <Text>Add Feed</Text>
        </Button>
      </View>

      {/* Existing Feeds List */}
      <Text className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
        Current Feeds
      </Text>

      {feeds.length === 0 ? (
        <Text className="text-center text-gray-500 dark:text-gray-400 mt-4">
          No RSS feeds added yet
        </Text>
      ) : (
        <View style={{ flex: 1 }}>
          <DraggableFlatList
            data={feeds}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => saveFeeds(data)}
          />
        </View>
      )}
    </View>
  );
};

export default NewsFeedManagementPage;
