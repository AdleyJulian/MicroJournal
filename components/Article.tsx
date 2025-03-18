import React from "react";
import { View, Image, Linking } from "react-native";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RSSItem } from "~/hooks/useRSSFeed";
import { ArticleData } from "@/db/schema/types";
import { Link } from "expo-router";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, ExternalLinkIcon, Sun } from "@/lib/icons/";
import { Text } from "@/components/ui/";

export const ArticleCard = ({ item }: { item: RSSItem }) => {
  const formattedDate = new Date(item.published).toLocaleDateString();
  const articleData: ArticleData = {
    title: item.title,
    description: item.description,
    content: item.description,
    url: item.source?.url || "",
    image: item.image || "",
    publishedAt: item.published,
    source: {
      url: item.source?.url || "",
      name: item.source?.name || "",
    },
  };

  return (
    <Card className="w-full max-w-md mb-4 ">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>
          <Text>
            {item.source?.name} • {formattedDate}
          </Text>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            className="w-full h-48 rounded-md mb-2"
            resizeMode="cover"
          />
        )}
        <Text numberOfLines={3}>{item.description}</Text>
      </CardContent>
      <CardFooter className="flex flex-row justify-between items-center">
        <Link
          asChild
          href={{
            pathname: "/(tabs)/create",
            params: { articleData: JSON.stringify(articleData) },
          }}
        >
          <Button className="flex-row items-center">
            <Text>Add to Memories</Text>
          </Button>
        </Link>

        <Button onPress={() => Linking.openURL(item.link)}>
          <View className="flex-row items-center justify-center">
            <ExternalLinkIcon
              size={16}
              className="mr-2 text-primary-foreground self-center" // Added self-center
            />
            <Text className="self-center">Read More</Text>
          </View>
        </Button>
      </CardFooter>
    </Card>
  );
};

type EmptyComponentProps = {
  isRefreshing: boolean;
  // rssTitle: string | undefined;
  // rssUrl: string;
};
export const EmptyComponent = (props: EmptyComponentProps) => {
  const { isRefreshing } = props;

  const widthFractions = ["w-1/2", "w-2/3", "w-3/4", "w-full"];
  const getRandomWidth = () => {
    return widthFractions[Math.floor(Math.random() * widthFractions.length)];
  };

  if (isRefreshing) {
    return (
      <>
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="w-full max-w-md mb-4 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-black">
                  <Skeleton className="h-7 w-full" />
                  <Skeleton className={`h-7 ${getRandomWidth()} mt-2`} />
                </CardTitle>
                <Skeleton className="h-5 w-48 mt-2 bg-gray-300" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-48 rounded-md mb-2 bg-gray-300" />
                <View className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-300" />
                  <Skeleton className="h-4 w-5/6 bg-gray-300" />
                  <Skeleton className="h-4 w-4/6 bg-gray-300" />
                </View>
              </CardContent>
              <CardFooter className="flex flex-row justify-between items-center">
                <Button
                  variant="outline"
                  className="flex-row items-center"
                  disabled
                >
                  <Text>Add to Memories</Text>
                </Button>
                <Button
                  variant="ghost"
                  className="flex-row items-center"
                  disabled
                >
                  <Sun size={16} className="mr-2 text-black" />
                  <Text className="text-black">Read More</Text>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4 mt-2">
      <Text className="text-center">No articles found.</Text>
    </View>
  );
};

EmptyComponent.displayName = "EmptyComponent";

export const ArticleListView = ({ item }: { item: RSSItem }) => {
  const formattedDate = new Date(item.published).toLocaleDateString();
  const articleData: ArticleData = {
    title: item.title,
    description: item.description,
    content: item.description,
    url: item.source?.url || "",
    image: item.image || "",
    publishedAt: item.published,
    source: {
      url: item.source?.url || "",
      name: item.source?.name || "",
    },
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="p-3 space-y-1">
        <Link
          href={{
            pathname: "/(tabs)/create",
            params: { articleData: JSON.stringify(articleData) },
          }}
        >
          <CardTitle>{item.title}</CardTitle>
        </Link>
        <CardDescription className="flex-1">
          <View className="flex-row justify-between items-center">
            <Text className="flex-1 text-sm" numberOfLines={1}>
              {item.source?.name} • {formattedDate}
            </Text>

            <View className="flex-row">
              <Link
                asChild
                href={{
                  pathname: "/(tabs)/create",
                  params: { articleData: JSON.stringify(articleData) },
                }}
              >
                <Button variant="ghost" size="icon" className="h-8 w-8 mx-4">
                  <>
                    <PlusCircle size={16} className="text-foreground" />
                  </>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onPress={() => Linking.openURL(item.link)}
              >
                <ExternalLinkIcon size={16} className="text-foreground" />
              </Button>
            </View>
          </View>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

ArticleListView.displayName = "ArticleListView";

export const EmptyListComponent = (props: { isRefreshing: boolean }) => {
  const widthFractions = ["w-1/2", "w-1/3", "w-1/4", "w-2/3", "w-3/4"];

  const getRandomWidth = () => {
    return widthFractions[Math.floor(Math.random() * widthFractions.length)];
  };

  if (props.isRefreshing) {
    return (
      <>
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <Card className="w-full mb-2" key={index}>
              <CardHeader className="p-3 space-y-1">
                <CardTitle className="text-lg font-bold mb-1">
                  <Skeleton className="h-7 w-full" />
                </CardTitle>
                <CardTitle className="text-lg font-bold mb-1">
                  <Skeleton className={`h-7 ${getRandomWidth()}`} />
                </CardTitle>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center space-x-4">
                    <Skeleton className="h-5 w-32 bg-gray-300" />
                    {/* Skeleton color */}
                    <Text className="text-xs">•</Text>
                    <View className="flex-row items-center">
                      <Skeleton className="h-5 w-16" />
                    </View>
                  </View>
                  <View className="flex-row items-center space-x-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PlusCircle
                        size={16}
                        className="text-black" // Icon color
                      />
                    </Button>

                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLinkIcon
                        size={16}
                        className="text-foreground" // Icon color
                      />
                    </Button>
                  </View>
                </View>
              </CardHeader>
            </Card>
          ))}
      </>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4 mt-2">
      <Text className="text-center text-black">No articles found.</Text>
    </View>
  );
};
EmptyListComponent.displayName = "EmptyListComponent";
