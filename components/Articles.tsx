// components/Articles.tsx

import { type FC, useState, useEffect } from "react";
import { View, FlatList, RefreshControl, StyleSheet } from "react-native";
import { RSSFeed } from "@/hooks/useRSSFeed";
import {
  ArticleCard,
  EmptyComponent,
  ArticleListView,
  EmptyListComponent,
} from "./Article";
import { Text } from "@/components/ui";
import { memo } from "react";
import { useRSSFeeds } from "@/contexts/RSSFeedContext";

const MemoizedArticleCard = memo(ArticleCard);
const MemoizedArticleListView = memo(ArticleListView);

interface ArticlesProps {
  rssFeeds: RSSFeed[];
  limit?: number;
  isListView?: boolean;
  filter?: string;
  RSSFeed?: string;
}

export const Articles: FC<ArticlesProps> = ({
  limit = 100,
  isListView,
  filter,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { articles, isLoading, error, refresh, loadMore, hasMore } =
    useRSSFeeds();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const filteredArticles = articles.filter((article) =>
    filter ? article.title.toLowerCase().includes(filter.toLowerCase()) : true
  );

  const AC = isListView ? MemoizedArticleListView : MemoizedArticleCard;
  const EmptyAC = isListView ? EmptyListComponent : EmptyComponent;

  return (
    <>
      <View className="pt-4 pl-4 bg-background">
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AC item={item} />}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={<EmptyAC isRefreshing={isLoading} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 16,
  },
  flatListContent: {
    width: "100%", // or a specific width if you don't want full width
    paddingHorizontal: 16, // Add some horizontal padding
    // alignItems: 'center' // if you want to center the items even if they are smaller than the list width
  },
});
