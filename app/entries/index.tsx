import { useLocalSearchParams } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as queries from "@/db/queries";
import * as mutations from "@/db/mutations";
import { Text } from "@/components/ui";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";
import {
  EntryHeader,
  MediaSection,
  EntryMetrics,
  EntryActions,
} from "@/components/entries/";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
export default function JournalEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getEntryById", id],
    queryFn: () => queries.getEntryById(parseInt(id)),
  });

  useRefreshOnFocus(refetch);

  if (isError || !data) {
    return (
      <View className="flex-1 bg-background p-4">
        <Text className="text-2xl font-bold">Error loading entry</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <EntryHeader entry={data.journal_cards} isLoading={isLoading} />
        {/* <EntryContent entry={data.journal_cards} isLoading={isLoading} /> */}
        <MediaSection
          media={data.media_attachments}
          entry={data.journal_cards}
          isLoading={isLoading}
        />
        <EntryMetrics entry={data.journal_cards} isLoading={isLoading} />
        <EntryActions entryId={id} isLoading={isLoading} />
      </ScrollView>
    </View>
  );
}
