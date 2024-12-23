import React, { useEffect, useState } from "react";
import { Articles, type RSSItem } from "./Articles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Button } from "@/components/ui";
import { View, TouchableOpacity, Linking } from "react-native";
import { Sliders } from "@/lib/icons";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Collapsible } from "./Collapsible";
import { NewsFeedHeader } from "./NewsFeedHeader";

// NewsFeed component props interface
type NewsFeedProps = {
  onAddMemory?: (article: RSSItem) => void;
  onChangeFeedsPress?: () => void; // Optional callback for feed change
};

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

export const NewsFeed: React.FC<NewsFeedProps> = ({
  onAddMemory,
  onChangeFeedsPress,
}) => {
  // Get list of RSS Feeds from async storage
  const [rssFeeds, setRssFeeds] = useState<RSSFeed[]>([]);
  const asyncData = AsyncStorage.getItem("rssFeeds");

  useEffect(() => {
    asyncData.then((data) => {
      if (data) {
        setRssFeeds(JSON.parse(data));
      } else {
        setRssFeeds(defaultRSSFeeds);
      }
    });
  }, [asyncData]);
  useFocusEffect(
    React.useCallback(() => {
      const loadFeeds = async () => {
        try {
          const data = await AsyncStorage.getItem("rssFeeds");
          if (data) {
            setRssFeeds(JSON.parse(data));
          } else {
            setRssFeeds(defaultRSSFeeds);
          }
        } catch (error) {
          console.error("Error loading RSS feeds:", error);
          setRssFeeds(defaultRSSFeeds);
        }
      };

      loadFeeds();
    }, [])
  );

  return (
    <View className="space-y-4 mb-4 px-4">
      <NewsFeedHeader title="News Feed">
        {rssFeeds.map((rssFeed) => (
          <Articles
            key={rssFeed.url}
            rssUrl={rssFeed.url}
            rssTitle={rssFeed.title}
            onAddMemory={onAddMemory}
          />
        ))}
      </NewsFeedHeader>
    </View>
  );
};
