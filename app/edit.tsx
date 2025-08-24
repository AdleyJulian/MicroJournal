// Test hot reload - this comment was added
import React from "react";
import { ScrollView, View } from "react-native";
import { EditCardForm } from "@/components/form/EditCard";

import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getEntryById } from "@/db/queries";
import { Text, CustomHeader } from "@/components/ui";

const CreateMemoryScreen: React.FC = () => {
  const params = useLocalSearchParams<{ articleData?: string }>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["getEntryById", id],
    queryFn: () => getEntryById(parseInt(id)),
  });

  if (isLoading || !data) {
    return (
      <View className="flex-1 bg-background">
        <CustomHeader title="Edit" showBackButton={true} />
        <View className="flex-1 justify-center items-center">
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
              
      <CustomHeader title="Edit" showBackButton={true} />
      <ScrollView className="flex-1">
      <Text> Test</Text>
        <EditCardForm data={data} />
      </ScrollView>
    </View>
  );
};

export default CreateMemoryScreen;
