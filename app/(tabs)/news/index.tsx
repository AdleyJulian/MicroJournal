import { View } from "react-native";
import { Articles } from "@/components/Articles";
import { useGlobalSearchParams } from "expo-router";
import { useRSSFeedConfig } from "@/contexts/RSSFeedConfigContext";

export default function NewsFeedScreen() {
  const { feedSources } = useRSSFeedConfig();

  const params = useGlobalSearchParams<{
    isListView: string;
    filter: string;
    RSSFeed: string;
  }>();

  const filteredFeed = feedSources.filter((feed) =>
    params.RSSFeed ? feed.title === params.RSSFeed : true
  );

  const isListView = params.isListView === "true";

  return (
    <Articles
      rssFeeds={filteredFeed}
      isListView={isListView}
      filter={params.filter}
    />
  );
}
