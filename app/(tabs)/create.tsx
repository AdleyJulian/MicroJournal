import React from "react";
import { ScrollView, View } from "react-native";
import { NewCardForm } from "@/components/form/NewCard";

import { useLocalSearchParams } from "expo-router";
import { ArticleData } from "@/db/schema/types";

const CreateMemoryScreen: React.FC = () => {
  const params = useLocalSearchParams<{ articleData?: string }>();
  const articleData = params.articleData
    ? (JSON.parse(params.articleData) as ArticleData)
    : null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="px-4 pb-6"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <NewCardForm articleData={articleData} />
      </ScrollView>
    </View>
  );
};

export default CreateMemoryScreen;
