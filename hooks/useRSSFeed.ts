import { useState, useCallback, useEffect } from "react";
import * as xml2js from "xml2js";

// Types
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

export type RSSFeed = {
  id: string;
  url: string;
  title: string;
};

interface RSSFeedState {
  articles: RSSItem[];
  isLoading: boolean;
  error: Error | null;
}

interface UseRSSFeedOptions {
  limit?: number;
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

export const useRSSFeed = (
  rssFeeds: RSSFeed[],
  options: UseRSSFeedOptions = {}
) => {
  const {
    limit = 10,
    refreshInterval = 0, // 0 means no auto-refresh
    enabled = true,
  } = options;

  const [state, setState] = useState<RSSFeedState>({
    articles: [],
    isLoading: false,
    error: null,
  });

  // Parse XML to extract article details
  const parseRSSFeed = useCallback(
    (xmlString: string, feed: RSSFeed): RSSItem[] => {
      const parsedArticles: RSSItem[] = [];

      const parser = new xml2js.Parser({
        trim: true,
        explicitArray: false,
        mergeAttrs: true,
      });

      parser.parseString(
        xmlString,
        (
          err: any,
          result: { rss: { channel: { item: any; title: any; link: any } } }
        ) => {
          if (err) {
            throw new Error("XML Parsing error: " + err.message);
          }

          const items = Array.isArray(result.rss.channel.item)
            ? result.rss.channel.item
            : [result.rss.channel.item];

          items.slice(0, limit).forEach((item: any) => {
            // Extract image from various possible locations
            let image = "";
            if (item["media:content"]) {
              image = item["media:content"].url || "";
            } else if (item.enclosure) {
              image = item.enclosure.url || "";
            }

            parsedArticles.push({
              id: `${item.url}  ${Math.floor(Math.random() * 1000000)}`,
              title: item.title,
              description: item.description,
              published: item.pubDate,
              link: item.link,
              image,
              source: {
                name: result.rss.channel.title || feed.title,
                url: result.rss.channel.link || feed.url,
              },
            });
          });
        }
      );

      return parsedArticles;
    },
    [limit]
  );

  // Fetch RSS feeds
  const fetchRSSFeeds = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const allArticles: RSSItem[] = [];
      for (const feed of rssFeeds) {
        const response = await fetch(feed.url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseText = await response.text();
        const processedArticles = parseRSSFeed(responseText, feed);
        allArticles.push(...processedArticles);
      }

      setState((prev) => ({
        ...prev,
        articles: allArticles,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error("An error occurred"),
        isLoading: false,
      }));
    }
  }, [enabled, parseRSSFeed, rssFeeds]);

  // Set up auto-refresh
  useEffect(() => {
    if (!enabled || !refreshInterval) return;

    const intervalId = setInterval(fetchRSSFeeds, refreshInterval);

    return () => clearInterval(intervalId);
  }, [enabled, fetchRSSFeeds, refreshInterval]);

  // Initial fetch
  useEffect(() => {
    fetchRSSFeeds();
  }, [fetchRSSFeeds]);

  return {
    ...state,
    refresh: fetchRSSFeeds,
  };
};
