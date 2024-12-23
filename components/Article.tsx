import React from "react";
import { View, Text, Image, Linking, useColorScheme } from "react-native";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react-native";
import { RSSItem } from "./Articles";

interface NewsCardProps {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  onAddMemory?: (article: RSSItem) => void;
}

export const Article: React.FC<NewsCardProps> = ({
  title,
  description,
  image,
  publishedAt,
  source,
  onAddMemory,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // Format date
  const formattedDate = new Date(publishedAt).toLocaleDateString();

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
        <CardTitle className={textStyles.title}>{title}</CardTitle>
        <Text className={`${textStyles.source}`}>
          {source.name} • {formattedDate}
        </Text>
      </CardHeader>
      <CardContent>
        {image && (
          <Image
            source={{ uri: image }}
            className="w-full h-48 rounded-md mb-2"
            resizeMode="cover"
          />
        )}
        <Text className={textStyles.description}>{description}</Text>
      </CardContent>
      <CardFooter className="flex flex-row justify-between items-center">
        <Button
          variant={"outline"}
          onPress={() => console.log("added")}
          className="flex-row items-center"
        >
          <Text>Add to Memories</Text>
        </Button>
        <Button
          variant="ghost"
          onPress={() => Linking.openURL(source.url)}
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
