import React from "react";
import { View, Pressable, Image } from "react-native";
import { Link } from "expo-router";
import { Text } from "./ui";

interface RecentMemoryItemProps {
  id: string;
  title: string;
  createdAt: string;
  mediaAttachment?: {
    mediaPath: string;
    mediaSourceType: string;
    type: string | null;
  } | null;
}

export function RecentMemoryItem({
  id,
  title,
  createdAt,
  mediaAttachment,
}: RecentMemoryItemProps) {
  const hasImage = mediaAttachment && mediaAttachment.type === "image";

  return (
    <Link
      asChild
      href={{ pathname: "/entries", params: { id } }}
    >
      <Pressable className="flex-row items-center py-3 border-b border-border last:border-b-0">
        {hasImage && (
          <View className="w-12 h-12 rounded-lg mr-3 overflow-hidden bg-muted">
            <Image
              source={{
                uri: mediaAttachment.mediaSourceType === "file"
                  ? `file://${mediaAttachment.mediaPath}`
                  : mediaAttachment.mediaPath
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}

        <View className="flex-1">
          <Text className="font-medium text-foreground" numberOfLines={2}>
            {title || "Untitled Memory"}
          </Text>
          <Text className="text-sm text-muted-foreground mt-1">
            {createdAt}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
