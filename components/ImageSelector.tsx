import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Button, Text } from "./ui";
import { ImagePlus } from "lucide-react-native";

interface ImageSelectorProps {
  onImageSelected: (uri: string) => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  onImageSelected,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      const fileName = selectedImageUri.split("/").pop();
      const newUri = (FileSystem?.documentDirectory ?? "") + fileName;
      await FileSystem.copyAsync({ from: selectedImageUri, to: newUri });

      setImageUri(newUri);
      onImageSelected(newUri);
    }
  };

  return (
    <View className="items-center my-3">
      <TouchableOpacity
        onPress={pickImage}
        className="w-40 h-40 items-center justify-center bg-gray-100 rounded-xl"
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="w-40 h-40 rounded-xl" />
        ) : (
          <ImagePlus
            strokeWidth={2}
            size={40}
            color="#666666"
            className="opacity-50"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
