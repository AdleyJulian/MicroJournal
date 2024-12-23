import React, { useState, useCallback } from "react";
import {
  View,
  Image,
  Linking,
  useColorScheme,
  FlatList,
  RefreshControl,
} from "react-native";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react-native";
import * as xml2js from "xml2js";
import { Text } from "@/components/ui/text";
import { Collapsible } from "./Collapsible";
import { createArticleEntry } from "~/db/mutations";
import { type ArticleData } from "~/db/schema/types";

// Define a more comprehensive interface for RSS item
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

// Props interface for the Articles component
interface ArticlesProps {
  rssUrl: string;
  rssTitle?: string;
  onAddMemory?: (article: RSSItem) => void;
  limit?: number;
}

// Main Articles component
const Articles: React.FC<ArticlesProps> = ({
  rssUrl,
  onAddMemory,
  rssTitle,
  limit = 10,
}) => {
  const [articles, setArticles] = useState<RSSItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // Parse XML to extract image and other details
  const parseRSSFeed = useCallback(
    (xmlString: string): RSSItem[] => {
      const parsedArticles: RSSItem[] = [];

      // Create XML parser
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
            console.error("XML Parsing error:", err);
            return [];
          }

          // Handle different RSS feed structures
          const items = Array.isArray(result.rss.channel.item)
            ? result.rss.channel.item
            : [result.rss.channel.item];

          items.slice(0, limit).forEach((item: any) => {
            // Extract image from media:content or other possible locations
            let image = "";
            if (item["media:content"]) {
              // NYT-style media:content
              image = item["media:content"].url || "";
            } else if (item.enclosure) {
              // Some RSS feeds use enclosure
              image = item.enclosure.url || "";
            }

            parsedArticles.push({
              id: item.guid?.$t || item.guid || item.title,
              title: item.title,
              description: item.description,
              published: item.pubDate,
              link: item.link,
              image: image,
              source: {
                name: result.rss.channel.title || "News Source",
                url: result.rss.channel.link || rssUrl,
              },
            });
          });
        }
      );

      return parsedArticles;
    },
    [limit, rssUrl]
  );

  // Fetch RSS feed
  const fetchRSSFeed = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(rssUrl);
      const responseText = await response.text();

      // Parse the XML and extract articles
      const processedArticles = parseRSSFeed(responseText);
      setArticles(processedArticles);
      console.log("Fetched RSS feed");
    } catch (error) {
      console.error("Failed to fetch RSS feed:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [parseRSSFeed, rssUrl]);

  // Add article to memory
  const handleAddMemory = async (article: RSSItem) => {
    const articleData: ArticleData = {
      title: article.title,
      description: article.description,
      content: article.description,
      url: article.source?.url || "",
      image: article.image || "",
      publishedAt: article.published,
      source: {
        url: article.source?.url || "",
        name: article.source?.name || "",
      },
    };
    await createArticleEntry(articleData);
  };

  // Render individual article card
  const renderArticleCard = ({ item }: { item: RSSItem }) => {
    const formattedDate = new Date(item.published).toLocaleDateString();

    // Dynamic styling based on color scheme
    const textStyles = {
      title: `text-lg font-bold ${isDarkMode ? "text-white" : "text-black"}`,
      source: `text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`,
      description: `text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`,
    };

    return (
      <Card
        className={`w-full max-w-md mb-4 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <CardHeader>
          <CardTitle className={textStyles.title}>{item.title}</CardTitle>
          <Text className={`${textStyles.source}`}>
            {item.source?.name} • {formattedDate}
          </Text>
        </CardHeader>
        <CardContent>
          {item.image && (
            <Image
              source={{ uri: item.image }}
              className="w-full h-48 rounded-md mb-2"
              resizeMode="cover"
            />
          )}
          <Text className={textStyles.description} numberOfLines={3}>
            {item.description}
          </Text>
        </CardContent>
        <CardFooter className="flex flex-row justify-between items-center">
          <Button
            variant={"outline"}
            onPress={() => handleAddMemory(item)}
            className="flex-row items-center"
          >
            <Text>Add to Memories</Text>
          </Button>

          <Button
            variant="ghost"
            onPress={() => Linking.openURL(item.link)}
            className="flex-row items-center"
          >
            <ExternalLinkIcon
              size={16}
              color={isDarkMode ? "white" : "black"}
              className="mr-2"
            />
            <Text className={isDarkMode ? "text-white" : "text-black"}>
              Read More
            </Text>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Initial fetch on component mount
  React.useEffect(() => {
    fetchRSSFeed();
  }, [fetchRSSFeed]);
  const [open, setOpen] = useState(true);

  return (
    <View>
      <Collapsible title={rssTitle || "News"}>
        {/* {articles.map((article, index) => (
          <Article
            description={article.description}
            image={article.image || ""}
            source={{
              name: article.source?.name || "",
              url: article.source?.url || "",
            }}
            publishedAt={article.published}
            title={article.title}
            key={index}
            onAddMemory={onAddMemory}
          />
        ))} */}
        <FlatList
          data={articles}
          renderItem={renderArticleCard}
          keyExtractor={(_, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchRSSFeed}
              colors={["#9Bd35A", "#689F38"]}
              title="Pull to refresh"
            />
          }
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center p-4 mt-2">
              <Text
                className={`text-center ${isDarkMode ? "text-white" : "text-black"}`}
              >
                {isRefreshing
                  ? "Loading articles..."
                  : `No articles found for ${rssTitle || rssUrl}`}
              </Text>
            </View>
          )}
        />
      </Collapsible>
    </View>
  );
};
Articles.displayName = "Articles";
export { Articles };
