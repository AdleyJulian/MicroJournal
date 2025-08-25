import React from "react";
import {
  View,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Card, CardContent, Text } from "@/components/ui";
import {
  JournalEntry,
  entryTagSchema,
  type MediaAttachment,
} from "@/db/schema/schema";

interface MediaSectionProps {
  media: MediaAttachment | null;
  entry: JournalEntry;
  isLoading?: boolean;
  onMediaPress?: (media: MediaAttachment) => void;
}

export function MediaSection({
  media,
  isLoading,
  onMediaPress,
  entry,
}: MediaSectionProps) {
  if (isLoading) {
    return (
      <Card className="mt-4">
        <View className="animate-pulse h-48 bg-muted rounded-lg" />
      </Card>
    );
  }

  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const handleImagePress = () => {
    setIsFullScreen((prev) => !prev);
  };

  return (
    <>
      <Card className="mx-4">
        <View className="flex-row items-start">
          {/* Flexbox row, align items to top */}
          {media && ( // Conditionally render image
            <>
              <Pressable onPress={handleImagePress} className="relative w-40">
                {/* Fixed width for image container */}
                <Image
                  source={{ uri: media.mediaPath }}
                  className="w-full h-40" // Image fills container
                  resizeMode="contain"
                />
                {media.caption && (
                  <View className="bg-background/80 p-2 absolute bottom-0 left-0 right-0">
                    <Text className="text-sm text-foreground">
                      {media.caption}
                    </Text>
                  </View>
                )}
              </Pressable>
              <Modal visible={isFullScreen} transparent={true}>
                <TouchableWithoutFeedback onPress={handleImagePress}>
                  <View
                    className={`flex-1 bg-black/80 justify-center items-center insets.top > 0 ? 'pt-'+insets.top : ''}`}
                  >
                    <Image
                      source={{ uri: media.mediaPath }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </>
          )}
          <View className="flex-1 pl-4 pt-4">
            {/* Flexbox column for answer, add padding left */}
            <CardContent>
              <Text>{entry.answer}</Text>
            </CardContent>
          </View>
        </View>
      </Card>
    </>
  );
}
