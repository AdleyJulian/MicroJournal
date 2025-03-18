import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NewCardForm } from "@/components/form/NewCard";

import { useLocalSearchParams } from "expo-router";
import { ArticleData } from "@/db/schema/types";

const CreateMemoryScreen: React.FC = () => {
  const params = useLocalSearchParams<{ articleData?: string }>();
  const articleData = params.articleData
    ? (JSON.parse(params.articleData) as ArticleData)
    : null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        className="px-4 py-6"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <NewCardForm articleData={articleData} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateMemoryScreen;
