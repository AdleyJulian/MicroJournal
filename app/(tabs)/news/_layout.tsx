import { Drawer } from "expo-router/drawer";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { useRouter, useGlobalSearchParams, Link } from "expo-router";
import { View, TouchableOpacity, TextInput } from "react-native";
import { Text } from "@/components/ui";
import { Search, Grid, List, Plus, Menu } from "@/lib/icons";
import { useState, useEffect } from "react";
import { Favicon } from "@/components/ui/favicon";
import { useRSSFeedConfig } from "@/contexts/RSSFeedConfigContext";
import { useRSSFeeds } from "@/contexts/RSSFeedContext";
import { cn } from "@/lib/utils";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const { feedSources } = useRSSFeedConfig();
  const { getArticleCountByFeed, totalCount } = useRSSFeeds();
  const params = useGlobalSearchParams<{
    isListView?: string;
    filter?: string;
    RSSFeed?: string;
  }>();

  return (
    <DrawerContentScrollView
      {...props}
      className="flex-1 bg-background" // Changed drawer background to semantic
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <TouchableOpacity
        className="p-4"
        onPress={() => router.push("/(tabs)/news")}
      >
        <Text className="text-base font-semibold text-foreground">
          {/* Changed text color to semantic */}
          All Articles ({totalCount})
        </Text>
      </TouchableOpacity>

      <View className="mt-2">
        <View className="flex-row justify-between items-center px-4 py-2">
          <Text className="text-sm font-semibold text-muted-foreground">
            {/* Changed text color to semantic */}
            Feeds
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/news/manage-feeds")}
          >
            <Plus size={20} color="#007AFF" />
            {/* Kept primary color for icon, or theme this if you have semantic primary color for icons */}
          </TouchableOpacity>
        </View>

        {feedSources.map((feed) => (
          <TouchableOpacity
            key={feed.id}
            className={cn(
              `flex-row items-center p-4 pl-8`,
              feed.title !== params.RSSFeed && "", // Removed empty string conditional, className is conditionally applied below
              feed.title === params.RSSFeed ? "bg-secondary" : "" // Changed selected feed background to semantic
            )}
            onPress={() => {
              router.push({
                pathname: "/(tabs)/news",
                params: {
                  RSSFeed: feed.title,
                },
              });
            }}
          >
            <Favicon website={feed.url} />
            <Text className="text-sm ml-2 text-foreground">
              {/* Changed text color to semantic */}
              {`${feed.title} (${getArticleCountByFeed(feed.title)})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <DrawerItem
        label="All Feeds"
        onPress={() => {
          router.push("/(tabs)/news");
        }}
        // labelStyle={{ color: "var(--foreground)" }} // Changed DrawerItem label style to use CSS variable for semantic color
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const params = useGlobalSearchParams<{
    isListView?: string;
    filter?: string;
    RSSFeed?: string;
  }>();

  // Add debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isSearchVisible) {
        router.push({
          pathname: "/(tabs)/news",
          params: {
            ...params,
            filter: searchQuery,
          },
        });
      }
    }, 300); // 300ms delay for debouncing

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isSearchVisible]);

  function HeaderRight() {
    const isListView = params.isListView === "true";

    return (
      <View className="flex-row items-center justify-end w-[300px] mr-4">
        <View className="flex-row items-center">
          {isSearchVisible && (
            <TextInput
              className="h-12 border border-input rounded-lg px-3 mr-2 w-[200px] bg-background text-base text-foreground leading-6" // Changed TextInput styles to semantic
              placeholder="Search..."
              placeholderTextColor="#9CA3AF" // Keep placeholderTextColor if it's a specific gray you want, or theme it as well
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          )}
          <TouchableOpacity
            onPress={() => {
              setIsSearchVisible(!isSearchVisible);
              if (!isSearchVisible) {
                setSearchQuery("");
              }
            }}
            className="w-6 mr-4 items-center justify-center"
          >
            <Search size={24} className="text-foreground" />
            {/* Changed icon color to semantic */}
          </TouchableOpacity>
          <Link
            asChild
            href={{
              pathname: "/news",
              params: {
                ...params,
                isListView: isListView ? "false" : "true",
              },
            }}
          >
            <TouchableOpacity className="w-6 items-center justify-center">
              {!isListView ? (
                <Grid size={24} className="text-foreground" />
              ) : (
                <List size={24} className="text-foreground" />
              )}
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerIcon: ({ color, size }) => <Menu size={size} color={color} />,
        headerTitle: isSearchVisible ? "" : params.RSSFeed || "All Feeds",
        headerStyle: {
          // Remove the automatic safe area padding addition
          paddingTop: 0,
        },
        headerStatusBarHeight: 0, // This prevents automatic status bar height addition
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "RSS Feeds",
          headerRight: HeaderRight,
        }}
        
      />
      <Drawer.Screen
        name="manage-feeds"
        options={{
          title: "Manage Feeds",
          headerShown: true,
        }}
      />
    </Drawer>
  );
}
