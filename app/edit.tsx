import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EditCardForm } from "@/components/form/EditCard";

import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getEntryById } from "@/db/queries";
import { Text } from "@/components/ui";

const CreateMemoryScreen: React.FC = () => {
  const params = useLocalSearchParams<{ articleData?: string }>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["getEntryById", id],
    queryFn: () => getEntryById(parseInt(id)),
  });

  if (isLoading || !data) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <EditCardForm data={data} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateMemoryScreen;
