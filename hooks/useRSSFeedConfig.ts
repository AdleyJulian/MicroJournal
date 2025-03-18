import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export type RSSFeed = {
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

export const useRSSFeedConfig = () => {
  const [feedSources, setFeedSources] = useState<RSSFeed[]>(defaultRSSFeeds);

  useEffect(() => {
    loadFeedSources();
  }, []);

  const loadFeedSources = async () => {
    try {
      const stored = await AsyncStorage.getItem("rssFeeds");
      setFeedSources(stored ? JSON.parse(stored) : defaultRSSFeeds);
    } catch (error) {
      console.error("Error loading feed sources:", error);
      Alert.alert("Error", "Could not load RSS feed sources");
    }
  };

  const saveFeedSources = async (updated: RSSFeed[]) => {
    try {
      await AsyncStorage.setItem("rssFeeds", JSON.stringify(updated));
      setFeedSources(updated);
    } catch (error) {
      console.error("Error saving feed sources:", error);
      Alert.alert("Error", "Could not save RSS feed sources");
    }
  };

  const addFeedSource = (url: string, title: string) => {
    if (!url.trim() || !title.trim()) {
      Alert.alert("Invalid Input", "Please enter both URL and Title");
      return false;
    }

    if (feedSources.some((feed) => feed.url === url)) {
      Alert.alert("Duplicate Feed", "This RSS feed URL already exists");
      return false;
    }

    saveFeedSources([
      ...feedSources,
      {
        id: Date.now().toString(),
        url: url.trim(),
        title: title.trim(),
      },
    ]);
    return true;
  };

  const deleteFeedSource = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this RSS feed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            saveFeedSources(feedSources.filter((feed) => feed.id !== id)),
        },
      ]
    );
  };

  return {
    feedSources,
    addFeedSource,
    deleteFeedSource,
    saveFeedSources,
  };
};
