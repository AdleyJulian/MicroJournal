import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import * as xml2js from "xml2js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRSSFeedConfig } from "./RSSFeedConfigContext";

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
  [feedTitle: string]: number;
}

interface RSSFeedState {
  articles: RSSItem[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  page: number;
  totalCount: number;
  feedCounts: FeedCount; // Added feed counts
}

interface UseRSSFeedOptions {
  limit?: number;
  refreshInterval?: number;
  enabled?: boolean;
  cacheTimeout?: number; // In minutes
}

interface RSSContextValue extends RSSFeedState {
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  options: UseRSSFeedOptions;
  getAllArticles: () => RSSItem[];
  getArticleCountByFeed: (feedTitle: string) => number; // Added feed count getter
}

const CACHE_KEY = "RSS_FEED_CACHE";
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
}> = ({ children, initialRssFeeds, initialOptions }) => {
  const { feedSources } = useRSSFeedConfig();
  const [options] = useState<UseRSSFeedOptions>({
    ...initialOptions,
    cacheTimeout: initialOptions.cacheTimeout || 30, // Default 30 minutes
  });

  const [state, setState] = useState<RSSFeedState>({
    articles: [],
    isLoading: false,
    error: null,
    hasMore: true,
    page: 0,
    totalCount: 0,
    feedCounts: {},
  });

  const allArticlesRef = useRef<RSSItem[]>([]);
  const lastFetchRef = useRef<number>(0);

  const calculateFeedCounts = useCallback((articles: RSSItem[]): FeedCount => {
    return articles.reduce((counts, article) => {
      if (article.source?.name) {
        const feedTitle = article.source.name.toLowerCase();
        counts[feedTitle] = (counts[feedTitle] || 0) + 1;
      }
      return counts;
    }, {} as FeedCount);
  }, []);

  const parseRSSFeed = useCallback(
    (xmlString: string, feed: RSSFeed): RSSItem[] => {
      const parsedArticles: RSSItem[] = [];
      const parser = new xml2js.Parser({
        trim: true,
        explicitArray: false,
        mergeAttrs: true,
      });

      parser.parseString(xmlString, (err: any, result: any) => {
        if (err) throw new Error("XML Parsing error: " + err.message);

        const items = Array.isArray(result.rss.channel.item)
          ? result.rss.channel.item
          : [result.rss.channel.item];

        items.forEach((item: any) => {
          const image = item["media:content"]?.url || item.enclosure?.url || "";
          parsedArticles.push({
            id: `${item.link}${Date.now()}`,
            title: stripHtmlTags(item.title),
            description: truncateDescription(stripHtmlTags(item.description)),
            published: item.pubDate,
            link: item.link,
            image,
            source: {
              name: result.rss.channel.title || feed.title,
              url: result.rss.channel.link || feed.url,
            },
          });
        });
      });

      return parsedArticles;
    },
    []
  );
  const loadCache = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { articles, timestamp } = JSON.parse(cached);
        const age = (Date.now() - timestamp) / (1000 * 60);

        if (age < options.cacheTimeout!) {
          allArticlesRef.current = articles;
          const feedCounts = calculateFeedCounts(articles);
          setState((prev) => ({
            ...prev,
            articles: articles.slice(0, PAGE_SIZE),
            hasMore: articles.length > PAGE_SIZE,
            totalCount: articles.length,
            feedCounts,
          }));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.warn("Cache loading failed:", error);
      return false;
    }
  }, [options.cacheTimeout, calculateFeedCounts]);

  const saveCache = useCallback(async (articles: RSSItem[]) => {
    try {
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          articles,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.warn("Cache saving failed:", error);
    }
  }, []);

  const fetchRSSFeeds = useCallback(
    async (forceRefresh = false) => {
      if (!feedSources?.length) {
        setState((prev) => ({
          ...prev,
          articles: [],
          isLoading: false,
          error: null,
          totalCount: 0,
          feedCounts: {},
        }));
        return;
      }

      // Check cache first unless force refresh
      if (!forceRefresh && (await loadCache())) {
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      lastFetchRef.current = Date.now();

      try {
        const allArticles: RSSItem[] = [];
        for (const feed of feedSources) {
          const response = await fetch(feed.url);
          if (!response.ok) {
            throw new Error(
              `HTTP error! status: ${response.status} for URL: ${feed.url}`
            );
          }
          const responseText = await response.text();
          const processedArticles = parseRSSFeed(responseText, feed);
          allArticles.push(...processedArticles);
        }

        // Sort by date
        allArticles.sort(
          (a, b) =>
            new Date(b.published).getTime() - new Date(a.published).getTime()
        );

        allArticlesRef.current = allArticles;
        const feedCounts = calculateFeedCounts(allArticles);
        await saveCache(allArticles);

        setState({
          articles: allArticles.slice(0, PAGE_SIZE),
          isLoading: false,
          error: null,
          hasMore: allArticles.length > PAGE_SIZE,
          page: 0,
          totalCount: allArticles.length,
          feedCounts,
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error ? error : new Error("An error occurred"),
          totalCount: 0,
          feedCounts: {},
        }));
      }
    },
    [feedSources, parseRSSFeed, loadCache, saveCache, calculateFeedCounts]
  );

  const loadMore = useCallback(async () => {
    if (state.isLoading || !state.hasMore) return;

    const nextPage = state.page + 1;
    const start = nextPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const nextArticles = allArticlesRef.current.slice(0, end);

    setState((prev) => ({
      ...prev,
      articles: nextArticles,
      page: nextPage,
      hasMore: end < allArticlesRef.current.length,
    }));
  }, [state.isLoading, state.hasMore, state.page]);

  // Initial fetch
  useEffect(() => {
    fetchRSSFeeds();
  }, [fetchRSSFeeds]);

  // Auto-refresh if enabled
  useEffect(() => {
    if (!options.refreshInterval) return;

    const interval = setInterval(() => {
      const timeSinceLastFetch = Date.now() - lastFetchRef.current;

      if (timeSinceLastFetch >= options.refreshInterval!) {
        fetchRSSFeeds(true);
      }
    }, options.refreshInterval);

    return () => clearInterval(interval);
  }, [options.refreshInterval, fetchRSSFeeds]);

  const getArticleCountByFeed = useCallback(
    (feedTitle: string): number => {
      return state.feedCounts[feedTitle.toLowerCase()] || 0;
    },
    [state.feedCounts]
  );

  const getAllArticles = useCallback(() => {
    return allArticlesRef.current;
  }, []);

  const value: RSSContextValue = {
    ...state,
    refresh: () => fetchRSSFeeds(true),
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
