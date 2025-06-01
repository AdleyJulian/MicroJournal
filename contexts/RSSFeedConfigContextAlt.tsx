// context/RSSFeedConfigContext.tsx
import React, { createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { 
  useQuery, 
  useMutation, 
  useQueryClient
} from "@tanstack/react-query";

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

// Keys for the queries
const FEEDS_QUERY_KEY = ["rssFeeds"];

// Functions to interact with AsyncStorage
const fetchFeedSources = async (): Promise<RSSFeed[]> => {
  try {
    const stored = await AsyncStorage.getItem("rssFeeds");
    return stored ? JSON.parse(stored) : defaultRSSFeeds;
  } catch (error) {
    console.error("Error loading feed sources:", error);
    Alert.alert("Error", "Could not load RSS feed sources");
    return defaultRSSFeeds;
  }
};

const persistFeedSources = async (feeds: RSSFeed[]): Promise<void> => {
  try {
    await AsyncStorage.setItem("rssFeeds", JSON.stringify(feeds));
  } catch (error) {
    console.error("Error saving feed sources:", error);
    Alert.alert("Error", "Could not save RSS feed sources");
    throw error;
  }
};

// Create the context
const RSSFeedConfigContext = createContext<{
  feedSources: RSSFeed[];
  isLoading: boolean;
  isError: boolean;
  addFeedSource: (url: string, title: string) => Promise<boolean>;
  deleteFeedSource: (id: string) => void;
  updateFeedSources: (updated: RSSFeed[]) => Promise<void>;
} | null>(null);

export const RSSFeedConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Get the queryClient from the context that's already set up in _layout.tsx
  const queryClient = useQueryClient();

  // Use TanStack Query to fetch feed sources
  const {
    data: feedSources = defaultRSSFeeds,
    isLoading,
    isError,
  } = useQuery({
    queryKey: FEEDS_QUERY_KEY,
    queryFn: fetchFeedSources,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation for updating feed sources
  const mutation = useMutation({
    mutationFn: persistFeedSources,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEEDS_QUERY_KEY });
    },
  });

  // Add a new feed source
  const addFeedSource = async (url: string, title: string): Promise<boolean> => {
    if (!url.trim() || !title.trim()) {
      Alert.alert("Invalid Input", "Please enter both URL and Title");
      return false;
    }

    if (feedSources.some((feed) => feed.url === url)) {
      Alert.alert("Duplicate Feed", "This RSS feed URL already exists");
      return false;
    }

    const newFeed = {
      id: Date.now().toString(),
      url: url.trim(),
      title: title.trim(),
    };

    await updateFeedSources([...feedSources, newFeed]);
    return true;
  };

  // Delete a feed source with confirmation
  const deleteFeedSource = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this RSS feed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await updateFeedSources(feedSources.filter((feed) => feed.id !== id));
          },
        },
      ]
    );
  };

  // Update feed sources
  const updateFeedSources = async (updated: RSSFeed[]): Promise<void> => {
    try {
      await mutation.mutateAsync(updated);
    } catch (error) {
      console.error("Failed to update feed sources:", error);
    }
  };

  const value = {
    feedSources,
    isLoading,
    isError,
    addFeedSource,
    deleteFeedSource,
    updateFeedSources,
  };

  return (
    <RSSFeedConfigContext.Provider value={value}>
      {children}
    </RSSFeedConfigContext.Provider>
  );
};

export const useRSSFeedConfig = () => {
  const context = useContext(RSSFeedConfigContext);
  if (!context) {
    throw new Error(
      "useRSSFeedConfig must be used within an RSSFeedConfigProvider"
    );
  }
  return context;
};