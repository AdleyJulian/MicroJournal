// contexts/RSSFeedContext.tsx
import React, { createContext, useContext, useCallback, useMemo } from "react";
import * as xml2js from "xml2js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRSSFeedConfig } from "./RSSFeedConfigContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface RSSItem {
  id: string;
  title: string;
  description: string;
  published: string;
  link: string;
  image?: string;
  source?: {
    name: string;
    url: string;
  };
}

export interface RSSFeed {
  id: string;
  url: string;
  title: string;
}

interface FeedCount {
  [feedUrl: string]: number;
}

interface UseRSSFeedOptions {
  limit?: number;
  refreshInterval?: number;
  enabled?: boolean;
  cacheTimeout?: number; // In minutes
}

interface RSSContextValue {
  articles: RSSItem[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  page: number;
  totalCount: number;
  feedCounts: FeedCount;
  refresh: () => Promise<void>;
  loadMore: () => void;
  options: UseRSSFeedOptions;
  getAllArticles: () => RSSItem[];
  getArticleCountByFeed: (feedUrl: string) => number;
}

const CACHE_KEY = "RSS_FEED_CACHE";
const RSS_ARTICLES_QUERY_KEY = "rssArticles";
const PAGE_SIZE = 20;

const RSSFeedContext = createContext<RSSContextValue | null>(null);

const stripHtmlTags = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};

const truncateDescription = (text: string, maxLength: number = 200): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const RSSFeedProvider: React.FC<{
  children: React.ReactNode;
  initialRssFeeds: RSSFeed[];
  initialOptions: UseRSSFeedOptions;
}> = ({ children, initialOptions }) => {
  const { feedSources } = useRSSFeedConfig();
  const queryClient = useQueryClient();


  
  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(() => ({
    ...initialOptions,
    cacheTimeout: initialOptions.cacheTimeout || 30, // Default 30 minutes
  }), [initialOptions]);

  // Helper functions
  const calculateFeedCounts = useCallback((articles: RSSItem[]): FeedCount => {
    return articles.reduce((counts, article) => {
      if (article.source?.url) {
        counts[article.source.url] = (counts[article.source.url] || 0) + 1;
      }
      return counts;
    }, {} as FeedCount);
  }, []);

  const parseRSSFeed = useCallback((xmlString: string, feed: RSSFeed): RSSItem[] => {
    const parsedArticles: RSSItem[] = [];
    const parser = new xml2js.Parser({
      trim: true,
      explicitArray: false,
      mergeAttrs: true,
    });

    parser.parseString(xmlString, (err: any, result: any) => {
      if (err) throw new Error("XML Parsing error: " + err.message);
      if (!result?.rss?.channel) return parsedArticles;

      const items = Array.isArray(result.rss.channel.item)
        ? result.rss.channel.item
        : [result.rss.channel.item];

      if (!items || !items.length) return parsedArticles;

      items.forEach((item: any) => {
        if (!item) return;
        const image = item["media:content"]?.url || item.enclosure?.url || "";

        parsedArticles.push({
          id: `${item.link || ""}${Date.now()}${Math.random()}`,
          title: stripHtmlTags(item.title || ""),
          description: truncateDescription(stripHtmlTags(item.description || "")),
          published: item.pubDate || new Date().toISOString(),
          link: item.link || "",
          image,
          source: {
            name: result.rss.channel.title || feed.title,
            url: result.rss.channel.link || feed.url, // Use the channel link from RSS feed
          },
        });
      });
    });

    return parsedArticles;
  }, []);

  // Fetch RSS data function
  const fetchRSSData = useCallback(async (): Promise<RSSItem[]> => {
    if (!feedSources?.length) {
      return [];
    }

    try {
      // Try to get cached data first
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { articles, timestamp } = JSON.parse(cached);
        const age = (Date.now() - timestamp) / (1000 * 60);

        if (age < options.cacheTimeout!) {
          return articles;
        }
      }

      // If no valid cache, fetch fresh data
      const allArticles: RSSItem[] = [];
      for (const feed of feedSources) {
        const response = await fetch(feed.url);
        if (!response.ok) {
          console.warn(`HTTP error! status: ${response.status} for URL: ${feed.url}`);
          continue; // Skip this feed but continue with others
        }
        const responseText = await response.text();
        const processedArticles = parseRSSFeed(responseText, feed);
        allArticles.push(...processedArticles);
      }

      // Sort by date
      allArticles.sort(
        (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
      );

      // Cache the results
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          articles: allArticles,
          timestamp: Date.now(),
        })
      );

      return allArticles;
    } catch (error) {
      console.error("Error fetching RSS feeds:", error);
      throw error instanceof Error ? error : new Error("An error occurred fetching RSS feeds");
    }
  }, [feedSources, parseRSSFeed, options.cacheTimeout]);

  // Use TanStack Query to manage RSS data
  const {
    data: allArticles = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [RSS_ARTICLES_QUERY_KEY, feedSources.map(f => f.id).join(',')],
    queryFn: fetchRSSData,
    staleTime: options.refreshInterval || 5 * 60 * 1000, // Default 5 minutes
    refetchInterval: options.refreshInterval,
    refetchOnWindowFocus: false,
  });



  // Pagination state (kept outside of React Query)
  const [page, setPage] = React.useState(0);
  
  // Computed values
  const visibleArticles = useMemo(() => {
    return allArticles.slice(0, (page + 1) * PAGE_SIZE);
  }, [allArticles, page]);
  
  const hasMore = useMemo(() => {
    return visibleArticles.length < allArticles.length;
  }, [visibleArticles.length, allArticles.length]);
  
  const feedCounts = useMemo(() => {
    return calculateFeedCounts(allArticles);
  }, [calculateFeedCounts, allArticles]);

  // Load more articles action
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setPage(prevPage => prevPage + 1);
  }, [isLoading, hasMore]);

  // Force refresh action
  const refresh = useCallback(async () => {
    setPage(0);
    await refetch();
  }, [refetch]);

  // Helper methods
  const getArticleCountByFeed = useCallback(
    (feedUrl: string): number => {
      // Create a mapping from feed URLs to channel URLs
      const feedToChannelMap: { [feedUrl: string]: string } = {};
      feedSources.forEach(feed => {
        // For NYT feeds, map the RSS URL to the web URL
        if (feed.url.includes('nytimes.com/services/xml/rss/nyt/HomePage')) {
          feedToChannelMap[feed.url] = 'https://www.nytimes.com';
        } else if (feed.url.includes('nytimes.com/services/xml/rss/nyt/World')) {
          feedToChannelMap[feed.url] = 'https://www.nytimes.com/section/world';
        } else {
          // For other feeds, use the feed URL as-is
          feedToChannelMap[feed.url] = feed.url;
        }
      });

      const channelUrl = feedToChannelMap[feedUrl];
      return feedCounts[channelUrl] || 0;
    },
    [feedCounts, feedSources]
  );

  const getAllArticles = useCallback(() => {
    return allArticles;
  }, [allArticles]);

  // Context value
  const value: RSSContextValue = {
    articles: visibleArticles,
    isLoading,
    error: error as Error | null,
    hasMore,
    page,
    totalCount: allArticles.length,
    feedCounts,
    refresh,
    loadMore,
    options,
    getAllArticles,
    getArticleCountByFeed,
  };

  return (
    <RSSFeedContext.Provider value={value}>{children}</RSSFeedContext.Provider>
  );
};

export const useRSSFeeds = () => {
  const context = useContext(RSSFeedContext);
  if (!context) {
    throw new Error("useRSSFeeds must be used within an RSSFeedProvider");
  }
  return context;
};